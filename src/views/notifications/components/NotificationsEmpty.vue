<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { notificationsOutline } from 'ionicons/icons'
</script>

<template>
  <div class="flex flex-col items-center gap-3 py-16 px-8">
    <div class="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center">
      <ion-icon :icon="notificationsOutline" class="text-white/20 text-3xl" />
    </div>
    <h3 class="text-cream text-base font-bold font-display m-0">No notifications yet</h3>
    <p class="text-white/30 text-sm font-body text-center m-0">
      Hearts, follows, and chains will appear here.
    </p>
  </div>
</template>
