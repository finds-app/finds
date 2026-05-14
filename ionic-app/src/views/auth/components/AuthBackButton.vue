<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { arrowBack } from 'ionicons/icons'

defineEmits<{
  back: []
}>()
</script>

<template>
  <button
    class="absolute top-12 left-6 w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.07] text-cream border-0"
    @click="$emit('back')"
  >
    <ion-icon :icon="arrowBack" class="text-lg" />
  </button>
</template>
