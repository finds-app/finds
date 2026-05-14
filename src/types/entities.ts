export type CollectionId =
  | 'rare_bizarre'
  | 'everyday_beauty'
  | 'hyperlocal'
  | 'before_its_gone'
  | 'patterns'
  | 'human_traces'
  | 'overlooked_ordinary'

export interface Collection {
  id: CollectionId
  label: string
  color: string
  description: string
}

export interface MapFind {
  id: string
  lat: number
  lng: number
  imageUrl: string
  collection: CollectionId | null
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

export interface FollowUser {
  id: string
  username: string
  displayName: string | null
  avatarUrl: string | null
}

export interface ChainedFind {
  id: string
  imageUrl: string
  locationName: string | null
  collection: CollectionId | null
  user: { id: string; username: string }
}

export interface Find {
  id: string
  userId: string
  imageUrl: string
  caption: string | null
  locationName: string | null
  lat: number | null
  lng: number | null
  collection: CollectionId | null
  badges: string[]
  tags: string[]
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
  collection: CollectionId | null
  badges: string[]
  tags: string[]
  createdAt: string
  reactionCount: number
  commentCount: number
  hasReacted: boolean
  hasSaved: boolean
  /** Number of finds linked to this find (bidirectional) */
  chainCount: number
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
  collection: CollectionId | null
  badges: string[]
  tags: string[]
  createdAt: string
  reactionCount: number
  commentCount: number
  hasReacted: boolean
  hasSaved: boolean
  chainCount: number
  chainedFinds: ChainedFind[]
  user: {
    id: string
    username: string
    displayName: string | null
    avatarUrl: string | null
  }
}

export interface Comment {
  id: string
  findId: string
  body: string
  createdAt: string
  user: {
    id: string
    username: string
    displayName: string | null
    avatarUrl: string | null
  }
}

export type AchievementTemplateId =
  | 'first_find'
  | 'explorer'
  | 'dedicated'
  | 'globe_trotter'
  | 'world_traveler'
  | 'city_explorer'
  | 'renaissance'
  | 'curator'
  | 'beloved'
  | 'first_follower'
  | 'rare_eye'
  | 'preservationist'
  | 'pattern_spotter'
  | 'local_expert'
  | 'beauty_seeker'

export interface Achievement {
  id: string
  userId: string
  template: AchievementTemplateId
  unlockedAt: string
  metadata: Record<string, unknown> | null
}

export type NotificationType = 'reaction' | 'follow' | 'chain' | 'comment'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  actorId: string
  findId: string | null
  read: boolean
  createdAt: string
  actor: { id: string; username: string; avatarUrl: string | null }
  find: { id: string; imageUrl: string } | null
}
