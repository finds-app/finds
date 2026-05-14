import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useIonRouter } from '@ionic/vue'
import type {
  CommentDto,
  CreateReactionPayload,
  FindDetailDto,
  FindDto,
  FollowUserDto,
} from '@/types'
import { useAuthStore } from '@/stores/auth'
import * as findsService from '@/services/finds.service'
import * as reactionsService from '@/services/reactions.service'
import * as savesService from '@/services/saves.service'
import * as achievementsService from '@/services/achievements.service'
import * as chainsService from '@/services/chains.service'
import * as commentsService from '@/services/comments.service'
import * as storageService from '@/services/storage.service'
import { buildMapRoute, buildTagRoute, pushUserProfile, ROUTES } from '@/constants'
import { useAchievementCelebration } from '@/composables/useAchievementCelebration'

export const useFindDetail = () => {
  const route = useRoute()
  const router = useRouter()
  const ionRouter = useIonRouter()
  const authStore = useAuthStore()
  const { celebrateSequence } = useAchievementCelebration()

  const find = ref<FindDetailDto | null>(null)
  const loading = ref(true)
  const linkModalOpen = ref(false)
  const linkSubmitting = ref(false)
  const linkError = ref('')
  const linkModalFinds = ref<FindDto[]>([])
  const linkModalLoading = ref(false)

  const likesModalOpen = ref(false)
  const likesModalUsers = ref<FollowUserDto[]>([])
  const likesModalLoading = ref(false)

  const comments = ref<CommentDto[]>([])
  const commentsLoading = ref(false)
  const commentSubmitting = ref(false)
  const commentError = ref('')
  const newCommentText = ref('')

  const deleteSheetOpen = ref(false)
  const deleteSubmitting = ref(false)

  type DetailTab = 'comments' | 'linked'
  const activeTab = ref<DetailTab>('comments')

  const setActiveTab = (tab: DetailTab) => {
    activeTab.value = tab
  }

  const syncActiveTabFromRoute = () => {
    activeTab.value = route.query.tab === 'linked' ? 'linked' : 'comments'
  }

  const showNoticedToo = computed(() => {
    const uid = authStore.user?.id
    return !!uid && uid !== find.value?.user.id
  })

  const isOwner = computed(() => {
    const uid = authStore.user?.id
    return !!uid && uid === find.value?.user.id
  })

  const refreshChains = async (findId: string) => {
    if (!find.value || find.value.id !== findId) return
    const chained = await chainsService.getLinkedFinds(findId)
    find.value.chainedFinds = chained
    find.value.chainCount = chained.length
  }

  const loadComments = async (findId: string) => {
    commentsLoading.value = true
    try {
      comments.value = await commentsService.getComments(findId)
    } catch {
      comments.value = []
    } finally {
      commentsLoading.value = false
    }
  }

  const load = async () => {
    const findId = route.params.findId as string
    if (!findId) return

    loading.value = true
    try {
      const [data, chained] = await Promise.all([
        findsService.getFindDetail(findId),
        chainsService.getLinkedFinds(findId),
        loadComments(findId),
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
    ionRouter.navigate(buildMapRoute(find.value.lat, find.value.lng, find.value.locationName), 'root', 'push')
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

  const openLikesModal = async () => {
    const fid = find.value?.id
    if (!fid) return
    likesModalOpen.value = true
    likesModalLoading.value = true
    likesModalUsers.value = []
    try {
      likesModalUsers.value = await reactionsService.getReactedUsers(fid)
    } catch {
      likesModalUsers.value = []
    } finally {
      likesModalLoading.value = false
    }
  }

  const closeLikesModal = () => {
    likesModalOpen.value = false
    likesModalUsers.value = []
  }

  const goToLikedUser = (userId: string) => {
    closeLikesModal()
    pushUserProfile(router, userId, authStore.user?.id)
  }

  const submitComment = async () => {
    const fid = find.value?.id
    const uid = authStore.user?.id
    const body = newCommentText.value.trim()
    if (!fid || !uid || !body || commentSubmitting.value) return

    commentSubmitting.value = true
    commentError.value = ''
    try {
      const created = await commentsService.createComment({ findId: fid, userId: uid, body })
      comments.value = [...comments.value, created]
      if (find.value) find.value.commentCount += 1
      newCommentText.value = ''
    } catch (e: unknown) {
      commentError.value = e instanceof Error ? e.message : 'Could not post comment'
    } finally {
      commentSubmitting.value = false
    }
  }

  const removeComment = async (commentId: string) => {
    const uid = authStore.user?.id
    if (!uid) return

    const prev = comments.value
    const next = prev.filter((c) => c.id !== commentId)
    if (next.length === prev.length) return

    comments.value = next
    if (find.value) find.value.commentCount = Math.max(0, find.value.commentCount - 1)

    try {
      await commentsService.deleteComment(commentId, uid)
    } catch {
      comments.value = prev
      if (find.value) find.value.commentCount += 1
    }
  }

  const goToCommentUser = (userId: string) => {
    pushUserProfile(router, userId, authStore.user?.id)
  }

  const openDeleteSheet = () => {
    if (!isOwner.value) return
    deleteSheetOpen.value = true
  }

  const closeDeleteSheet = () => {
    if (deleteSubmitting.value) return
    deleteSheetOpen.value = false
  }

  const deleteFind = async () => {
    const uid = authStore.user?.id
    const target = find.value
    if (!uid || !target || target.user.id !== uid || deleteSubmitting.value) return

    deleteSubmitting.value = true
    try {
      await findsService.deleteFind(target.id, uid)

      const imagePath = storageService.extractStoragePathFromUrl(target.imageUrl)
      if (imagePath) {
        void storageService.deleteImage(imagePath).catch(() => {
          /* find row is gone; ignore orphan image cleanup failure */
        })
      }

      deleteSheetOpen.value = false
      void router.replace(ROUTES.feed)
    } catch {
      deleteSubmitting.value = false
    }
  }

  watch(
    () => route.params.findId,
    () => {
      syncActiveTabFromRoute()
      void load()
    },
    { immediate: true },
  )

  watch(() => route.query.tab, syncActiveTabFromRoute)

  return {
    find,
    loading,
    linkModalOpen,
    linkSubmitting,
    linkError,
    linkModalFinds,
    linkModalLoading,
    likesModalOpen,
    likesModalUsers,
    likesModalLoading,
    comments,
    commentsLoading,
    commentSubmitting,
    commentError,
    newCommentText,
    activeTab,
    setActiveTab,
    showNoticedToo,
    isOwner,
    deleteSheetOpen,
    deleteSubmitting,
    openDeleteSheet,
    closeDeleteSheet,
    deleteFind,
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
    openLikesModal,
    closeLikesModal,
    goToLikedUser,
    submitComment,
    removeComment,
    goToCommentUser,
  }
}
