import type { CommunityId } from './entities'

export interface UserRow {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  created_at: string
}

export interface FindRow {
  id: string
  user_id: string
  image_url: string
  caption: string | null
  location_name: string | null
  lat: number | string | null
  lng: number | string | null
  community: CommunityId | null
  badges: string[] | null
  created_at: string
}

export interface AchievementRow {
  id: string
  user_id: string
  template: string
  unlocked_at: string
  metadata: Record<string, unknown> | null
}

export interface TagRow {
  id: string
  find_id: string
  tag: string
  added_by: string
  created_at: string
}

export interface FindLinkRow {
  id: string
  find_id: string
  linked_find_id: string
  created_by: string
  created_at: string
}

export type NotificationTypeRow = 'reaction' | 'follow' | 'chain' | 'comment'

export interface NotificationRow {
  id: string
  user_id: string
  type: NotificationTypeRow
  actor_id: string
  find_id: string | null
  read: boolean
  created_at: string
}

export interface CommentRow {
  id: string
  find_id: string
  user_id: string
  body: string
  created_at: string
}
