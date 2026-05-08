<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { App as CapApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { ROUTES } from '@/constants'
import { useAuthStore } from '@/stores/auth'
import * as authService from '@/services/auth.service'

const router = useRouter()
const auth = useAuthStore()
auth.init()

if (Capacitor.isNativePlatform()) {
  CapApp.addListener('appUrlOpen', async ({ url }) => {
    if (!url.includes('access_token')) return

    const fragment = url.split('#')[1]
    const params = new URLSearchParams(fragment)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (accessToken && refreshToken) {
      await authService.setAuthSession(accessToken, refreshToken)
      router.push(ROUTES.root)
    }
  })
}
</script>

<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>
