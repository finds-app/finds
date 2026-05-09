import { supabase } from './supabase'
import type { FollowUserDto } from '@/types'

export const getFollowersCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('followed_id', userId)

  if (error) throw error
  return count ?? 0
}

export const getFollowingCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId)

  if (error) throw error
  return count ?? 0
}

interface FollowRowUser {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
}

const mapFollowUser = (row: FollowRowUser): FollowUserDto => ({
  id: row.id,
  username: row.username,
  displayName: row.display_name,
  avatarUrl: row.avatar_url,
})

const fetchUsersByIds = async (ids: string[]): Promise<FollowUserDto[]> => {
  if (ids.length === 0) return []
  const { data, error } = await supabase
    .from('users')
    .select('id, username, display_name, avatar_url')
    .in('id', ids)

  if (error) throw error
  const rows = (data ?? []) as FollowRowUser[]
  const order = new Map(ids.map((id, i) => [id, i]))
  return rows
    .map(mapFollowUser)
    .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0))
}

export const isFollowing = async (followerId: string, followedId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('followed_id', followedId)
    .maybeSingle()

  if (error) throw error
  return !!data
}

export const followUser = async (followerId: string, followedId: string): Promise<void> => {
  const { error } = await supabase.from('follows').insert({
    follower_id: followerId,
    followed_id: followedId,
  })

  if (error) throw error
}

export const unfollowUser = async (followerId: string, followedId: string): Promise<void> => {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('followed_id', followedId)

  if (error) throw error
}

export const getFollowers = async (userId: string): Promise<FollowUserDto[]> => {
  const { data, error } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('followed_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  const ids: string[] = []
  const seen = new Set<string>()
  for (const r of data ?? []) {
    const id = r.follower_id as string | null
    if (id && !seen.has(id)) {
      seen.add(id)
      ids.push(id)
    }
  }
  return fetchUsersByIds(ids)
}

export const getFollowing = async (userId: string): Promise<FollowUserDto[]> => {
  const { data, error } = await supabase
    .from('follows')
    .select('followed_id')
    .eq('follower_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  const ids: string[] = []
  const seen = new Set<string>()
  for (const r of data ?? []) {
    const id = r.followed_id as string | null
    if (id && !seen.has(id)) {
      seen.add(id)
      ids.push(id)
    }
  }
  return fetchUsersByIds(ids)
}
