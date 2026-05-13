<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { gridOutline, mapOutline } from 'ionicons/icons'

defineProps<{
  viewMode: 'communities' | 'map'
}>()

defineEmits<{
  'update:viewMode': [mode: 'communities' | 'map']
}>()
</script>

<template>
  <div class="px-2 pb-2">
    <div class="relative flex min-h-[48px] items-center justify-center pt-2">
      <div
        class="relative z-20 flex rounded-xl border border-white/[0.08] bg-white/[0.06] p-0.5"
        role="group"
        aria-label="Explore view"
      >
        <button
          type="button"
          class="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-xs font-body font-medium border-0 transition-colors"
          :class="viewMode === 'communities'
            ? 'bg-white/[0.12] text-cream'
            : 'bg-transparent text-white/35 active:text-white/50'"
          @click="$emit('update:viewMode', 'communities')"
        >
          <ion-icon :icon="gridOutline" class="text-base" />
          <span>Communities</span>
        </button>
        <button
          type="button"
          class="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-xs font-body font-medium border-0 transition-colors"
          :class="viewMode === 'map'
            ? 'bg-white/[0.12] text-sage'
            : 'bg-transparent text-white/35 active:text-white/50'"
          @click="$emit('update:viewMode', 'map')"
        >
          <ion-icon :icon="mapOutline" class="text-base" />
          <span>Map</span>
        </button>
      </div>
    </div>
  </div>
</template>
