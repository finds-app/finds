import { supabase } from './supabase'
import type { FindDto, FindRow } from '@/types'
import * as tagsService from './tags.service'

const nullableNumber = (value: number | string | null): number | null =>
  value === null ? null : Number(value)

const parseBadges = (raw: string[] | null | undefined): string[] =>
  Array.isArray(raw) ? raw.filter((b) => typeof b === 'string') : []

const mapFindRow = (row: FindRow): FindDto => ({
  id: row.id,
  userId: row.user_id,
  imageUrl: row.image_url,
  caption: row.caption,
  locationName: row.location_name,
  lat: nullableNumber(row.lat),
  lng: nullableNumber(row.lng),
  collection: row.community,
  badges: parseBadges(row.badges),
  tags: [],
  createdAt: row.created_at,
})

interface SavedFindRow {
  find_id: string
  created_at: string
  finds: FindRow | null
}

export const createSave = async (findId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('saves')
    .insert({ find_id: findId, user_id: userId })

  if (error) throw error
}

export const deleteSave = async (findId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('saves')
    .delete()
    .eq('find_id', findId)
    .eq('user_id', userId)

  if (error) throw error
}

export const getUserSavedFindIds = async (userId: string, findIds: string[]): Promise<Set<string>> => {
  if (findIds.length === 0) return new Set()

  const { data, error } = await supabase
    .from('saves')
    .select('find_id')
    .eq('user_id', userId)
    .in('find_id', findIds)

  if (error) throw error
  return new Set((data ?? []).map((r: { find_id: string }) => r.find_id))
}

/** All finds the user has saved, ordered by save date (newest first). */
export const getSavedFinds = async (userId: string): Promise<FindDto[]> => {
  const { data, error } = await supabase
    .from('saves')
    .select('find_id, created_at, finds(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  const rows = ((data ?? []) as unknown as SavedFindRow[])
    .map((r) => r.finds)
    .filter((f): f is FindRow => f !== null)
    .map(mapFindRow)

  if (rows.length === 0) return rows

  const tagMap = await tagsService.getTagsByFindIds(rows.map((r) => r.id))
  return rows.map((r) => ({ ...r, tags: tagMap.get(r.id) ?? [] }))
}
