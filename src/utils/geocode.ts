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
    return feature ? feature.place_name : ''
  } catch {
    return ''
  }
}

/** Returns just the first segment of a comma-separated location string for display. */
export const shortLocationName = (fullName: string | null): string => {
  if (!fullName) return ''
  return fullName.split(',')[0].trim()
}
