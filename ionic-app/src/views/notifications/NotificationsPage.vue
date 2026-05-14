<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
} from '@ionic/vue'
import { useNotifications } from './useNotifications'
import NotificationsHeader from './components/NotificationsHeader.vue'
import NotificationItem from './components/NotificationItem.vue'
import NotificationsEmpty from './components/NotificationsEmpty.vue'

const {
  notifications,
  loading,
  refresh,
  goToFind,
  goToUser,
  goBack,
} = useNotifications()

const handleRefresh = async (event: CustomEvent) => {
  await refresh()
  ;(event.target as HTMLIonRefresherElement).complete()
}
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true" class="[--background:#0E1F1A]">
      <div class="z-30 shrink-0 bg-[#0E1F1A] border-b border-white/[0.06] sticky top-0 pt-[env(safe-area-inset-top,0px)]">
        <NotificationsHeader @back="goBack" />
      </div>

      <ion-refresher slot="fixed" @ion-refresh="handleRefresh">
        <ion-refresher-content pulling-icon="crescent" refreshing-spinner="crescent" />
      </ion-refresher>

      <div v-if="loading && notifications.length === 0" class="flex items-center justify-center py-24">
        <ion-spinner name="crescent" class="text-sage w-8 h-8" />
      </div>

      <NotificationsEmpty v-else-if="notifications.length === 0" />

      <ul v-else class="list-none m-0 p-0">
        <NotificationItem
          v-for="n in notifications"
          :key="n.id"
          :notification="n"
          @tap-find="goToFind"
          @tap-user="goToUser"
        />
      </ul>
    </ion-content>
  </ion-page>
</template>
