import { supabase } from './supabase'
import type { ChainedFindDto, CreateFindLinkPayload, FindDto, FindRow } from '@/types'
import type { CollectionId } from '@/types/entities'

interface ChainedFindRow {
  id: string
  image_url: string
  location_name: string | null
  community: string | null
  users: { id: string; username: string }
}

const mapChainedRow = (row: ChainedFindRow): ChainedFindDto => ({
  id: row.id,
  imageUrl: row.image_url,
  locationName: row.location_name,
  collection: row.community as CollectionId | null,
  user: { id: row.users.id, username: row.users.username },
})

const parseBadges = (raw: string[] | null | undefined): string[] =>
  Array.isArray(raw) ? raw.filter((b) => typeof b === 'string') : []

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
  collection: row.community,
  badges: parseBadges(row.badges),
  tags: [],
  createdAt: row.created_at,
})

export const createLink = async (payload: CreateFindLinkPayload): Promise<void> => {
  const { error } = await supabase.from('find_links').insert({
    find_id: payload.findId,
    linked_find_id: payload.linkedFindId,
    created_by: payload.createdBy,
  })
  if (!error) return
  if ((error as { code?: string }).code === '23505') return
  throw error
}

export const getLinkCount = async (findId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('find_links')
    .select('*', { count: 'exact', head: true })
    .or(`find_id.eq.${findId},linked_find_id.eq.${findId}`)

  if (error) throw error
  return count ?? 0
}

export const getLinkedFinds = async (findId: string): Promise<ChainedFindDto[]> => {
  const { data: links, error: linksError } = await supabase
    .from('find_links')
    .select('find_id, linked_find_id')
    .or(`find_id.eq.${findId},linked_find_id.eq.${findId}`)

  if (linksError) throw linksError

  const rows = (links ?? []) as { find_id: string; linked_find_id: string }[]
  const otherIds = [...new Set(rows.map((r) => (r.find_id === findId ? r.linked_find_id : r.find_id)))]

  if (otherIds.length === 0) return []

  const { data: finds, error: findsError } = await supabase
    .from('finds')
    .select('id, image_url, location_name, community, users(id, username)')
    .in('id', otherIds)

  if (findsError) throw findsError

  const mapped = ((finds ?? []) as unknown as ChainedFindRow[]).map(mapChainedRow)

  const order = new Map(otherIds.map((id, i) => [id, i]))
  return mapped.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0))
}

const isLinkedToTarget = (
  targetFindId: string,
  userFindId: string,
  linkRows: { find_id: string; linked_find_id: string }[],
): boolean =>
  linkRows.some(
    (r) =>
      (r.find_id === targetFindId && r.linked_find_id === userFindId) ||
      (r.find_id === userFindId && r.linked_find_id === targetFindId),
  )

export const getUserFindsNotLinked = async (
  userId: string,
  targetFindId: string,
): Promise<FindDto[]> => {
  const { data: userFinds, error: findsError } = await supabase
    .from('finds')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (findsError) throw findsError

  const { data: links, error: linksError } = await supabase
    .from('find_links')
    .select('find_id, linked_find_id')
    .or(`find_id.eq.${targetFindId},linked_find_id.eq.${targetFindId}`)

  if (linksError) throw linksError

  const linkRows = (links ?? []) as { find_id: string; linked_find_id: string }[]

  const rows = (userFinds ?? []) as FindRow[]
  const mapped = rows.map((r) => mapFindRow(r))

  return mapped.filter(
    (f) => f.id !== targetFindId && !isLinkedToTarget(targetFindId, f.id, linkRows),
  )
}

/** Counts links touching each find id (both endpoints). */
export const getChainCountsByFindIds = async (findIds: string[]): Promise<Map<string, number>> => {
  const result = new Map<string, number>(findIds.map((id) => [id, 0]))
  if (findIds.length === 0) return result

  const idSet = new Set(findIds)

  const [byFindId, byLinkedId] = await Promise.all([
    supabase.from('find_links').select('find_id, linked_find_id').in('find_id', findIds),
    supabase.from('find_links').select('find_id, linked_find_id').in('linked_find_id', findIds),
  ])

  if (byFindId.error) throw byFindId.error
  if (byLinkedId.error) throw byLinkedId.error

  const allRows = [...(byFindId.data ?? []), ...(byLinkedId.data ?? [])] as {
    find_id: string
    linked_find_id: string
  }[]

  const seen = new Set<string>()
  for (const r of allRows) {
    const key = `${r.find_id}:${r.linked_find_id}`
    if (seen.has(key)) continue
    seen.add(key)

    if (idSet.has(r.find_id)) result.set(r.find_id, (result.get(r.find_id) ?? 0) + 1)
    if (idSet.has(r.linked_find_id)) result.set(r.linked_find_id, (result.get(r.linked_find_id) ?? 0) + 1)
  }

  return result
}
