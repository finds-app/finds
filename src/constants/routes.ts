import type { Router } from 'vue-router'

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
  communityFeed: '/community/:communityId',
} as const

/** Opens another user's profile, or the signed-in user's tab profile when `userId` is the viewer. */
export const pushUserProfile = (
  router: Router,
  userId: string,
  viewerUserId: string | undefined | null,
): void => {
  if (viewerUserId && userId === viewerUserId) {
    void router.push(ROUTES.profile)
  } else {
    void router.push(`/user/${userId}`)
  }
}

export const buildMapRoute = (lat: number, lng: number, locationName?: string | null): string => {
  const params = new URLSearchParams({ lat: String(lat), lng: String(lng) })
  if (locationName) params.set('location', locationName)
  return `${ROUTES.discover}?${params}`
}
