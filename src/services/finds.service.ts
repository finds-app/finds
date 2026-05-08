import { supabase } from './supabase'
import type { CreateFindPayload, FeedItemDto, FindDto, FindRow } from '@/types'

const PAGE_SIZE = 20

const nullableNumber = (value: number | string | null): number | null =>
  value === null ? null : Number(value)

const mapFindRow = (row: FindRow): FindDto => ({
  id: row.id,
  userId: row.user_id,
  imageUrl: row.image_url,
  caption: row.caption,
  locationName: row.location_name,
  lat: nullableNumber(row.lat),
  lng: nullableNumber(row.lng),
  community: row.community,
  createdAt: row.created_at,
})

interface FeedRowWithUser {
  id: string
  image_url: string
  caption: string | null
  location_name: string | null
  community: string | null
  created_at: string
  users: { id: string; username: string; avatar_url: string | null }
}

const mapFeedRow = (row: FeedRowWithUser): FeedItemDto => ({
  id: row.id,
  imageUrl: row.image_url,
  caption: row.caption,
  locationName: row.location_name,
  community: row.community as FeedItemDto['community'],
  createdAt: row.created_at,
  user: {
    id: row.users.id,
    username: row.users.username,
    avatarUrl: row.users.avatar_url,
  },
})

export const getFeed = async (cursor?: string): Promise<FeedItemDto[]> => {
  let query = supabase
    .from('finds')
    .select('id, image_url, caption, location_name, community, created_at, users(id, username, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE)

  if (cursor) {
    query = query.lt('created_at', cursor)
  }

  const { data, error } = await query
  if (error) throw error
  return ((data ?? []) as unknown as FeedRowWithUser[]).map(mapFeedRow)
}

export const createFind = async (payload: CreateFindPayload): Promise<FindDto> => {
  const { data, error } = await supabase
    .from('finds')
    .insert({
      user_id: payload.userId,
      image_url: payload.imageUrl,
      caption: payload.caption,
      location_name: payload.locationName,
      lat: payload.lat,
      lng: payload.lng,
      community: payload.community,
    })
    .select('*')
    .single()

  if (error) throw error
  return mapFindRow(data as FindRow)
}

export const getFindById = async (findId: string): Promise<FindDto | null> => {
  const { data, error } = await supabase
    .from('finds')
    .select('*')
    .eq('id', findId)
    .maybeSingle()

  if (error) throw error
  return data ? mapFindRow(data as FindRow) : null
}

export const getFindsByUser = async (userId: string): Promise<FindDto[]> => {
  const { data, error } = await supabase
    .from('finds')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as FindRow[]).map(mapFindRow)
}
