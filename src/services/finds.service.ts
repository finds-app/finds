import { supabase } from './supabase'
import type { CreateFindPayload, FindDto, FindRow } from '@/types'

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

export const getFeed = async (): Promise<FindDto[]> => {
  const { data, error } = await supabase
    .from('finds')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as FindRow[]).map(mapFindRow)
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
