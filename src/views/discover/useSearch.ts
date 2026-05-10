import { ref, watch } from 'vue'
import * as searchService from '@/services/search.service'
import type { TagSearchResult, UserSearchResult } from '@/services/search.service'

const MIN_QUERY = 2
const DEBOUNCE_MS = 300

export interface PlaceSearchResult {
  id: string
  name: string
  region: string
  center: [number, number]
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

const searchPlaces = async (q: string): Promise<PlaceSearchResult[]> => {
  const trimmed = q.trim()
  if (trimmed.length < MIN_QUERY) return []
  if (!MAPBOX_TOKEN) return []

  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(trimmed)}.json?access_token=${MAPBOX_TOKEN}&types=place,locality,neighborhood,district,region,country&limit=5`
    const res = await fetch(url)
    if (!res.ok) return []
    const json = await res.json()
    return (json.features ?? []).map(
      (f: { id: string; center: [number, number]; place_name: string }) => {
        const parts = f.place_name.split(',')
        return {
          id: f.id,
          center: f.center,
          name: parts[0].trim(),
          region: parts.slice(1).join(',').trim(),
        }
      },
    ) as PlaceSearchResult[]
  } catch {
    return []
  }
}

export const useSearch = () => {
  const query = ref('')
  const users = ref<UserSearchResult[]>([])
  const tags = ref<TagSearchResult[]>([])
  const places = ref<PlaceSearchResult[]>([])
  const loading = ref(false)
  const error = ref('')
  /** When true, floating dropdown is visible (backdrop + results). */
  const dropdownOpen = ref(false)
  /** Suppresses the search watcher after a place/user/tag selection. */
  let suppressSearch = false

  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let requestId = 0

  const openDropdown = () => {
    suppressSearch = false
    dropdownOpen.value = true
  }

  const closeDropdown = () => {
    dropdownOpen.value = false
  }

  const runSearch = async (q: string) => {
    const trimmed = q.trim()
    if (trimmed.length < MIN_QUERY) {
      users.value = []
      tags.value = []
      places.value = []
      loading.value = false
      return
    }

    const id = ++requestId
    loading.value = true
    error.value = ''
    try {
      const [u, t, p] = await Promise.all([
        searchService.searchUsers(trimmed),
        searchService.searchTags(trimmed),
        searchPlaces(trimmed),
      ])
      if (id !== requestId) return
      users.value = u
      tags.value = t
      places.value = p
    } catch (e: unknown) {
      if (id !== requestId) return
      error.value = e instanceof Error ? e.message : 'Search failed'
      users.value = []
      tags.value = []
      places.value = []
    } finally {
      if (id === requestId) loading.value = false
    }
  }

  watch(
    () => query.value,
    (q) => {
      if (suppressSearch) return
      if (debounceTimer) clearTimeout(debounceTimer)
      const trimmed = q.trim()
      if (trimmed.length < MIN_QUERY) {
        users.value = []
        tags.value = []
        places.value = []
        loading.value = false
        error.value = ''
        return
      }
      loading.value = true
      debounceTimer = setTimeout(() => {
        debounceTimer = null
        void runSearch(q)
      }, DEBOUNCE_MS)
    },
  )

  const clear = () => {
    suppressSearch = true
    query.value = ''
    suppressSearch = false
    users.value = []
    tags.value = []
    places.value = []
    error.value = ''
    loading.value = false
    dropdownOpen.value = false
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
  }

  /** After navigating to user or tag */
  const dismiss = () => {
    clear()
  }

  /** After choosing a place: keep label in the search bar, suppress re-search. */
  const dismissAfterPlace = (placeName: string) => {
    suppressSearch = true
    closeDropdown()
    query.value = placeName
    users.value = []
    tags.value = []
    places.value = []
    error.value = ''
    loading.value = false
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
  }

  return {
    query,
    users,
    tags,
    places,
    loading,
    error,
    dropdownOpen,
    openDropdown,
    closeDropdown,
    clear,
    dismiss,
    dismissAfterPlace,
  }
}
