import { supabase } from './supabase'
import type { CreateUserProfilePayload, UpdateUserProfilePayload, UserDto, UserRow } from '@/types'

const mapUserRow = (row: UserRow): UserDto => ({
  id: row.id,
  username: row.username,
  displayName: row.display_name,
  bio: row.bio,
  avatarUrl: row.avatar_url,
  createdAt: row.created_at,
})

export const fetchProfile = async (userId: string): Promise<UserDto | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data ? mapUserRow(data as UserRow) : null
}

export const createProfile = async (payload: CreateUserProfilePayload): Promise<UserDto> => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: payload.userId,
      username: payload.username.toLowerCase().trim(),
      display_name: payload.displayName.trim(),
    })
    .select('*')
    .single()

  if (error) throw error
  return mapUserRow(data as UserRow)
}

export const updateProfile = async (
  userId: string,
  payload: UpdateUserProfilePayload
): Promise<UserDto> => {
  const { data, error } = await supabase
    .from('users')
    .update({
      username: payload.username?.toLowerCase().trim(),
      display_name: payload.displayName,
      bio: payload.bio,
      avatar_url: payload.avatarUrl,
    })
    .eq('id', userId)
    .select('*')
    .single()

  if (error) throw error
  return mapUserRow(data as UserRow)
}
