import { ref } from 'vue'
import { onIonViewDidEnter } from '@ionic/vue'
import { useRouter } from 'vue-router'
import type { FeedItemDto } from '@/types'
import * as findsService from '@/services/finds.service'
import { useReactions } from '@/composables/useReactions'
import { useAuthStore } from '@/stores/auth'
import { buildMapRoute } from '@/constants'

export const useFeed = () => {
  const items = ref<FeedItemDto[]>([])
  const loading = ref(false)
  const refreshing = ref(false)
  const hasMore = ref(true)
  const error = ref('')
  const fullscreenImage = ref<string | null>(null)
  const togglingIds = new Set<string>()

  const authStore = useAuthStore()
  const { enrichWithReactions, toggleReaction: createToggle, toggleSave: createSaveToggle } = useReactions()
  const router = useRouter()

  const enrich = async (data: FeedItemDto[]): Promise<FeedItemDto[]> => {
    if (!authStore.user?.id) return data
    return enrichWithReactions(data, authStore.user.id)
  }

  const load = async () => {
    if (loading.value) return
    loading.value = true
    error.value = ''
    try {
      const data = await findsService.getFeed()
      items.value = await enrich(data)
      hasMore.value = data.length >= 20
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to load feed'
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => {
    refreshing.value = true
    error.value = ''
    try {
      const data = await findsService.getFeed()
      items.value = await enrich(data)
      hasMore.value = data.length >= 20
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to refresh'
    } finally {
      refreshing.value = false
    }
  }

  const loadMore = async () => {
    if (loading.value || !hasMore.value || items.value.length === 0) return
    loading.value = true
    try {
      const cursor = items.value[items.value.length - 1].createdAt
      const data = await findsService.getFeed(cursor)
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
      item.hasReacted
    )

    optimisticUpdate(item)
    try {
      await execute()
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
      item.hasSaved
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
    router.push(`/user/${userId}`)
  }

  const goToMap = (lat: number, lng: number, locationName?: string) => {
    router.push(buildMapRoute(lat, lng, locationName))
  }

  const openFullscreen = (imageUrl: string) => {
    fullscreenImage.value = imageUrl
  }

  const closeFullscreen = () => {
    fullscreenImage.value = null
  }

  onIonViewDidEnter(load)

  return {
    items,
    loading,
    refreshing,
    hasMore,
    error,
    fullscreenImage,
    refresh,
    loadMore,
    toggleReaction,
    toggleSave,
    goToFind,
    goToUser,
    goToMap,
    openFullscreen,
    closeFullscreen,
  }
}
