import { supabase } from './supabase'
import type { BadgeId } from '@/constants/badges'
import type { CollectionId } from '@/types'

const EARTH_KM = 6371

const haversineKm = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_KM * c
}

/** ~5 km latitude delta */
const LAT_DELTA_5KM = 5 / 111
const lngDeltaForKm = (lat: number, km: number): number => km / (111 * Math.max(Math.cos((lat * Math.PI) / 180), 0.2))

export interface ComputeStaticBadgesInput {
  findId: string
  userId: string
  lat: number | null
  lng: number | null
  collection: CollectionId | null
}

export const computeStaticBadges = async (input: ComputeStaticBadgesInput): Promise<BadgeId[]> => {
  const badges: BadgeId[] = []

  const { count: userFindCount, error: countError } = await supabase
    .from('finds')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', input.userId)

  if (countError) throw countError
  if ((userFindCount ?? 0) === 1) badges.push('pioneer')

  const latNum = input.lat !== null && !Number.isNaN(Number(input.lat)) ? Number(input.lat) : null
  const lngNum = input.lng !== null && !Number.isNaN(Number(input.lng)) ? Number(input.lng) : null
  if (latNum === null || lngNum === null) return badges

  const latMin = latNum - LAT_DELTA_5KM
  const latMax = latNum + LAT_DELTA_5KM
  const lngD = lngDeltaForKm(latNum, 5)
  const lngMin = lngNum - lngD
  const lngMax = lngNum + lngD

  const { data: nearbyRows, error: nearbyError } = await supabase
    .from('finds')
    .select('id, lat, lng')
    .neq('id', input.findId)
    .not('lat', 'is', null)
    .not('lng', 'is', null)
    .gte('lat', latMin)
    .lte('lat', latMax)
    .gte('lng', lngMin)
    .lte('lng', lngMax)

  if (nearbyError) throw nearbyError

  const othersWithin5km = (nearbyRows ?? []).filter((r: { id: string; lat: unknown; lng: unknown }) => {
    const la = Number(r.lat)
    const ln = Number(r.lng)
    return haversineKm(latNum, lngNum, la, ln) <= 5
  })

  if (othersWithin5km.length === 0) badges.push('first_here')

  if (input.collection) {
    const latMin50 = latNum - 50 / 111
    const latMax50 = latNum + 50 / 111
    const lngD50 = lngDeltaForKm(latNum, 50)
    const lngMin50 = lngNum - lngD50
    const lngMax50 = lngNum + lngD50

    const { data: collectionRows, error: collectionError } = await supabase
      .from('finds')
      .select('id, lat, lng')
      .eq('community', input.collection)
      .neq('id', input.findId)
      .not('lat', 'is', null)
      .not('lng', 'is', null)
      .gte('lat', latMin50)
      .lte('lat', latMax50)
      .gte('lng', lngMin50)
      .lte('lng', lngMax50)

    if (collectionError) throw collectionError

    const othersWithin50km = (collectionRows ?? []).filter((r: { lat: unknown; lng: unknown }) => {
      const la = Number(r.lat)
      const ln = Number(r.lng)
      return haversineKm(latNum, lngNum, la, ln) <= 50
    })

    if (othersWithin50km.length <= 1) badges.push('rare')
  }

  return badges
}

const TRENDING_HEARTS = 5
const TRENDING_WINDOW_HOURS = 24

/** Count heart reactions per find in the last window (for trending badge). */
export const getRecentHeartCountsByFindId = async (findIds: string[]): Promise<Map<string, number>> => {
  const map = new Map<string, number>()
  if (findIds.length === 0) return map

  const since = new Date(Date.now() - TRENDING_WINDOW_HOURS * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('reactions')
    .select('find_id')
    .in('find_id', findIds)
    .eq('type', 'heart')
    .gte('created_at', since)

  if (error) throw error

  for (const row of data ?? []) {
    const id = (row as { find_id: string }).find_id
    map.set(id, (map.get(id) ?? 0) + 1)
  }

  return map
}

export const shouldShowTrendingBadge = (recentHeartCount: number): boolean =>
  recentHeartCount >= TRENDING_HEARTS
