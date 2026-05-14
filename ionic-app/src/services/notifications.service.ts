import { supabase } from './supabase'
import type { NotificationDto, NotificationType } from '@/types'

const PAGE_SIZE = 50

interface NotificationRow {
  id: string
  user_id: string
  type: NotificationType
  actor_id: string
  find_id: string | null
  read: boolean
  created_at: string
}

interface ActorRow {
  id: string
  username: string
  avatar_url: string | null
}

interface FindThumbRow {
  id: string
  image_url: string
}

export const getNotifications = async (userId: string): Promise<NotificationDto[]> => {
  const { data: rows, error } = await supabase
    .from('notifications')
    .select('id, user_id, type, actor_id, find_id, read, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE)

  if (error) throw error
  const notificationRows = (rows ?? []) as NotificationRow[]
  if (notificationRows.length === 0) return []

  const actorIds = [...new Set(notificationRows.map((r) => r.actor_id))]
  const findIds = [
    ...new Set(notificationRows.map((r) => r.find_id).filter((id): id is string => !!id)),
  ]

  const [actorsResult, findsResult] = await Promise.all([
    actorIds.length > 0
      ? supabase.from('users').select('id, username, avatar_url').in('id', actorIds)
      : Promise.resolve({ data: [] as ActorRow[], error: null }),
    findIds.length > 0
      ? supabase.from('finds').select('id, image_url').in('id', findIds)
      : Promise.resolve({ data: [] as FindThumbRow[], error: null }),
  ])

  if (actorsResult.error) throw actorsResult.error
  if (findsResult.error) throw findsResult.error

  const actorMap = new Map<string, ActorRow>(
    ((actorsResult.data ?? []) as ActorRow[]).map((a) => [a.id, a]),
  )
  const findMap = new Map<string, FindThumbRow>(
    ((findsResult.data ?? []) as FindThumbRow[]).map((f) => [f.id, f]),
  )

  return notificationRows.map((row) => {
    const actor = actorMap.get(row.actor_id)
    const find = row.find_id ? findMap.get(row.find_id) : null
    return {
      id: row.id,
      userId: row.user_id,
      type: row.type,
      actorId: row.actor_id,
      findId: row.find_id,
      read: row.read,
      createdAt: row.created_at,
      actor: {
        id: actor?.id ?? row.actor_id,
        username: actor?.username ?? '',
        avatarUrl: actor?.avatar_url ?? null,
      },
      find: find ? { id: find.id, imageUrl: find.image_url } : null,
    }
  })
}

export const getUnreadCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false)

  if (error) throw error
  return count ?? 0
}

export const markAllRead = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)

  if (error) throw error
}

export const markRead = async (notificationId: string): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)

  if (error) throw error
}
