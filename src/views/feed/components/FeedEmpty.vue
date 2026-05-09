<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { cameraOutline } from 'ionicons/icons'

withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: 'Nothing here yet',
    description: 'Be the first to share something worth a second look.',
  },
)
</script>

<template>
  <div class="flex flex-col items-center justify-center py-24 px-8 text-center">
    <div class="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mb-5">
      <ion-icon :icon="cameraOutline" class="text-3xl text-sage/60" />
    </div>
    <h2 class="font-display font-bold text-cream text-xl mb-2">{{ title }}</h2>
    <p class="font-body text-white/40 text-sm leading-relaxed max-w-[260px] m-0">
      {{ description }}
    </p>
  </div>
</template>
