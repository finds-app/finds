import { ref, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Geolocation } from '@capacitor/geolocation'
import { Capacitor } from '@capacitor/core'
import type { Map as MapboxMap } from 'mapbox-gl'
import type { MapFindDto } from '@/types'
import { getFindsForMap } from '@/services/finds.service'

let mapInstance: MapboxMap | null = null

export const setMapInstance = (map: MapboxMap | null) => {
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

  let pendingFly: { lng: number; lat: number; zoom: number } | null = null

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

  const onMapReady = () => {
    mapReady.value = true
    loadFinds()

    if (pendingFly && mapInstance) {
      const { lng, lat, zoom } = pendingFly
      pendingFly = null
      mapInstance.flyTo({ center: [lng, lat], zoom, duration: 1200 })
    } else {
      applyRouteQuery()
    }
  }

  watch(
    () => route.query,
    () => {
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

  /** Fly to coordinates on the map (e.g. unified search place pick). */
  const flyToCoords = (lng: number, lat: number, zoom = 13) => {
    if (mapInstance && mapReady.value) {
      mapInstance.flyTo({ center: [lng, lat], zoom, duration: 1200 })
      return
    }
    pendingFly = { lng, lat, zoom }
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
    flyToCoords,
  }
}
