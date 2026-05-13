import { ref, watch } from 'vue'
import { onIonViewDidEnter } from '@ionic/vue'
import { useRoute, useRouter } from 'vue-router'
import type { FeedItemDto } from '@/types'
import { buildMapRoute, buildTagRoute, pushUserProfile, ROUTES } from '@/constants'
import * as findsService from '@/services/finds.service'
import * as achievementsService from '@/services/achievements.service'
import { useReactions } from '@/composables/useReactions'
import { useAchievementCelebration } from '@/composables/useAchievementCelebration'
import { useAuthStore } from '@/stores/auth'
import { normalizeTag } from '@/services/tags.service'

export const useTagFeed = () => {
  const route = useRoute()
  const router = useRouter()

  const tagSlug = ref('')
  const invalidTag = ref(false)

  const syncRoute = () => {
    const raw = route.params.tag as string
    const decoded = raw ? decodeURIComponent(raw) : ''
    const normalized = normalizeTag(decoded)
    tagSlug.value = normalized
    invalidTag.value = !normalized
  }

  syncRoute()

  const items = ref<FeedItemDto[]>([])
  const loading = ref(!invalidTag.value)
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

    if (invalidTag.value) {
      items.value = []
      loading.value = false
      return
    }

    loading.value = true
    error.value = ''
    try {
      const data = await findsService.getTagFeed(tagSlug.value)
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

    if (invalidTag.value) {
      items.value = []
      return
    }

    refreshing.value = true
    error.value = ''
    try {
      const data = await findsService.getTagFeed(tagSlug.value)
      items.value = await enrich(data)
      hasMore.value = data.length >= 20
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to refresh'
    } finally {
      refreshing.value = false
    }
  }

  const loadMore = async () => {
    if (invalidTag.value || loading.value || !hasMore.value || items.value.length === 0) return
    loading.value = true
    try {
      const cursor = items.value[items.value.length - 1].createdAt
      const data = await findsService.getTagFeed(tagSlug.value, cursor)
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

  const goToUser = (userId: string) => {
    pushUserProfile(router, userId, authStore.user?.id)
  }

  const goToMap = (lat: number, lng: number, locationName?: string) => {
    router.push(buildMapRoute(lat, lng, locationName))
  }

  const goToCommunity = (communityId: string) => {
    router.push(`/community/${communityId}`)
  }

  const goToTag = (t: string) => {
    router.push(buildTagRoute(t))
  }

  const goToPostLinked = (findId: string) => {
    void router.push({ path: ROUTES.postFind, query: { linkTo: findId } })
  }

  const goBack = () => {
    router.back()
  }

  onIonViewDidEnter(load)

  watch(
    () => route.params.tag,
    () => {
      syncRoute()
      items.value = []
      hasMore.value = true
      void load()
    },
  )

  return {
    tagSlug,
    invalidTag,
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
    goToUser,
    goToMap,
    goToCommunity,
    goToTag,
    goToPostLinked,
    goBack,
  }
}
