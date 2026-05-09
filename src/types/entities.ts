export type CommunityId =
  | 'rare_bizarre'
  | 'everyday_beauty'
  | 'hyperlocal'
  | 'before_its_gone'
  | 'patterns'
  | 'human_traces'
  | 'overlooked_ordinary'

export interface Community {
  id: CommunityId
  label: string
  color: string
}

export interface MapFind {
  id: string
  lat: number
  lng: number
  imageUrl: string
  community: CommunityId | null
  createdAt: string
  user: { id: string; username: string }
}

export interface User {
  id: string
  username: string
  displayName: string | null
  bio: string | null
  avatarUrl: string | null
  createdAt: string
}

export interface Find {
  id: string
  userId: string
  imageUrl: string
  caption: string | null
  locationName: string | null
  lat: number | null
  lng: number | null
  community: CommunityId | null
  createdAt: string
}

export type ReactionType = 'heart'

export interface FeedItem {
  id: string
  imageUrl: string
  caption: string | null
  locationName: string | null
  lat: number | null
  lng: number | null
  community: CommunityId | null
  createdAt: string
  reactionCount: number
  hasReacted: boolean
  hasSaved: boolean
  user: {
    id: string
    username: string
    avatarUrl: string | null
  }
}

export interface FindDetail {
  id: string
  imageUrl: string
  caption: string | null
  locationName: string | null
  lat: number | null
  lng: number | null
  community: CommunityId | null
  createdAt: string
  reactionCount: number
  hasReacted: boolean
  hasSaved: boolean
  user: {
    id: string
    username: string
    displayName: string | null
    avatarUrl: string | null
  }
}
