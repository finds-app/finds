import { ref } from 'vue'
import { onIonViewDidEnter, useIonRouter } from '@ionic/vue'
import { useRoute, useRouter } from 'vue-router'
import type { Community, FeedItemDto } from '@/types'
import { COMMUNITIES, buildMapRoute, buildTagRoute, pushUserProfile, ROUTES } from '@/constants'
import * as findsService from '@/services/finds.service'
import * as achievementsService from '@/services/achievements.service'
import { useReactions } from '@/composables/useReactions'
import { useAchievementCelebration } from '@/composables/useAchievementCelebration'
import { useAuthStore } from '@/stores/auth'

export const useCommunityFeed = () => {
  const route = useRoute()
  const router = useRouter()
  const ionRouter = useIonRouter()

  const community = ref<Community | null>(null)
  const invalidCommunity = ref(false)

  const syncRoute = () => {
    const id = route.params.communityId as string
    const resolved = COMMUNITIES.find((c) => c.id === id) ?? null
    community.value = resolved
    invalidCommunity.value = !resolved
  }

  syncRoute()

  const items = ref<FeedItemDto[]>([])
  const loading = ref(!!community.value && !invalidCommunity.value)
  const refreshing = ref(false)
  const hasMore = ref(true)
  const error = ref('')
  const togglingIds = new Set<string>()

  const authStore = useAuthStore()
  const { enrichWithReactions, toggleReaction: createToggle, toggleSave: createSaveToggle } = useReactions()
  const { celebrateSequence } = useAchievementCelebration()

  const enrich = async (data: FeedItemDto[]): Promise<FeedItemDto[]> => {
    if (!authStore.user?.id) return data
    return enrichWithReactions(data, authStore.user.id)
  }

  const load = async () => {
    syncRoute()

    if (!community.value) {
      items.value = []
      loading.value = false
      return
    }

    loading.value = true
    error.value = ''
    try {
      const data = await findsService.getCommunityFeed(community.value.id)
      items.value = await enrich(data)
      hasMore.value = data.length >= 20
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to load feed'
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => {
    syncRoute()

    if (!community.value) {
      items.value = []
      return
    }

    refreshing.value = true
    error.value = ''
    try {
      const data = await findsService.getCommunityFeed(community.value.id)
      items.value = await enrich(data)
      hasMore.value = data.length >= 20
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to refresh'
    } finally {
      refreshing.value = false
    }
  }

  const loadMore = async () => {
    if (!community.value || loading.value || !hasMore.value || items.value.length === 0) return
    loading.value = true
    try {
      const cursor = items.value[items.value.length - 1].createdAt
      const data = await findsService.getCommunityFeed(community.value.id, cursor)
      const enriched = await enrich(data)
      items.value.push(...enriched)
      hasMore.value = data.length >= 20
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to load more'
    } finally {
      loading.value = false
    }
  }

  const toggleReaction = async (findId: string) => {
    if (!authStore.user?.id || togglingIds.has(findId)) return
    const item = items.value.find((i) => i.id === findId)
    if (!item) return

    togglingIds.add(findId)
    const { optimisticUpdate, rollback, execute } = createToggle(
      findId,
      authStore.user.id,
      item.hasReacted,
    )

    const hadReacted = item.hasReacted

    optimisticUpdate(item)
    try {
      await execute()
      if (!hadReacted && authStore.user?.id) {
        const newIds = await achievementsService.checkAfterReaction(item.user.id, findId)
        if (newIds.length > 0 && item.user.id === authStore.user.id) {
          await celebrateSequence(newIds)
        }
      }
    } catch {
      rollback(item)
    } finally {
      togglingIds.delete(findId)
    }
  }

  const toggleSave = async (findId: string) => {
    if (!authStore.user?.id || togglingIds.has(`save-${findId}`)) return
    const item = items.value.find((i) => i.id === findId)
    if (!item) return

    togglingIds.add(`save-${findId}`)
    const { optimisticUpdate, rollback, execute } = createSaveToggle(
      findId,
      authStore.user.id,
      item.hasSaved,
    )

    optimisticUpdate(item)
    try {
      await execute()
    } catch {
      rollback(item)
    } finally {
      togglingIds.delete(`save-${findId}`)
    }
  }

  const goToFind = (findId: string) => {
    router.push(`/find/${findId}`)
  }

  const goToFindComments = (findId: string) => {
    router.push(`/find/${findId}?tab=comments`)
  }

  const goToUser = (userId: string) => {
    pushUserProfile(router, userId, authStore.user?.id)
  }

  const goToMap = (lat: number, lng: number, locationName?: string) => {
    ionRouter.navigate(buildMapRoute(lat, lng, locationName), 'root', 'push')
  }

  const goToCommunity = (communityId: string) => {
    router.push(`/community/${communityId}`)
  }

  const goToTag = (tag: string) => {
    router.push(buildTagRoute(tag))
  }

  const goToPostLinked = (findId: string) => {
    void router.push({ path: ROUTES.postFind, query: { linkTo: findId } })
  }

  const goBack = () => {
    router.back()
  }

  onIonViewDidEnter(load)

  return {
    community,
    invalidCommunity,
    items,
    loading,
    refreshing,
    hasMore,
    error,
    refresh,
    loadMore,
    toggleReaction,
    toggleSave,
    goToFind,
    goToFindComments,
    goToUser,
    goToMap,
    goToCommunity,
    goToTag,
    goToPostLinked,
    goBack,
  }
}
