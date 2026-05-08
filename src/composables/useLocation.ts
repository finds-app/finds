import { ref, onMounted } from 'vue'
import { Geolocation } from '@capacitor/geolocation'

export const useLocation = () => {
  const locationName = ref('')
  const lat = ref<number | null>(null)
  const lng = ref<number | null>(null)
  const locationLoading = ref(false)

  const reverseGeocode = async (latitude: number, longitude: number) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      { headers: { 'Accept-Language': 'en', 'User-Agent': 'finds-app/1.0' } }
    )
    const data = await res.json()
    const a = data.address
    locationName.value = a?.city || a?.town || a?.village || a?.county || data.display_name?.split(',')[0] || ''
  }

  const detectLocation = async () => {
    locationLoading.value = true
    try {
      const pos = await Geolocation.getCurrentPosition({ timeout: 10000, enableHighAccuracy: false })
      lat.value = pos.coords.latitude
      lng.value = pos.coords.longitude
      await reverseGeocode(lat.value, lng.value)
    } catch {
      locationName.value = ''
    } finally {
      locationLoading.value = false
    }
  }

  onMounted(() => detectLocation())

  return { locationName, lat, lng, locationLoading }
}
