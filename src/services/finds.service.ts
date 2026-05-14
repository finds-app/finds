import { supabase } from './supabase'
import type {
  CommunityId,
  CommunityPreviewDto,
  CreateFindPayload,
  FeedItemDto,
  FindDetailDto,
  FindDto,
  FindRow,
  MapFindDto,
} from '@/types'
import { COMMUNITIES } from '@/constants'
import * as badgesService from './badges.service'
import * as tagsService from './tags.service'
import * as chainsService from './chains.service'

const PAGE_SIZE = 20

const nullableNumber = (value: number | string | null): number | null =>
  value === null ? null : Number(value)

const parseBadges = (raw: string[] | null | undefined): string[] =>
  Array.isArray(raw) ? raw.filter((b) => typeof b === 'string') : []

const mapFindRow = (row: FindRow): FindDto => ({
  id: row.id,
  userId: row.user_id,
  imageUrl: row.image_url,
  caption: row.caption,
  locationName: row.location_name,
  lat: nullableNumber(row.lat),
  lng: nullableNumber(row.lng),
  community: row.community,
  badges: parseBadges(row.badges),
  tags: [],
  createdAt: row.created_at,
})

interface FeedRowWithUser {
  id: string
  image_url: string
  caption: string | null
  location_name: string | null
  lat: number | string | null
  lng: number | string | null
  community: string | null
  badges: string[] | null
  created_at: string
  users: { id: string; username: string; avatar_url: string | null }
  reactions: [{ count: number }]
  comments: [{ count: number }]
}

const mapFeedRow = (row: FeedRowWithUser): FeedItemDto => ({
  id: row.id,
  imageUrl: row.image_url,
  caption: row.caption,
  locationName: row.location_name,
  lat: nullableNumber(row.lat),
  lng: nullableNumber(row.lng),
  community: row.community as FeedItemDto['community'],
  badges: parseBadges(row.badges),
  tags: [],
  createdAt: row.created_at,
  reactionCount: row.reactions?.[0]?.count ?? 0,
  commentCount: row.comments?.[0]?.count ?? 0,
  hasReacted: false,
  hasSaved: false,
  chainCount: 0,
  user: {
    id: row.users.id,
    username: row.users.username,
    avatarUrl: row.users.avatar_url,
  },
})

const mergeTagsIntoFeedItems = async (items: FeedItemDto[]): Promise<FeedItemDto[]> => {
  if (items.length === 0) return items
  const tagMap = await tagsService.getTagsByFindIds(items.map((i) => i.id))
  return items.map((item) => ({ ...item, tags: tagMap.get(item.id) ?? [] }))
}

const mergeChainCountsIntoFeedItems = async (items: FeedItemDto[]): Promise<FeedItemDto[]> => {
  if (items.length === 0) return items
  const counts = await chainsService.getChainCountsByFindIds(items.map((i) => i.id))
  return items.map((item) => ({ ...item, chainCount: counts.get(item.id) ?? 0 }))
}

const mergeTrendingIntoFeedItems = async (items: FeedItemDto[]): Promise<FeedItemDto[]> => {
  if (items.length === 0) return items
  const counts = await badgesService.getRecentHeartCountsByFindId(items.map((i) => i.id))
  return items.map((item) => {
    const recent = counts.get(item.id) ?? 0
    const badges = [...item.badges]
    if (badgesService.shouldShowTrendingBadge(recent) && !badges.includes('trending')) {
      badges.push('trending')
    }
    return { ...item, badges }
  })
}

export const getFeed = async (cursor?: string): Promise<FeedItemDto[]> => {
  let query = supabase
    .from('finds')
    .select(
      'id, image_url, caption, location_name, lat, lng, community, badges, created_at, users(id, username, avatar_url), reactions(count), comments(count)',
    )
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE)

  if (cursor) {
    query = query.lt('created_at', cursor)
  }

  const { data, error } = await query
  if (error) throw error
  const mapped = ((data ?? []) as unknown as FeedRowWithUser[]).map(mapFeedRow)
  const withTags = await mergeTagsIntoFeedItems(mapped)
  const withTrending = await mergeTrendingIntoFeedItems(withTags)
  return mergeChainCountsIntoFeedItems(withTrending)
}

export const getCommunityFeed = async (
  communityId: CommunityId,
  cursor?: string,
): Promise<FeedItemDto[]> => {
  let query = supabase
    .from('finds')
    .select(
      'id, image_url, caption, location_name, lat, lng, community, badges, created_at, users(id, username, avatar_url), reactions(count), comments(count)',
    )
    .eq('community', communityId)
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE)

  if (cursor) {
    query = query.lt('created_at', cursor)
  }

  const { data, error } = await query
  if (error) throw error
  const mapped = ((data ?? []) as unknown as FeedRowWithUser[]).map(mapFeedRow)
  const withTags = await mergeTagsIntoFeedItems(mapped)
  const withTrending = await mergeTrendingIntoFeedItems(withTags)
  return mergeChainCountsIntoFeedItems(withTrending)
}

export const getTagFeed = async (rawTag: string, cursor?: string): Promise<FeedItemDto[]> => {
  const tag = tagsService.normalizeTag(rawTag)
  if (!tag) return []

  let query = supabase
    .from('finds')
    .select(
      'id, image_url, caption, location_name, lat, lng, community, badges, created_at, users(id, username, avatar_url), reactions(count), comments(count), tags!inner(tag)',
    )
    .eq('tags.tag', tag)
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE)

  if (cursor) {
    query = query.lt('created_at', cursor)
  }

  const { data, error } = await query
  if (error) throw error
  const mapped = ((data ?? []) as unknown as FeedRowWithUser[]).map(mapFeedRow)
  const withTags = await mergeTagsIntoFeedItems(mapped)
  const withTrending = await mergeTrendingIntoFeedItems(withTags)
  return mergeChainCountsIntoFeedItems(withTrending)
}

export const getFollowingFeed = async (
  viewerUserId: string,
  cursor?: string,
): Promise<FeedItemDto[]> => {
  const { data: followRows, error: followError } = await supabase
    .from('follows')
    .select('followed_id')
    .eq('follower_id', viewerUserId)

  if (followError) throw followError

  const followedIds = [...new Set((followRows ?? []).map((r: { followed_id: string | null }) => r.followed_id).filter(Boolean))] as string[]
  if (followedIds.length === 0) return []

  let query = supabase
    .from('finds')
    .select(
      'id, image_url, caption, location_name, lat, lng, community, badges, created_at, users(id, username, avatar_url), reactions(count), comments(count)',
    )
    .in('user_id', followedIds)
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE)

  if (cursor) {
    query = query.lt('created_at', cursor)
  }

  const { data, error } = await query
  if (error) throw error
  const mapped = ((data ?? []) as unknown as FeedRowWithUser[]).map(mapFeedRow)
  const withTags = await mergeTagsIntoFeedItems(mapped)
  const withTrending = await mergeTrendingIntoFeedItems(withTags)
  return mergeChainCountsIntoFeedItems(withTrending)
}

interface PreviewRow {
  image_url: string
}

const fetchCommunityPreview = async (communityId: CommunityId): Promise<CommunityPreviewDto> => {
  const [countResult, previewResult] = await Promise.all([
    supabase
      .from('finds')
      .select('*', { count: 'exact', head: true })
      .eq('community', communityId),
    supabase
      .from('finds')
      .select('image_url')
      .eq('community', communityId)
      .order('created_at', { ascending: false })
      .limit(4),
  ])

  if (countResult.error) throw countResult.error
  if (previewResult.error) throw previewResult.error

  const rows = (previewResult.data ?? []) as PreviewRow[]
  return {
    communityId,
    findCount: countResult.count ?? 0,
    previewImages: rows.map((r) => r.image_url),
  }
}

export const getCommunityPreviews = async (): Promise<CommunityPreviewDto[]> =>
  Promise.all(COMMUNITIES.map((c) => fetchCommunityPreview(c.id)))

export const createFind = async (payload: CreateFindPayload): Promise<FindDto> => {
  const { data, error } = await supabase
    .from('finds')
    .insert({
      user_id: payload.userId,
      image_url: payload.imageUrl,
      caption: payload.caption,
      location_name: payload.locationName,
      lat: payload.lat,
      lng: payload.lng,
      community: payload.community,
    })
    .select('*')
    .single()

  if (error) throw error
  const row = data as FindRow

  const staticBadges = await badgesService.computeStaticBadges({
    findId: row.id,
    userId: payload.userId,
    lat: nullableNumber(row.lat),
    lng: nullableNumber(row.lng),
    community: payload.community,
  })

  const { error: badgeError } = await supabase.from('finds').update({ badges: staticBadges }).eq('id', row.id)
  if (badgeError) throw badgeError

  try {
    await tagsService.insertTagsForFind(row.id, payload.userId, payload.tags ?? [])
  } catch {
    /* find still created; apply tags migration / RLS if insert fails */
  }

  const tagMap = await tagsService.getTagsByFindIds([row.id])
  return {
    ...mapFindRow({ ...row, badges: staticBadges } as FindRow),
    tags: tagMap.get(row.id) ?? [],
  }
}

interface DetailRowWithUser {
  id: string
  image_url: string
  caption: string | null
  location_name: string | null
  lat: number | string | null
  lng: number | string | null
  community: string | null
  badges: string[] | null
  created_at: string
  users: { id: string; username: string; display_name: string | null; avatar_url: string | null }
  reactions: [{ count: number }]
  comments: [{ count: number }]
}

export const getFindDetail = async (findId: string): Promise<FindDetailDto | null> => {
  const { data, error } = await supabase
    .from('finds')
    .select(
      'id, image_url, caption, location_name, lat, lng, community, badges, created_at, users(id, username, display_name, avatar_url), reactions(count), comments(count)',
    )
    .eq('id', findId)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const row = data as unknown as DetailRowWithUser
  const counts = await badgesService.getRecentHeartCountsByFindId([row.id])
  const recent = counts.get(row.id) ?? 0
  const badges = [...parseBadges(row.badges)]
  if (badgesService.shouldShowTrendingBadge(recent) && !badges.includes('trending')) {
    badges.push('trending')
  }

  const tagMap = await tagsService.getTagsByFindIds([row.id])
  const tags = tagMap.get(row.id) ?? []

  return {
    id: row.id,
    imageUrl: row.image_url,
    caption: row.caption,
    locationName: row.location_name,
    lat: nullableNumber(row.lat),
    lng: nullableNumber(row.lng),
    community: row.community as FindDetailDto['community'],
    badges,
    tags,
    createdAt: row.created_at,
    reactionCount: row.reactions?.[0]?.count ?? 0,
    commentCount: row.comments?.[0]?.count ?? 0,
    hasReacted: false,
    hasSaved: false,
    chainCount: 0,
    chainedFinds: [],
    user: {
      id: row.users.id,
      username: row.users.username,
      displayName: row.users.display_name,
      avatarUrl: row.users.avatar_url,
    },
  }
}

interface MapFindRow {
  id: string
  lat: number | string
  lng: number | string
  image_url: string
  community: string | null
  created_at: string
  users: { id: string; username: string }
}

export const getFindsForMap = async (): Promise<MapFindDto[]> => {
  const { data, error } = await supabase
    .from('finds')
    .select('id, lat, lng, image_url, community, created_at, users(id, username)')
    .not('lat', 'is', null)
    .not('lng', 'is', null)
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) throw error
  return ((data ?? []) as unknown as MapFindRow[]).map((row) => ({
    id: row.id,
    lat: Number(row.lat),
    lng: Number(row.lng),
    imageUrl: row.image_url,
    community: row.community as MapFindDto['community'],
    createdAt: row.created_at,
    user: { id: row.users.id, username: row.users.username },
  }))
}

export const getFindsByUser = async (userId: string): Promise<FindDto[]> => {
  const { data, error } = await supabase
    .from('finds')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  const rows = ((data ?? []) as FindRow[]).map((r) => mapFindRow(r))
  const tagMap = await tagsService.getTagsByFindIds(rows.map((r) => r.id))
  return rows.map((r) => ({ ...r, tags: tagMap.get(r.id) ?? [] }))
}
