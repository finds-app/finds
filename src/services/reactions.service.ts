import { supabase } from './supabase'
import type { CreateReactionPayload } from '@/types'

export const createReaction = async (payload: CreateReactionPayload): Promise<void> => {
  const { error } = await supabase
    .from('reactions')
    .insert({
      find_id: payload.findId,
      user_id: payload.userId,
      type: payload.type ?? 'heart',
    })

  if (error) throw error
}

export const deleteReaction = async (findId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('reactions')
    .delete()
    .eq('find_id', findId)
    .eq('user_id', userId)

  if (error) throw error
}

export const getUserReactedFindIds = async (userId: string, findIds: string[]): Promise<Set<string>> => {
  if (findIds.length === 0) return new Set()

  const { data, error } = await supabase
    .from('reactions')
    .select('find_id')
    .eq('user_id', userId)
    .in('find_id', findIds)

  if (error) throw error
  return new Set((data ?? []).map((r: { find_id: string }) => r.find_id))
}

