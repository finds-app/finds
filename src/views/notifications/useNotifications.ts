import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { onIonViewDidEnter, useIonRouter } from '@ionic/vue'
import type { NotificationDto } from '@/types'
import { ROUTES, pushUserProfile } from '@/constants'
import { useAuthStore } from '@/stores/auth'
import * as notificationsService from '@/services/notifications.service'

export const useNotifications = () => {
  const router = useRouter()
  const ionRouter = useIonRouter()
  const authStore = useAuthStore()

  const notifications = ref<NotificationDto[]>([])
  const loading = ref(true)

  const load = async () => {
    const userId = authStore.user?.id
    if (!userId) {
      notifications.value = []
      loading.value = false
      return
    }

    loading.value = true
    try {
      notifications.value = await notificationsService.getNotifications(userId)
    } catch {
      notifications.value = []
    } finally {
      loading.value = false
    }

    try {
      await notificationsService.markAllRead(userId)
    } catch {
      /* best-effort: re-entry will retry */
    }
  }

  const refresh = async () => {
    await load()
  }

  const goToFind = (findId: string) => {
    void router.push(`/find/${findId}`)
  }

  const goToUser = (userId: string) => {
    pushUserProfile(router, userId, authStore.user?.id)
  }

  const goBack = () => {
    if (ionRouter.canGoBack()) ionRouter.back()
    else ionRouter.push(ROUTES.profile)
  }

  onIonViewDidEnter(load)

  return {
    notifications,
    loading,
    refresh,
    goToFind,
    goToUser,
    goBack,
  }
}
