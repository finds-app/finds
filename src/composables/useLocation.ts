import { ref, onMounted } from 'vue'
import { Geolocation } from '@capacitor/geolocation'
import { reverseGeocode } from '@/utils/geocode'

export const useLocation = () => {
  const locationName = ref('')
  const lat = ref<number | null>(null)
  const lng = ref<number | null>(null)
  const locationLoading = ref(false)

  const detectLocation = async () => {
    locationLoading.value = true
    try {
      const pos = await Geolocation.getCurrentPosition({ timeout: 10000, enableHighAccuracy: false })
      lat.value = pos.coords.latitude
      lng.value = pos.coords.longitude
      locationName.value = await reverseGeocode(lat.value, lng.value)
    } catch {
      locationName.value = ''
    } finally {
      locationLoading.value = false
    }
  }

  onMounted(() => detectLocation())

  return { locationName, lat, lng, locationLoading }
}
