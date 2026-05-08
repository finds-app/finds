import { ref } from 'vue'
import { onIonViewDidEnter } from '@ionic/vue'
import type { FeedItemDto } from '@/types'
import * as findsService from '@/services/finds.service'

export const useFeed = () => {
  const items = ref<FeedItemDto[]>([])
  const loading = ref(false)
  const refreshing = ref(false)
  const hasMore = ref(true)
  const error = ref('')
  const fullscreenImage = ref<string | null>(null)

  const load = async () => {
    if (loading.value) return
    loading.value = true
    error.value = ''
    try {
      const data = await findsService.getFeed()
      items.value = data
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
      items.value = data
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
      items.value.push(...data)
      hasMore.value = data.length >= 20
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to load more'
    } finally {
      loading.value = false
    }
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
    openFullscreen,
    closeFullscreen,
  }
}
