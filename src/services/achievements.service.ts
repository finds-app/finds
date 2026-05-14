import { supabase } from './supabase'
import { ACHIEVEMENT_TEMPLATES, ACHIEVEMENT_TEMPLATE_BY_ID } from '@/constants/achievements'
import type { AchievementTemplate } from '@/constants/achievements'
import type {
  AchievementDto,
  AchievementProgressDto,
  AchievementTemplateId,
  CollectionId,
} from '@/types'
import type { AchievementRow } from '@/types/supabase'
import * as followsService from './follows.service'

const mapAchievementRow = (row: AchievementRow): AchievementDto => ({
  id: row.id,
  userId: row.user_id,
  template: row.template as AchievementTemplateId,
  unlockedAt: row.unlocked_at,
  metadata: row.metadata,
})

export const fetchUnlockedTemplateIds = async (userId: string): Promise<Set<AchievementTemplateId>> => {
  const { data, error } = await supabase.from('achievements').select('template').eq('user_id', userId)

  if (error) throw error
  const ids = (data ?? []).map((r: { template: string }) => r.template).filter(Boolean) as AchievementTemplateId[]
  return new Set(ids)
}

export const getAchievementsCount = async (userId: string): Promise<number> => {
  await syncUserAchievements(userId)
  const { count, error } = await supabase
    .from('achievements')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (error) throw error
  return count ?? 0
}

export const getUserAchievements = async (userId: string): Promise<AchievementDto[]> => {
  const { data, error } = await supabase
    .from('achievements')
    .select('id, user_id, template, unlocked_at, metadata')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as AchievementRow[]).map(mapAchievementRow)
}

const insertAchievement = async (userId: string, template: AchievementTemplateId): Promise<void> => {
  const { error } = await supabase.from('achievements').insert({
    user_id: userId,
    template,
    metadata: {},
  })
  if (!error) return
  // Unique violation / duplicate — treat as already unlocked (Postgres 23505)
  if ((error as { code?: string }).code === '23505') return
  throw error
}

interface UserFindStats {
  totalFinds: number
  distinctCountries: number
  distinctCities: number
  distinctCollections: Set<CollectionId>
  collectionCounts: Record<CollectionId, number>
  maxHeartsOnAnyFind: number
}

const ALL_COLLECTION_IDS: CollectionId[] = [
  'rare_bizarre',
  'everyday_beauty',
  'hyperlocal',
  'before_its_gone',
  'patterns',
  'human_traces',
  'overlooked_ordinary',
]

const gatherUserFindStats = async (userId: string): Promise<UserFindStats> => {
  const { data: findRows, error } = await supabase
    .from('finds')
    .select('id, location_name, community')
    .eq('user_id', userId)

  if (error) throw error

  const rows = (findRows ?? []) as { id: string; location_name: string | null; community: CollectionId | null }[]
  const countryKeys = new Set<string>()
  const cityKeys = new Set<string>()
  const distinctCollections = new Set<CollectionId>()
  const collectionCounts = {} as Record<CollectionId, number>
  for (const id of ALL_COLLECTION_IDS) {
    collectionCounts[id] = 0
  }

  for (const r of rows) {
    if (r.location_name) {
      const parts = r.location_name.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
      if (parts.length >= 2) {
        countryKeys.add(parts[parts.length - 1])
        cityKeys.add(parts[0])
      } else if (parts.length === 1) {
        cityKeys.add(parts[0])
      }
    }
    if (r.community) {
      distinctCollections.add(r.community)
      collectionCounts[r.community] += 1
    }
  }

  const findIds = rows.map((r) => r.id)
  let maxHeartsOnAnyFind = 0
  if (findIds.length > 0) {
    const { data: reactionRows, error: rErr } = await supabase
      .from('reactions')
      .select('find_id')
      .in('find_id', findIds)
      .eq('type', 'heart')

    if (rErr) throw rErr
    const byFind = new Map<string, number>()
    for (const row of reactionRows ?? []) {
      const fid = (row as { find_id: string }).find_id
      byFind.set(fid, (byFind.get(fid) ?? 0) + 1)
    }
    for (const n of byFind.values()) {
      if (n > maxHeartsOnAnyFind) maxHeartsOnAnyFind = n
    }
  }

  return {
    totalFinds: rows.length,
    distinctCountries: countryKeys.size,
    distinctCities: cityKeys.size,
    distinctCollections,
    collectionCounts,
    maxHeartsOnAnyFind,
  }
}

const hasRenaissance = (distinct: Set<CollectionId>): boolean =>
  ALL_COLLECTION_IDS.every((id) => distinct.has(id))

export const checkAfterPost = async (userId: string): Promise<AchievementTemplateId[]> => {
  const unlocked = await fetchUnlockedTemplateIds(userId)
  const stats = await gatherUserFindStats(userId)
  const candidates: AchievementTemplateId[] = []

  if (!unlocked.has('first_find') && stats.totalFinds >= 1) candidates.push('first_find')
  if (!unlocked.has('explorer') && stats.totalFinds >= 5) candidates.push('explorer')
  if (!unlocked.has('dedicated') && stats.totalFinds >= 25) candidates.push('dedicated')
  if (!unlocked.has('globe_trotter') && stats.distinctCountries >= 3) candidates.push('globe_trotter')
  if (!unlocked.has('world_traveler') && stats.distinctCountries >= 7) candidates.push('world_traveler')
  if (!unlocked.has('city_explorer') && stats.distinctCities >= 5) candidates.push('city_explorer')
  if (!unlocked.has('renaissance') && hasRenaissance(stats.distinctCollections)) candidates.push('renaissance')
  if (!unlocked.has('curator') && stats.maxHeartsOnAnyFind >= 10) candidates.push('curator')
  if (!unlocked.has('beloved') && stats.maxHeartsOnAnyFind >= 50) candidates.push('beloved')

  if (!unlocked.has('rare_eye') && stats.collectionCounts.rare_bizarre >= 5) candidates.push('rare_eye')
  if (!unlocked.has('preservationist') && stats.collectionCounts.before_its_gone >= 5) candidates.push('preservationist')
  if (!unlocked.has('pattern_spotter') && stats.collectionCounts.patterns >= 5) candidates.push('pattern_spotter')
  if (!unlocked.has('local_expert') && stats.collectionCounts.hyperlocal >= 10) candidates.push('local_expert')
  if (!unlocked.has('beauty_seeker') && stats.collectionCounts.everyday_beauty >= 10) candidates.push('beauty_seeker')

  const newly: AchievementTemplateId[] = []
  for (const template of candidates) {
    if (unlocked.has(template)) continue
    await insertAchievement(userId, template)
    unlocked.add(template)
    newly.push(template)
  }
  return newly
}

export const checkAfterReaction = async (findOwnerUserId: string, findId: string): Promise<AchievementTemplateId[]> => {
  const { count, error } = await supabase
    .from('reactions')
    .select('*', { count: 'exact', head: true })
    .eq('find_id', findId)
    .eq('type', 'heart')

  if (error) throw error
  const heartCount = count ?? 0

  const unlocked = await fetchUnlockedTemplateIds(findOwnerUserId)
  const newly: AchievementTemplateId[] = []

  if (!unlocked.has('curator') && heartCount >= 10) {
    await insertAchievement(findOwnerUserId, 'curator')
    newly.push('curator')
    unlocked.add('curator')
  }
  if (!unlocked.has('beloved') && heartCount >= 50) {
    await insertAchievement(findOwnerUserId, 'beloved')
    newly.push('beloved')
  }

  return newly
}

export const checkAfterFollow = async (followedUserId: string): Promise<AchievementTemplateId[]> => {
  const count = await followsService.getFollowersCount(followedUserId)
  const unlocked = await fetchUnlockedTemplateIds(followedUserId)
  const newly: AchievementTemplateId[] = []

  if (!unlocked.has('first_follower') && count >= 1) {
    await insertAchievement(followedUserId, 'first_follower')
    newly.push('first_follower')
  }

  return newly
}

/**
 * Inserts any achievement rows the user has already earned by data (finds, hearts, followers)
 * but may be missing — e.g. posted before trophies shipped, or insert failed once.
 */
export const syncUserAchievements = async (userId: string): Promise<void> => {
  await checkAfterPost(userId)
  await checkAfterFollow(userId)
}

const progressCurrent = (template: AchievementTemplate, stats: UserFindStats, followersCount: number): number => {
  switch (template.id) {
    case 'first_find':
    case 'explorer':
    case 'dedicated':
      return Math.min(stats.totalFinds, template.goal)
    case 'globe_trotter':
    case 'world_traveler':
      return Math.min(stats.distinctCountries, template.goal)
    case 'city_explorer':
      return Math.min(stats.distinctCities, template.goal)
    case 'renaissance':
      return Math.min(stats.distinctCollections.size, template.goal)
    case 'curator':
    case 'beloved':
      return Math.min(stats.maxHeartsOnAnyFind, template.goal)
    case 'first_follower':
      return Math.min(followersCount, template.goal)
    default: {
      const cid = template.collectionId
      if (!cid) return 0
      return Math.min(stats.collectionCounts[cid] ?? 0, template.goal)
    }
  }
}

export const getAchievementProgressList = async (userId: string): Promise<AchievementProgressDto[]> => {
  await syncUserAchievements(userId)
  const [unlockedRows, stats, followersCount] = await Promise.all([
    getUserAchievements(userId),
    gatherUserFindStats(userId),
    followsService.getFollowersCount(userId),
  ])
  const unlockedAtByTemplate = new Map<AchievementTemplateId, string>()
  for (const a of unlockedRows) {
    unlockedAtByTemplate.set(a.template, a.unlockedAt)
  }

  return ACHIEVEMENT_TEMPLATES.map((template) => {
    const unlockedAt = unlockedAtByTemplate.get(template.id) ?? null
    const unlocked = !!unlockedAt
    const current = unlocked ? template.goal : progressCurrent(template, stats, followersCount)
    return {
      templateId: template.id,
      current,
      goal: template.goal,
      unlocked,
      unlockedAt,
    }
  })
}

export const getTemplateForCelebration = (id: AchievementTemplateId): AchievementTemplate =>
  ACHIEVEMENT_TEMPLATE_BY_ID[id]
