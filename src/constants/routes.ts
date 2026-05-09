export const ROUTES = {
  root: '/',
  welcome: '/welcome',
  auth: '/auth',
  onboarding: '/onboarding',
  postFind: '/post',
  feed: '/tabs/tab1',
  discover: '/tabs/tab2',
  profile: '/tabs/tab3',
  userProfile: '/user/:userId',
  findDetail: '/find/:findId',
} as const

export const buildMapRoute = (lat: number, lng: number, locationName?: string | null): string => {
  const params = new URLSearchParams({ lat: String(lat), lng: String(lng) })
  if (locationName) params.set('location', locationName)
  return `${ROUTES.discover}?${params}`
}
