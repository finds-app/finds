import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1',
  },
  {
    path: '/welcome',
    component: () => import('@/views/WelcomePage.vue'),
    meta: { public: true },
  },
  {
    path: '/auth',
    component: () => import('@/views/AuthPage.vue'),
    meta: { public: true },
  },
  {
    path: '/onboarding',
    component: () => import('@/views/OnboardingPage.vue'),
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1',
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue'),
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue'),
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue'),
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

  // Wait for the initial session check before deciding
  if (auth.loading) {
    await auth.init()
  }

  const isPublic = to.meta.public === true

  if (!auth.isLoggedIn && !isPublic) {
    return '/welcome'
  }

  if (auth.isLoggedIn && !auth.hasProfile && to.path !== '/onboarding') {
    return '/onboarding'
  }

  if (auth.isLoggedIn && auth.hasProfile && isPublic) {
    return '/tabs/tab1'
  }
})

export default router
