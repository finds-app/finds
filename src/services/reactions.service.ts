import { supabase } from './supabase'
import type { CreateReactionPayload, ReactionDto, ReactionRow } from '@/types'

const mapReactionRow = (row: ReactionRow): ReactionDto => ({
  id: row.id,
  findId: row.find_id,
  userId: row.user_id,
  type: row.type,
  createdAt: row.created_at,
})

export const createReaction = async (payload: CreateReactionPayload): Promise<ReactionDto> => {
  const { data, error } = await supabase
    .from('reactions')
    .insert({
      find_id: payload.findId,
      user_id: payload.userId,
      type: payload.type ?? 'heart',
    })
    .select('*')
    .single()

  if (error) throw error
  return mapReactionRow(data as ReactionRow)
}

export const deleteReaction = async (findId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('reactions')
    .delete()
    .eq('find_id', findId)
    .eq('user_id', userId)

  if (error) throw error
}

export const getReactionsForFind = async (findId: string): Promise<ReactionDto[]> => {
  const { data, error } = await supabase
    .from('reactions')
    .select('*')
    .eq('find_id', findId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as ReactionRow[]).map(mapReactionRow)
}
