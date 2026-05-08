import type {
  Achievement,
  CommunityId,
  Find,
  Follow,
  Reaction,
  ReactionType,
  Tag,
  User,
} from './entities'

export type UserDto = User
export type FindDto = Find
export type ReactionDto = Reaction
export type FollowDto = Follow
export type AchievementDto = Achievement
export type TagDto = Tag

export interface CreateUserProfilePayload {
  userId: string
  username: string
  displayName: string
}

export interface UpdateUserProfilePayload {
  username?: string
  displayName?: string | null
  bio?: string | null
  avatarUrl?: string | null
}

export interface CreateFindPayload {
  userId: string
  imageUrl: string
  caption: string | null
  locationName: string | null
  lat: number | null
  lng: number | null
  community: CommunityId | null
}

export interface CreateReactionPayload {
  findId: string
  userId: string
  type?: ReactionType
}

export interface CreateFollowPayload {
  followerId: string
  followedId?: string | null
  community?: string | null
}

export interface UploadedFileDto {
  path: string
  publicUrl: string
}
