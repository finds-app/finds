import { supabase } from './supabase'
import type { CreateReactionPayload, FollowUserDto } from '@/types'

export const createReaction = async (payload: CreateReactionPayload): Promise<void> => {
  const { error } = await supabase
    .from('reactions')
    .insert({
      find_id: payload.findId,
      user_id: payload.userId,
      type: payload.type ?? 'heart',
    })

  if (error) throw error
}

export const deleteReaction = async (findId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('reactions')
    .delete()
    .eq('find_id', findId)
    .eq('user_id', userId)

  if (error) throw error
}

export const getUserReactedFindIds = async (userId: string, findIds: string[]): Promise<Set<string>> => {
  if (findIds.length === 0) return new Set()

  const { data, error } = await supabase
    .from('reactions')
    .select('find_id')
    .eq('user_id', userId)
    .in('find_id', findIds)

  if (error) throw error
  return new Set((data ?? []).map((r: { find_id: string }) => r.find_id))
}

interface ReactedUserRow {
  created_at: string
  users: { id: string; username: string; display_name: string | null; avatar_url: string | null } | null
}

export const getReactedUsers = async (findId: string): Promise<FollowUserDto[]> => {
  const { data, error } = await supabase
    .from('reactions')
    .select('created_at, users(id, username, display_name, avatar_url)')
    .eq('find_id', findId)
    .eq('type', 'heart')
    .order('created_at', { ascending: false })

  if (error) throw error

  const rows = (data ?? []) as unknown as ReactedUserRow[]
  return rows
    .map((r) => r.users)
    .filter((u): u is NonNullable<ReactedUserRow['users']> => u !== null)
    .map((u) => ({
      id: u.id,
      username: u.username,
      displayName: u.display_name,
      avatarUrl: u.avatar_url,
    }))
}

