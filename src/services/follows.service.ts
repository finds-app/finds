import { supabase } from './supabase'
import type { CreateFollowPayload, FollowDto, FollowRow } from '@/types'

const mapFollowRow = (row: FollowRow): FollowDto => ({
  id: row.id,
  followerId: row.follower_id,
  followedId: row.followed_id,
  community: row.community,
  createdAt: row.created_at,
})

export const createFollow = async (payload: CreateFollowPayload): Promise<FollowDto> => {
  const { data, error } = await supabase
    .from('follows')
    .insert({
      follower_id: payload.followerId,
      followed_id: payload.followedId ?? null,
      community: payload.community ?? null,
    })
    .select('*')
    .single()

  if (error) throw error
  return mapFollowRow(data as FollowRow)
}

export const deleteFollow = async (
  followerId: string,
  followedId?: string | null,
  community?: string | null
): Promise<void> => {
  let query = supabase.from('follows').delete().eq('follower_id', followerId)

  if (followedId) query = query.eq('followed_id', followedId)
  if (community) query = query.eq('community', community)

  const { error } = await query
  if (error) throw error
}

export const getFollowsByUser = async (userId: string): Promise<FollowDto[]> => {
  const { data, error } = await supabase
    .from('follows')
    .select('*')
    .eq('follower_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as FollowRow[]).map(mapFollowRow)
}
