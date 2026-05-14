import { ref } from 'vue'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { Capacitor } from '@capacitor/core'
import { ACHIEVEMENT_TEMPLATE_BY_ID } from '@/constants/achievements'
import type { AchievementTemplate } from '@/constants/achievements'
import type { AchievementTemplateId } from '@/types'

const current = ref<AchievementTemplate | null>(null)
let clearTimer: ReturnType<typeof setTimeout> | null = null

const clearTimerSafe = () => {
  if (clearTimer) {
    clearTimeout(clearTimer)
    clearTimer = null
  }
}

const triggerHaptic = async () => {
  if (!Capacitor.isNativePlatform()) return
  try {
    await Haptics.impact({ style: ImpactStyle.Medium })
  } catch {
    /* optional */
  }
}

export const useAchievementCelebration = () => {
  const celebrate = (template: AchievementTemplate) => {
    clearTimerSafe()
    current.value = template
    void triggerHaptic()
    clearTimer = setTimeout(() => {
      current.value = null
      clearTimer = null
    }, 3000)
  }

  const dismiss = () => {
    clearTimerSafe()
    current.value = null
  }

  /** Show celebrations one after another (multiple unlocks from one action). */
  const celebrateSequence = async (templateIds: AchievementTemplateId[]) => {
    for (let i = 0; i < templateIds.length; i += 1) {
      const id = templateIds[i]
      const template = ACHIEVEMENT_TEMPLATE_BY_ID[id]
      if (!template) continue
      celebrate(template)
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 3200)
      })
      dismiss()
      if (i < templateIds.length - 1) {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 350)
        })
      }
    }
  }

  return { current, celebrate, dismiss, celebrateSequence }
}
