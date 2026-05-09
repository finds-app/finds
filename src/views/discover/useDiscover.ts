import { ref, watch, nextTick } from 'vue'
import { onIonViewDidEnter } from '@ionic/vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { Geolocation } from '@capacitor/geolocation'
import { Capacitor } from '@capacitor/core'
import type { Map as MapboxMap } from 'mapbox-gl'
import type { CommunityId, CommunityPreviewDto, MapFindDto } from '@/types'
import { getCommunityPreviews, getFindsForMap } from '@/services/finds.service'

let mapInstance: MapboxMap | null = null

export const setMapInstance = (map: MapboxMap) => {
  mapInstance = map
}

export const useDiscover = () => {
  const route = useRoute()
  const router = useRouter()

  const viewMode = ref<'communities' | 'map'>('communities')
  const communityPreviews = ref<CommunityPreviewDto[]>([])
  const previewsLoading = ref(false)

  const finds = ref<MapFindDto[]>([])
  const selectedFind = ref<MapFindDto | null>(null)
  const userLocation = ref<[number, number] | null>(null)
  const mapReady = ref(false)
  const loading = ref(false)
  const locating = ref(false)
  const locationError = ref(false)
  const incomingSearchQuery = ref<string | null>(null)

  const loadFinds = async () => {
    loading.value = true
    try {
      finds.value = await getFindsForMap()
    } catch {
      // Failed to load map finds — leave markers empty
    } finally {
      loading.value = false
    }
  }

  const loadCommunityPreviews = async () => {
    previewsLoading.value = true
    try {
      communityPreviews.value = await getCommunityPreviews()
    } catch {
      // Failed to load previews — cards fall back to empty mosaic
    } finally {
      previewsLoading.value = false
    }
  }

  const applyRouteQuery = () => {
    const { lat, lng, location } = route.query
    if (lat && lng && mapInstance) {
      mapInstance.flyTo({
        center: [Number(lng), Number(lat)],
        zoom: 14,
        duration: 1200,
      })
    }
    incomingSearchQuery.value = null
    if (location) {
      nextTick(() => {
        incomingSearchQuery.value = String(location)
      })
    }
  }

  const syncMapRouteToViewMode = () => {
    const { lat, lng } = route.query
    if (lat && lng) viewMode.value = 'map'
  }

  const onMapReady = () => {
    mapReady.value = true
    loadFinds()
    applyRouteQuery()
  }

  watch(
    () => route.query,
    () => {
      syncMapRouteToViewMode()
      if (mapReady.value) applyRouteQuery()
    },
    { immediate: true },
  )

  const selectFind = (find: MapFindDto) => {
    selectedFind.value = find
  }

  const clearSelection = () => {
    selectedFind.value = null
  }

  const goToFindDetail = () => {
    if (!selectedFind.value) return
    router.push(`/find/${selectedFind.value.id}`)
  }

  const goToCommunityFeed = (communityId: CommunityId) => {
    router.push(`/community/${communityId}`)
  }

  const setViewMode = (mode: 'communities' | 'map') => {
    viewMode.value = mode
    if (mode === 'communities') void loadCommunityPreviews()
  }

  const getPreview = (id: CommunityId): CommunityPreviewDto =>
    communityPreviews.value.find((p) => p.communityId === id) ?? {
      communityId: id,
      findCount: 0,
      previewImages: [],
    }

  const flyToUser = async () => {
    if (locating.value) return
    locating.value = true
    locationError.value = false

    try {
      if (Capacitor.isNativePlatform()) {
        const perm = await Geolocation.requestPermissions()
        if (perm.location !== 'granted' && perm.coarseLocation !== 'granted') {
          locationError.value = true
          return
        }
      }

      const position = await Geolocation.getCurrentPosition({
        timeout: 10000,
        enableHighAccuracy: true,
      })

      const coords: [number, number] = [position.coords.longitude, position.coords.latitude]
      userLocation.value = coords
      if (mapInstance) {
        mapInstance.flyTo({ center: coords, zoom: 14, duration: 1400 })
      }
    } catch {
      locationError.value = true
    } finally {
      locating.value = false
    }
  }

  const clearLocationError = () => {
    locationError.value = false
  }

  const flyTo = (lng: number, lat: number, zoom = 13) => {
    if (!mapInstance) return
    mapInstance.flyTo({ center: [lng, lat], zoom, duration: 1200 })
  }

  onIonViewDidEnter(() => {
    if (viewMode.value === 'communities') void loadCommunityPreviews()
  })

  return {
    viewMode,
    communityPreviews,
    previewsLoading,
    finds,
    selectedFind,
    userLocation,
    mapReady,
    locating,
    locationError,
    clearLocationError,
    incomingSearchQuery,
    onMapReady,
    selectFind,
    clearSelection,
    goToFindDetail,
    goToCommunityFeed,
    setViewMode,
    getPreview,
    flyToUser,
    flyTo,
  }
}
