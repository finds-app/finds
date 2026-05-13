import type {
  Achievement,
  AchievementTemplateId,
  ChainedFind,
  CommunityId,
  FeedItem,
  Find,
  FindDetail,
  FollowUser,
  MapFind,
  ReactionType,
  User,
} from './entities'

export type UserDto = User
export type FollowUserDto = FollowUser
export type FindDto = Find
export type FeedItemDto = FeedItem
export type FindDetailDto = FindDetail
export type ChainedFindDto = ChainedFind
export type MapFindDto = MapFind

export interface CreateFindLinkPayload {
  findId: string
  linkedFindId: string
  createdBy: string
}

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
  /** Normalized tags (0–3); server-side normalization also applied */
  tags?: string[]
}

export interface CreateReactionPayload {
  findId: string
  userId: string
  type?: ReactionType
}

export interface ProfileStatsDto {
  findsCount: number
  followersCount: number
  followingCount: number
  trophiesCount: number
}

export type AchievementDto = Achievement

export interface AchievementProgressDto {
  templateId: AchievementTemplateId
  current: number
  goal: number
  unlocked: boolean
  unlockedAt: string | null
}

export interface UploadedFileDto {
  path: string
  publicUrl: string
}

export interface CommunityPreviewDto {
  communityId: CommunityId
  findCount: number
  previewImages: string[]
}
