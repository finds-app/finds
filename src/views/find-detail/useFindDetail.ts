import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FindDetailDto, CreateReactionPayload } from '@/types'
import { useAuthStore } from '@/stores/auth'
import * as findsService from '@/services/finds.service'
import * as reactionsService from '@/services/reactions.service'
import * as savesService from '@/services/saves.service'
import * as achievementsService from '@/services/achievements.service'
import { buildMapRoute, buildTagRoute, pushUserProfile } from '@/constants'
import { useAchievementCelebration } from '@/composables/useAchievementCelebration'

export const useFindDetail = () => {
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const { celebrateSequence } = useAchievementCelebration()

  const find = ref<FindDetailDto | null>(null)
  const loading = ref(true)

  const load = async () => {
    const findId = route.params.findId as string
    if (!findId) return

    loading.value = true
    try {
      const data = await findsService.getFindDetail(findId)
      if (!data) return

      if (authStore.user?.id) {
        const [reactedIds, savedIds] = await Promise.all([
          reactionsService.getUserReactedFindIds(authStore.user.id, [findId]),
          savesService.getUserSavedFindIds(authStore.user.id, [findId]),
        ])
        data.hasReacted = reactedIds.has(findId)
        data.hasSaved = savedIds.has(findId)
      }

      find.value = data
    } finally {
      loading.value = false
    }
  }

  const toggleReaction = async () => {
    if (!find.value || !authStore.user?.id) return
    const prev = find.value.hasReacted
    const findId = find.value.id
    const ownerId = find.value.user.id

    find.value.hasReacted = !prev
    find.value.reactionCount += prev ? -1 : 1

    try {
      if (prev) {
        await reactionsService.deleteReaction(find.value.id, authStore.user.id)
      } else {
        const payload: CreateReactionPayload = { findId: find.value.id, userId: authStore.user.id, type: 'heart' }
        await reactionsService.createReaction(payload)
        const newIds = await achievementsService.checkAfterReaction(ownerId, findId)
        if (newIds.length > 0 && ownerId === authStore.user.id) {
          await celebrateSequence(newIds)
        }
      }
    } catch {
      find.value.hasReacted = prev
      find.value.reactionCount += prev ? 1 : -1
    }
  }

  const toggleSave = async () => {
    if (!find.value || !authStore.user?.id) return
    const prev = find.value.hasSaved
    find.value.hasSaved = !prev

    try {
      if (prev) {
        await savesService.deleteSave(find.value.id, authStore.user.id)
      } else {
        await savesService.createSave(find.value.id, authStore.user.id)
      }
    } catch {
      find.value.hasSaved = prev
    }
  }

  const goToUser = (userId: string) => {
    pushUserProfile(router, userId, authStore.user?.id)
  }

  const goToMap = () => {
    if (!find.value?.lat || !find.value?.lng) return
    router.push(buildMapRoute(find.value.lat, find.value.lng, find.value.locationName))
  }

  const goToCommunity = (communityId: string) => {
    router.push(`/community/${communityId}`)
  }

  const goToTag = (tag: string) => {
    router.push(buildTagRoute(tag))
  }

  const goBack = () => {
    router.back()
  }

  load()

  return {
    find,
    loading,
    toggleReaction,
    toggleSave,
    goToUser,
    goToMap,
    goToCommunity,
    goToTag,
    goBack,
  }
}
