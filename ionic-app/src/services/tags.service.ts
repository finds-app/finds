import { supabase } from './supabase'

export const MAX_TAGS_PER_FIND = 3
export const MAX_TAG_LENGTH = 40

/** Lowercase slug: trim, strip leading #, spaces to hyphen, alphanumeric + _ - only */
export const normalizeTag = (raw: string): string => {
  let s = raw.trim().toLowerCase().replace(/^#+/g, '')
  s = s.replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '')
  if (s.length > MAX_TAG_LENGTH) s = s.slice(0, MAX_TAG_LENGTH)
  return s
}

export const normalizeTagsForSubmit = (tags: string[]): string[] => {
  const out: string[] = []
  const seen = new Set<string>()
  for (const t of tags) {
    const n = normalizeTag(t)
    if (!n || seen.has(n)) continue
    seen.add(n)
    out.push(n)
    if (out.length >= MAX_TAGS_PER_FIND) break
  }
  return out
}

/** Tags per find_id, ordered by created_at ascending within each find */
export const getTagsByFindIds = async (findIds: string[]): Promise<Map<string, string[]>> => {
  const map = new Map<string, string[]>()
  if (findIds.length === 0) return map
  for (const id of findIds) map.set(id, [])

  const { data, error } = await supabase
    .from('tags')
    .select('find_id, tag, created_at')
    .in('find_id', findIds)
    .order('find_id', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) throw error
  for (const row of (data ?? []) as { find_id: string; tag: string }[]) {
    const list = map.get(row.find_id) ?? []
    list.push(row.tag)
    map.set(row.find_id, list)
  }
  return map
}

export const insertTagsForFind = async (findId: string, userId: string, tags: string[]): Promise<void> => {
  const normalized = normalizeTagsForSubmit(tags)
  if (normalized.length === 0) return
  const rows = normalized.map((tag) => ({
    find_id: findId,
    tag,
    added_by: userId,
  }))
  const { error } = await supabase.from('tags').insert(rows)
  if (!error) return
  if ((error as { code?: string }).code === '23505') return
  throw error
}
