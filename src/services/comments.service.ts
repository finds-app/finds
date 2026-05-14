import { supabase } from './supabase'
import type { CommentDto, CreateCommentPayload } from '@/types'

export const MAX_COMMENT_LENGTH = 500

interface CommentRowWithUser {
  id: string
  find_id: string
  body: string
  created_at: string
  users: { id: string; username: string; display_name: string | null; avatar_url: string | null } | null
}

const mapCommentRow = (row: CommentRowWithUser): CommentDto => ({
  id: row.id,
  findId: row.find_id,
  body: row.body,
  createdAt: row.created_at,
  user: {
    id: row.users?.id ?? '',
    username: row.users?.username ?? '',
    displayName: row.users?.display_name ?? null,
    avatarUrl: row.users?.avatar_url ?? null,
  },
})

export const createComment = async (payload: CreateCommentPayload): Promise<CommentDto> => {
  const body = payload.body.trim()
  if (!body) throw new Error('Comment cannot be empty')
  if (body.length > MAX_COMMENT_LENGTH) {
    throw new Error(`Comment must be ${MAX_COMMENT_LENGTH} characters or fewer`)
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      find_id: payload.findId,
      user_id: payload.userId,
      body,
    })
    .select('id, find_id, body, created_at, users(id, username, display_name, avatar_url)')
    .single()

  if (error) throw error
  return mapCommentRow(data as unknown as CommentRowWithUser)
}

export const deleteComment = async (commentId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId)

  if (error) throw error
}

export const getComments = async (findId: string): Promise<CommentDto[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select('id, find_id, body, created_at, users(id, username, display_name, avatar_url)')
    .eq('find_id', findId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return ((data ?? []) as unknown as CommentRowWithUser[]).map(mapCommentRow)
}

/** Count comments per find id. Missing keys default to 0 in the returned map. */
export const getCommentCountsByFindIds = async (findIds: string[]): Promise<Map<string, number>> => {
  const result = new Map<string, number>(findIds.map((id) => [id, 0]))
  if (findIds.length === 0) return result

  const { data, error } = await supabase
    .from('comments')
    .select('find_id')
    .in('find_id', findIds)

  if (error) throw error

  for (const row of (data ?? []) as { find_id: string }[]) {
    result.set(row.find_id, (result.get(row.find_id) ?? 0) + 1)
  }
  return result
}
