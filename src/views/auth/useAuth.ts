import { computed, onUnmounted, ref } from 'vue'
import * as authService from '@/services/auth.service'

export const useAuth = () => {
  const email = ref('')
  const sent = ref(false)
  const resendCooldown = ref(0)
  const loading = ref(false)
  const error = ref('')
  let cooldownInterval: ReturnType<typeof setInterval> | null = null

  const canSubmit = computed(() => !!email.value && !loading.value)

  const startResendCooldown = () => {
    resendCooldown.value = 60
    if (cooldownInterval) clearInterval(cooldownInterval)
    cooldownInterval = setInterval(() => {
      resendCooldown.value -= 1
      if (resendCooldown.value <= 0 && cooldownInterval) {
        clearInterval(cooldownInterval)
        cooldownInterval = null
      }
    }, 1000)
  }

  const sendMagicLink = async (): Promise<void> => {
    if (!canSubmit.value) return
    loading.value = true
    error.value = ''
    try {
      await authService.signInWithMagicLink(email.value.trim())
      sent.value = true
      startResendCooldown()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Something went wrong'
    } finally {
      loading.value = false
    }
  }

  onUnmounted(() => {
    if (cooldownInterval) clearInterval(cooldownInterval)
  })

  return { email, sent, resendCooldown, canSubmit, loading, error, sendMagicLink }
}
