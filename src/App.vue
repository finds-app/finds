<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
auth.init()
</script>
