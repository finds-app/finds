import { Capacitor } from '@capacitor/core'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

const getRedirectTo = () =>
  Capacitor.isNativePlatform()
    ? 'io.finds.app://login-callback'
    : window.location.origin

export const getCurrentSession = async (): Promise<Session | null> => {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export const signInWithMagicLink = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: getRedirectTo() },
  })
  if (error) throw error
}

export const setAuthSession = async (accessToken: string, refreshToken: string): Promise<Session | null> => {
  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  })
  if (error) throw error
  return data.session
}

export const onAuthSessionChange = (
  callback: (session: Session | null) => void | Promise<void>
) => {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
  return data.subscription
}

export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
