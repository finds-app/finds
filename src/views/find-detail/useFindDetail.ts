import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FindDetailDto, CreateReactionPayload, FindDto } from '@/types'
import { useAuthStore } from '@/stores/auth'
import * as findsService from '@/services/finds.service'
import * as reactionsService from '@/services/reactions.service'
import * as savesService from '@/services/saves.service'
import * as achievementsService from '@/services/achievements.service'
import * as chainsService from '@/services/chains.service'
import { buildMapRoute, buildTagRoute, pushUserProfile, ROUTES } from '@/constants'
import { useAchievementCelebration } from '@/composables/useAchievementCelebration'

export const useFindDetail = () => {
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const { celebrateSequence } = useAchievementCelebration()

  const find = ref<FindDetailDto | null>(null)
  const loading = ref(true)
  const linkModalOpen = ref(false)
  const linkSubmitting = ref(false)
  const linkError = ref('')
  const linkModalFinds = ref<FindDto[]>([])
  const linkModalLoading = ref(false)

  const showNoticedToo = computed(() => {
    const uid = authStore.user?.id
    return !!uid && uid !== find.value?.user.id
  })

  const refreshChains = async (findId: string) => {
    if (!find.value || find.value.id !== findId) return
    const chained = await chainsService.getLinkedFinds(findId)
    find.value.chainedFinds = chained
    find.value.chainCount = chained.length
  }

  const load = async () => {
    const findId = route.params.findId as string
    if (!findId) return

    loading.value = true
    try {
      const [data, chained] = await Promise.all([
        findsService.getFindDetail(findId),
        chainsService.getLinkedFinds(findId),
      ])
      if (!data) return

      data.chainedFinds = chained
      data.chainCount = chained.length

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

  const goToPostLinked = () => {
    if (!find.value) return
    void router.push({ path: ROUTES.postFind, query: { linkTo: find.value.id } })
  }

  const openLinkModal = async () => {
    linkError.value = ''
    linkModalOpen.value = true
    const uid = authStore.user?.id
    const fid = find.value?.id
    if (!uid || !fid) return
    linkModalLoading.value = true
    linkModalFinds.value = []
    try {
      linkModalFinds.value = await chainsService.getUserFindsNotLinked(uid, fid)
    } catch {
      linkModalFinds.value = []
    } finally {
      linkModalLoading.value = false
    }
  }

  const closeLinkModal = () => {
    linkModalOpen.value = false
  }

  const linkExistingFind = async (linkedFindId: string) => {
    const fid = find.value?.id
    const uid = authStore.user?.id
    if (!fid || !uid || linkSubmitting.value) return

    linkSubmitting.value = true
    linkError.value = ''
    try {
      await chainsService.createLink({ findId: fid, linkedFindId, createdBy: uid })
      await refreshChains(fid)
      linkModalOpen.value = false
    } catch (e: unknown) {
      linkError.value = e instanceof Error ? e.message : 'Could not link find'
    } finally {
      linkSubmitting.value = false
    }
  }

  const goToChainedFind = (findId: string) => {
    void router.push(`/find/${findId}`)
  }

  watch(
    () => route.params.findId,
    () => {
      void load()
    },
    { immediate: true },
  )

  return {
    find,
    loading,
    linkModalOpen,
    linkSubmitting,
    linkError,
    linkModalFinds,
    linkModalLoading,
    showNoticedToo,
    toggleReaction,
    toggleSave,
    goToUser,
    goToMap,
    goToCommunity,
    goToTag,
    goBack,
    goToPostLinked,
    openLinkModal,
    closeLinkModal,
    linkExistingFind,
    goToChainedFind,
  }
}
