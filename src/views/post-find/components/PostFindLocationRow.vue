<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { locationOutline } from 'ionicons/icons'

defineProps<{
  locationName: string
  locationLoading: boolean
}>()
</script>

<template>
  <div class="flex items-center gap-2 py-3 border-b border-white/[0.08]">
    <ion-icon :icon="locationOutline" class="text-sage text-lg shrink-0" />
    <span v-if="locationLoading" class="text-white/35 text-sm font-body">Detecting location...</span>
    <span v-else-if="locationName" class="text-white/60 text-sm font-body">{{ locationName }}</span>
    <span v-else class="text-white/25 text-sm font-body">Location unavailable</span>
  </div>
</template>
