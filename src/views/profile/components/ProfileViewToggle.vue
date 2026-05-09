<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import {  mapOutline, personOutline } from 'ionicons/icons'

defineProps<{
  viewMode: 'grid' | 'map'
}>()

const emit = defineEmits<{
  change: [mode: 'grid' | 'map']
}>()
</script>

<template>
  <div
    class="flex rounded-xl bg-white/[0.06] p-0.5 border border-white/[0.08]"
    role="group"
    aria-label="Profile view"
  >
    <button
      type="button"
      class="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-xs font-body font-medium border-0 transition-colors"
      :class="viewMode === 'grid'
        ? 'bg-white/[0.12] text-cream'
        : 'bg-transparent text-white/35 active:text-white/50'"
      @click="emit('change', 'grid')"
    >
      <ion-icon :icon="personOutline" class="text-base" />
      <span>Overview</span>
    </button>
    <button
      type="button"
      class="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-xs font-body font-medium border-0 transition-colors"
      :class="viewMode === 'map'
        ? 'bg-white/[0.12] text-sage'
        : 'bg-transparent text-white/35 active:text-white/50'"
      @click="emit('change', 'map')"
    >
      <ion-icon :icon="mapOutline" class="text-base" />
      <span>Map</span>
    </button>
  </div>
</template>
