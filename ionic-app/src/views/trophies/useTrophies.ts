import { computed, ref } from 'vue'
import { onIonViewDidEnter } from '@ionic/vue'
import type { AchievementProgressDto } from '@/types'
import { ACHIEVEMENT_TEMPLATES } from '@/constants/achievements'
import { useAuthStore } from '@/stores/auth'
import * as achievementsService from '@/services/achievements.service'

export const useTrophies = () => {
  const authStore = useAuthStore()
  const progress = ref<AchievementProgressDto[]>([])
  const loading = ref(true)
  const error = ref('')

  const templates = ACHIEVEMENT_TEMPLATES

  const earnedCount = computed(() => progress.value.filter((p) => p.unlocked).length)

  const load = async () => {
    const uid = authStore.user?.id
    if (!uid) {
      progress.value = []
      loading.value = false
      return
    }
    loading.value = true
    error.value = ''
    try {
      progress.value = await achievementsService.getAchievementProgressList(uid)
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to load'
    } finally {
      loading.value = false
    }
  }

  onIonViewDidEnter(load)

  const progressById = computed(() => {
    const m = new Map<string, AchievementProgressDto>()
    for (const p of progress.value) {
      m.set(p.templateId, p)
    }
    return m
  })

  return {
    progress,
    progressById,
    loading,
    error,
    templates,
    earnedCount,
    load,
  }
}
