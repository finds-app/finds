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

export interface Reaction {
  id: string
  findId: string
  userId: string
  type: ReactionType
  createdAt: string
}

export interface Follow {
  id: string
  followerId: string | null
  followedId: string | null
  community: string | null
  createdAt: string
}

export interface Achievement {
  id: string
  userId: string
  template: string
  unlockedAt: string
  metadata: Record<string, unknown> | null
}

export interface Tag {
  id: string
  findId: string
  tag: string
  addedBy: string | null
  createdAt: string
}
