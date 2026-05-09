import { ref, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Geolocation } from '@capacitor/geolocation'
import { Capacitor } from '@capacitor/core'
import type { Map as MapboxMap } from 'mapbox-gl'
import type { MapFindDto } from '@/types'
import { getFindsForMap } from '@/services/finds.service'

let mapInstance: MapboxMap | null = null

export const setMapInstance = (map: MapboxMap) => {
  mapInstance = map
}

export const useDiscover = () => {
  const route = useRoute()
  const router = useRouter()

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
    } catch (e) {
      console.error('Failed to load map finds', e)
    } finally {
      loading.value = false
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
    // Reset to null first so the search bar watch always sees a fresh value,
    // even when the same location is tapped again after manually clearing the input
    incomingSearchQuery.value = null
    if (location) {
      nextTick(() => { incomingSearchQuery.value = String(location) })
    }
  }

  const onMapReady = () => {
    mapReady.value = true
    loadFinds()
    applyRouteQuery()
  }

  // React to route query changes when map is already loaded (subsequent tab visits)
  watch(
    () => route.query,
    () => { if (mapReady.value) applyRouteQuery() },
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

  const flyToUser = async () => {
    if (locating.value) return
    locating.value = true
    locationError.value = false

    try {
      // requestPermissions() is native-only — web uses browser prompt via getCurrentPosition
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

  return {
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
    flyToUser,
    flyTo,
  }
}
