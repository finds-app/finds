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
  created_at: string
}
