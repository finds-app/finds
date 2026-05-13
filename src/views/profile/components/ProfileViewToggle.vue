<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { mapOutline, personOutline, bookmarkOutline } from 'ionicons/icons'

defineProps<{
  viewMode: 'grid' | 'map' | 'saved'
  isOwnProfile: boolean
}>()

const emit = defineEmits<{
  change: [mode: 'grid' | 'map' | 'saved']
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
    <button
      v-if="isOwnProfile"
      type="button"
      class="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-xs font-body font-medium border-0 transition-colors"
      :class="viewMode === 'saved'
        ? 'bg-white/[0.12] text-gold'
        : 'bg-transparent text-white/35 active:text-white/50'"
      @click="emit('change', 'saved')"
    >
      <ion-icon :icon="bookmarkOutline" class="text-base" />
      <span>Saved</span>
    </button>
  </div>
</template>
