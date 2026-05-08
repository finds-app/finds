import type { CommunityId, ReactionType } from './entities'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
  created_at: string
}

export interface ReactionRow {
  id: string
  find_id: string
  user_id: string
  type: ReactionType
  created_at: string
}

export interface FollowRow {
  id: string
  follower_id: string | null
  followed_id: string | null
  community: string | null
  created_at: string
}

export interface AchievementRow {
  id: string
  user_id: string
  template: string
  unlocked_at: string
  metadata: Json
}

export interface TagRow {
  id: string
  find_id: string
  tag: string
  added_by: string | null
  created_at: string
}
