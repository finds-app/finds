import { supabase } from './supabase'
import type { UserRow } from '@/types/supabase'

export interface UserSearchResult {
  id: string
  username: string
  displayName: string | null
  avatarUrl: string | null
}

export interface TagSearchResult {
  tag: string
  findCount: number
}

const DEFAULT_LIMIT = 10

/** Escape `%`, `_`, and `\` for use inside PostgREST `ilike` patterns. */
const escapeIlike = (raw: string): string =>
  raw.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')

const mapUserRow = (row: UserRow): UserSearchResult => ({
  id: row.id,
  username: row.username,
  displayName: row.display_name,
  avatarUrl: row.avatar_url,
})

/**
 * Search users by username or display name (case-insensitive).
 */
export const searchUsers = async (query: string, limit = DEFAULT_LIMIT): Promise<UserSearchResult[]> => {
  const q = query.trim()
  if (q.length < 2) return []

  const pattern = `%${escapeIlike(q)}%`

  const [byUsername, byDisplay] = await Promise.all([
    supabase
      .from('users')
      .select('id, username, display_name, avatar_url')
      .ilike('username', pattern)
      .limit(limit),
    supabase
      .from('users')
      .select('id, username, display_name, avatar_url')
      .ilike('display_name', pattern)
      .limit(limit),
  ])

  if (byUsername.error) throw byUsername.error
  if (byDisplay.error) throw byDisplay.error

  const rows = [...(byUsername.data ?? []), ...(byDisplay.data ?? [])] as Pick<
    UserRow,
    'id' | 'username' | 'display_name' | 'avatar_url'
  >[]
  const seen = new Set<string>()
  const out: UserSearchResult[] = []
  for (const row of rows) {
    if (seen.has(row.id)) continue
    seen.add(row.id)
    out.push(
      mapUserRow({
        ...row,
        bio: null,
        created_at: '',
      } as UserRow),
    )
    if (out.length >= limit) break
  }
  return out
}

const TAG_SAMPLE_LIMIT = 200

/**
 * Search tags by substring; returns distinct tags with find counts (approximate from sample).
 */
export const searchTags = async (query: string, limit = DEFAULT_LIMIT): Promise<TagSearchResult[]> => {
  const q = query.trim()
  if (q.length < 2) return []

  const pattern = `%${escapeIlike(q)}%`

  const { data, error } = await supabase
    .from('tags')
    .select('tag')
    .ilike('tag', pattern)
    .limit(TAG_SAMPLE_LIMIT)

  if (error) throw error

  const counts = new Map<string, number>()
  for (const row of (data ?? []) as { tag: string }[]) {
    counts.set(row.tag, (counts.get(row.tag) ?? 0) + 1)
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([tag, findCount]) => ({ tag, findCount }))
}
