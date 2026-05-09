export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  const token = import.meta.env.VITE_MAPBOX_TOKEN
  if (!token || !isFinite(lat) || !isFinite(lng)) return ''
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}&limit=1`,
    )
    if (!res.ok) return ''
    const data = await res.json()
    const feature = data.features?.[0]
    return feature ? feature.place_name.split(',')[0] : ''
  } catch {
    return ''
  }
}
