import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onIonViewDidEnter, useIonRouter } from '@ionic/vue'
import type { FollowUserDto, UserDto, FindDto, ProfileStatsDto } from '@/types'
import { ROUTES, pushUserProfile } from '@/constants'
import { useAuthStore } from '@/stores/auth'
import * as usersService from '@/services/users.service'
import * as findsService from '@/services/finds.service'
import * as followsService from '@/services/follows.service'

export const useProfile = () => {
  const route = useRoute()
  const router = useRouter()
  const ionRouter = useIonRouter()
  const authStore = useAuthStore()

  const profile = ref<UserDto | null>(null)
  const finds = ref<FindDto[]>([])
  const stats = ref<ProfileStatsDto>({ findsCount: 0, followersCount: 0, followingCount: 0 })
  const loading = ref(true)
  const viewMode = ref<'grid' | 'map'>('grid')
  const editingBio = ref(false)
  const bioDraft = ref('')
  const savingBio = ref(false)

  const isFollowing = ref(false)
  const followLoading = ref(false)

  const followListMode = ref<'followers' | 'following' | null>(null)
  const followListUsers = ref<FollowUserDto[]>([])
  const followListLoading = ref(false)

  const mapFinds = computed(() => finds.value.filter((f) => f.lat && f.lng))

  const isOwnProfile = computed(() => {
    const paramId = route.params.userId as string | undefined
    return !paramId || paramId === authStore.user?.id
  })

  const targetUserId = computed(() => {
    const paramId = route.params.userId as string | undefined
    return paramId || authStore.user?.id || null
  })

  /** Own profile: title + toggle only when they have finds. Other user: always show chrome (back + optional toggle). */
  const showProfileChrome = computed(() => {
    if (!isOwnProfile.value) return !!(route.params.userId as string | undefined)
    return !!profile.value && !loading.value && finds.value.length > 0
  })

  const load = async () => {
    const userId = targetUserId.value
    if (!userId) return

    loading.value = true
    try {
      if (isOwnProfile.value && authStore.profile) {
        profile.value = authStore.profile
      } else {
        profile.value = await usersService.fetchProfile(userId)
      }

      const viewerId = authStore.user?.id
      const [userFinds, followers, following, followingRel] = await Promise.all([
        findsService.getFindsByUser(userId),
        followsService.getFollowersCount(userId),
        followsService.getFollowingCount(userId),
        viewerId && viewerId !== userId
          ? followsService.isFollowing(viewerId, userId)
          : Promise.resolve(false),
      ])

      finds.value = userFinds
      stats.value = {
        findsCount: userFinds.length,
        followersCount: followers,
        followingCount: following,
      }
      isFollowing.value = followingRel
    } catch {
      profile.value = null
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => {
    await load()
  }

  const toggleFollow = async () => {
    const viewerId = authStore.user?.id
    const subjectId = targetUserId.value
    if (!viewerId || !subjectId || viewerId === subjectId || followLoading.value) return

    const wasFollowing = isFollowing.value
    followLoading.value = true
    isFollowing.value = !wasFollowing
    stats.value = {
      ...stats.value,
      followersCount: Math.max(0, stats.value.followersCount + (wasFollowing ? -1 : 1)),
    }

    try {
      if (wasFollowing) {
        await followsService.unfollowUser(viewerId, subjectId)
      } else {
        await followsService.followUser(viewerId, subjectId)
      }
    } catch {
      isFollowing.value = wasFollowing
      stats.value = {
        ...stats.value,
        followersCount: Math.max(0, stats.value.followersCount + (wasFollowing ? 1 : -1)),
      }
    } finally {
      followLoading.value = false
    }
  }

  const openFollowList = async (mode: 'followers' | 'following') => {
    const uid = targetUserId.value
    if (!uid) return
    followListMode.value = mode
    followListLoading.value = true
    followListUsers.value = []
    try {
      followListUsers.value =
        mode === 'followers' ? await followsService.getFollowers(uid) : await followsService.getFollowing(uid)
    } finally {
      followListLoading.value = false
    }
  }

  const closeFollowList = () => {
    followListMode.value = null
    followListUsers.value = []
  }

  const goToFollowUser = (userId: string) => {
    closeFollowList()
    pushUserProfile(router, userId, authStore.user?.id)
  }

  const startEditBio = () => {
    editingBio.value = true
    bioDraft.value = profile.value?.bio ?? ''
  }

  const cancelEditBio = () => {
    editingBio.value = false
    bioDraft.value = ''
  }

  const saveBio = async () => {
    if (!authStore.user?.id || savingBio.value) return
    savingBio.value = true
    try {
      const updated = await usersService.updateProfile(authStore.user.id, { bio: bioDraft.value.trim() || null })
      profile.value = updated
      authStore.profile = updated
      editingBio.value = false
    } finally {
      savingBio.value = false
    }
  }

  const goToFind = (findId: string) => {
    router.push(`/find/${findId}`)
  }

  const signOut = async () => {
    await authStore.signOut()
    router.replace(ROUTES.welcome)
  }

  const goBack = () => {
    if (ionRouter.canGoBack()) ionRouter.back()
    else ionRouter.push(ROUTES.feed)
  }

  onIonViewDidEnter(load)

  return {
    profile,
    finds,
    mapFinds,
    stats,
    loading,
    viewMode,
    isOwnProfile,
    showProfileChrome,
    isFollowing,
    followLoading,
    followListMode,
    followListUsers,
    followListLoading,
    editingBio,
    bioDraft,
    savingBio,
    refresh,
    toggleFollow,
    openFollowList,
    closeFollowList,
    goToFollowUser,
    startEditBio,
    cancelEditBio,
    saveBio,
    goToFind,
    signOut,
    goBack,
  }
}
