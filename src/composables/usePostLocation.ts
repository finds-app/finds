import { ref } from 'vue'
import { Geolocation } from '@capacitor/geolocation'
import { reverseGeocode } from '@/utils/geocode'

export const usePostLocation = () => {
  const locationName = ref('')
  const lat = ref<number | null>(null)
  const lng = ref<number | null>(null)
  const gpsLoading = ref(false)

  const setFromCoords = async (coordLat: number, coordLng: number) => {
    lat.value = coordLat
    lng.value = coordLng
    gpsLoading.value = true
    locationName.value = await reverseGeocode(coordLat, coordLng)
    gpsLoading.value = false
  }

  const detectDeviceLocation = async () => {
    gpsLoading.value = true
    try {
      const pos = await Geolocation.getCurrentPosition({ timeout: 10000, enableHighAccuracy: false })
      lat.value = pos.coords.latitude
      lng.value = pos.coords.longitude
      locationName.value = await reverseGeocode(lat.value, lng.value)
    } catch {
      // Permission denied or unavailable — leave empty for manual entry
    } finally {
      gpsLoading.value = false
    }
  }

  const setManualLocation = (name: string, manualLat: number, manualLng: number) => {
    locationName.value = name
    lat.value = manualLat
    lng.value = manualLng
  }

  const clearLocation = () => {
    locationName.value = ''
    lat.value = null
    lng.value = null
  }

  return { locationName, lat, lng, gpsLoading, setFromCoords, detectDeviceLocation, setManualLocation, clearLocation }
}
