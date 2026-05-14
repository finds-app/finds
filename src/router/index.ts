import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { ROUTES } from '@/constants'
import { useAuthStore } from '@/stores/auth'
import TabsPage from '@/views/tabs/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: ROUTES.root,
    redirect: ROUTES.feed,
  },
  {
    path: ROUTES.welcome,
    component: () => import('@/views/welcome/WelcomePage.vue'),
    meta: { public: true },
  },
  {
    path: ROUTES.auth,
    component: () => import('@/views/auth/AuthPage.vue'),
    meta: { public: true },
  },
  {
    path: ROUTES.onboarding,
    component: () => import('@/views/onboarding/OnboardingPage.vue'),
  },
  {
    path: ROUTES.postFind,
    component: () => import('@/views/post-find/PostFindPage.vue'),
  },
  {
    path: ROUTES.userProfile,
    component: () => import('@/views/profile/ProfilePage.vue'),
  },
  {
    path: ROUTES.findDetail,
    component: () => import('@/views/find-detail/FindDetailPage.vue'),
  },
  {
    path: ROUTES.collectionFeed,
    component: () => import('@/views/collection-feed/CollectionFeedPage.vue'),
  },
  {
    path: ROUTES.tagFeed,
    component: () => import('@/views/tag-feed/TagFeedPage.vue'),
  },
  {
    path: ROUTES.notifications,
    component: () => import('@/views/notifications/NotificationsPage.vue'),
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: ROUTES.feed,
      },
      {
        path: 'tab1',
        component: () => import('@/views/feed/FeedPage.vue'),
      },
      {
        path: 'tab2',
        component: () => import('@/views/discover/DiscoverPage.vue'),
      },
      {
        path: 'tab3',
        component: () => import('@/views/profile/ProfilePage.vue'),
      },
      {
        path: 'tab4',
        component: () => import('@/views/trophies/TrophiesPage.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (auth.loading) await auth.init()
  await auth.waitForReady()

  const isPublic = to.meta.public === true

  if (!auth.isLoggedIn && !isPublic) return ROUTES.welcome
  if (auth.isLoggedIn && !auth.hasProfile && to.path !== ROUTES.onboarding) return ROUTES.onboarding
  if (auth.isLoggedIn && auth.hasProfile && isPublic) return ROUTES.feed
})

export default router
