<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { cameraOutline } from 'ionicons/icons'

defineProps<{
  isOwnProfile: boolean
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-3 py-16 px-8">
    <div class="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center">
      <ion-icon :icon="cameraOutline" class="text-white/20 text-3xl" />
    </div>
    <h3 class="text-cream text-base font-bold font-display m-0">No finds yet</h3>
    <p class="text-white/30 text-sm font-body text-center m-0">
      {{ isOwnProfile ? 'Your discoveries will appear here.' : "This explorer hasn't posted yet." }}
    </p>
  </div>
</template>
