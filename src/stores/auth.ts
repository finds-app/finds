import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface Profile {
  username: string
  display_name: string | null
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const profile = ref<Profile | null>(null)
  const loading = ref(true)

  const isLoggedIn = computed(() => !!session.value)
  const hasProfile = computed(() => !!profile.value?.username)

  async function init() {
    const { data } = await supabase.auth.getSession()
    session.value = data.session
    user.value = data.session?.user ?? null
    if (user.value) await fetchProfile()
    loading.value = false

    supabase.auth.onAuthStateChange(async (_event: string, newSession: Session | null) => {
      session.value = newSession
      user.value = newSession?.user ?? null
      if (user.value) {
        await fetchProfile()
      } else {
        profile.value = null
      }
    })
  }

  async function fetchProfile() {
    if (!user.value) return
    const { data } = await supabase
      .from('users')
      .select('username, display_name')
      .eq('id', user.value.id)
      .maybeSingle()
    profile.value = data
  }

  async function createProfile(username: string, displayName: string) {
    if (!user.value) return { error: new Error('Not logged in') }
    const { error } = await supabase.from('users').insert({
      id: user.value.id,
      username: username.toLowerCase().trim(),
      display_name: displayName.trim(),
    })
    if (!error) await fetchProfile()
    return { error }
  }

  async function signOut() {
    await supabase.auth.signOut()
    profile.value = null
  }

  return {
    user, session, profile, loading,
    isLoggedIn, hasProfile,
    init, fetchProfile, createProfile, signOut,
  }
})
