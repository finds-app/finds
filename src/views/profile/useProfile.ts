import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onIonViewDidEnter } from '@ionic/vue'
import type { UserDto, FindDto, ProfileStatsDto } from '@/types'
import { ROUTES } from '@/constants'
import { useAuthStore } from '@/stores/auth'
import * as usersService from '@/services/users.service'
import * as findsService from '@/services/finds.service'
import * as followsService from '@/services/follows.service'

export const useProfile = () => {
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()

  const profile = ref<UserDto | null>(null)
  const finds = ref<FindDto[]>([])
  const stats = ref<ProfileStatsDto>({ findsCount: 0, followersCount: 0, followingCount: 0 })
  const loading = ref(true)
  const editingBio = ref(false)
  const bioDraft = ref('')
  const savingBio = ref(false)

  const isOwnProfile = computed(() => {
    const paramId = route.params.userId as string | undefined
    return !paramId || paramId === authStore.user?.id
  })

  const targetUserId = computed(() => {
    const paramId = route.params.userId as string | undefined
    return paramId || authStore.user?.id || null
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

      const [userFinds, followers, following] = await Promise.all([
        findsService.getFindsByUser(userId),
        followsService.getFollowersCount(userId),
        followsService.getFollowingCount(userId),
      ])

      finds.value = userFinds
      stats.value = {
        findsCount: userFinds.length,
        followersCount: followers,
        followingCount: following,
      }
    } catch {
      profile.value = null
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => {
    await load()
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

  onIonViewDidEnter(load)

  return {
    profile,
    finds,
    stats,
    loading,
    isOwnProfile,
    editingBio,
    bioDraft,
    savingBio,
    refresh,
    startEditBio,
    cancelEditBio,
    saveBio,
    goToFind,
    signOut,
  }
}
