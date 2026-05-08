import { supabase } from './supabase'

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
