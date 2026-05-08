import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User as AuthUser, Session } from '@supabase/supabase-js'
import type { UserDto } from '@/types'
import * as authService from '@/services/auth.service'
import * as usersService from '@/services/users.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const session = ref<Session | null>(null)
  const profile = ref<UserDto | null>(null)
  const loading = ref(true)

  const isLoggedIn = computed(() => !!session.value)
  const hasProfile = computed(() => !!profile.value?.username)

  // Cached promise so init() is safe to call from multiple places
  let initPromise: Promise<void> | null = null

  const fetchProfile = async (): Promise<void> => {
    if (!user.value) {
      profile.value = null
      return
    }
    profile.value = await usersService.fetchProfile(user.value.id)
  }

  const init = () => {
    if (initPromise) return initPromise
    initPromise = _init()
    return initPromise
  }

  const _init = async (): Promise<void> => {
    try {
      session.value = await authService.getCurrentSession()
      user.value = session.value?.user ?? null
      if (user.value) await fetchProfile()

      authService.onAuthSessionChange(async (newSession) => {
        await setSession(newSession)
      })
    } finally {
      loading.value = false
    }
  }

  const setSession = async (newSession: Session | null): Promise<void> => {
    session.value = newSession
    user.value = newSession?.user ?? null
    if (user.value) {
      await fetchProfile()
    } else {
      profile.value = null
    }
  }

  const createProfile = async (username: string, displayName: string): Promise<UserDto> => {
    if (!user.value) throw new Error('Not logged in')
    const createdProfile = await usersService.createProfile({
      userId: user.value.id,
      username,
      displayName,
    })
    profile.value = createdProfile
    return createdProfile
  }

  const signOut = async (): Promise<void> => {
    await authService.signOut()
    profile.value = null
  }

  return {
    user, session, profile, loading,
    isLoggedIn, hasProfile,
    init, fetchProfile, createProfile, signOut,
  }
})
