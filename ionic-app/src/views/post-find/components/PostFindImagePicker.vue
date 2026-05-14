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
  <div class="px-5 pt-4">
    <button
      class="relative w-full rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03] flex items-center justify-center"
      style="aspect-ratio: 4/5; max-height: 400px;"
      @click="$emit('pick')"
    >
      <img
        v-if="imagePreview"
        :src="imagePreview"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div v-else class="flex flex-col items-center gap-3">
        <div class="w-14 h-14 rounded-full bg-white/[0.06] flex items-center justify-center">
          <ion-icon :icon="cameraOutline" class="text-2xl text-white/30" />
        </div>
        <span class="font-body text-xs text-white/25">Tap to add a photo</span>
      </div>
    </button>
  </div>
</template>
