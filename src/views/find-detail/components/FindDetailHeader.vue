<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { arrowBackOutline } from 'ionicons/icons'

defineEmits<{
  back: []
}>()
</script>

<template>
  <div class="absolute top-0 left-0 right-0 z-10 flex items-center px-4 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-3">
    <button
      class="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border-0 p-0"
      @click="$emit('back')"
    >
      <ion-icon :icon="arrowBackOutline" class="text-white text-lg" />
    </button>
  </div>
</template>
