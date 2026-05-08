import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTES, USERNAME_RULES } from '@/constants'
import { useAuthStore } from '@/stores/auth'

export const useOnboarding = () => {
  const router = useRouter()
  const authStore = useAuthStore()

  const username = ref('')
  const displayName = ref('')
  const usernameError = ref('')
  const loading = ref(false)
  const error = ref('')

  const canSubmit = computed(() =>
    username.value.length >= USERNAME_RULES.minLength &&
    !usernameError.value &&
    displayName.value.trim().length >= 1
  )

  const updateUsername = (value: string) => {
    const normalized = value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    username.value = normalized
    usernameError.value = normalized.length > 0 && !USERNAME_RULES.regex.test(normalized)
      ? (normalized.length < USERNAME_RULES.minLength
          ? 'At least 3 characters'
          : 'Letters, numbers, and underscores only')
      : ''
  }

  const updateDisplayName = (value: string) => {
    displayName.value = value
  }

  const save = async (): Promise<void> => {
    if (!canSubmit.value || loading.value) return

    loading.value = true
    error.value = ''
    try {
      await authStore.createProfile(username.value, displayName.value)
      router.replace(ROUTES.feed)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Something went wrong'
      error.value = message
      if (message.toLowerCase().includes('unique') || message.toLowerCase().includes('duplicate')) {
        usernameError.value = 'That username is taken'
      }
    } finally {
      loading.value = false
    }
  }

  return {
    username,
    displayName,
    usernameError,
    canSubmit,
    loading,
    error,
    updateUsername,
    updateDisplayName,
    save,
  }
}
