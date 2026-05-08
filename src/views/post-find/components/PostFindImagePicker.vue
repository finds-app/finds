<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { cameraOutline } from 'ionicons/icons'

defineProps<{
  imagePreview: string | null
}>()

defineEmits<{
  pick: []
}>()
</script>

<template>
  <button
    class="w-full bg-white/[0.04] border-b border-white/[0.06] flex items-center justify-center overflow-hidden shrink-0"
    style="min-height: 280px;"
    @click="$emit('pick')"
  >
    <img
      v-if="imagePreview"
      :src="imagePreview"
      class="w-full h-full object-cover"
      style="max-height: 420px;"
    />
    <div v-else class="flex flex-col items-center gap-3 text-white/25">
      <ion-icon :icon="cameraOutline" class="text-5xl" />
      <span class="font-body text-sm">Tap to add a photo</span>
    </div>
  </button>
</template>
