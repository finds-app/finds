<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { chevronBackOutline } from 'ionicons/icons'

defineEmits<{
  back: []
}>()
</script>

<template>
  <div class="relative flex min-h-[56px] items-center justify-center px-2 pt-2 pb-2">
    <button
      type="button"
      class="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border-0 bg-transparent text-cream active:bg-white/[0.06]"
      aria-label="Go back"
      @click="$emit('back')"
    >
      <ion-icon :icon="chevronBackOutline" class="text-[26px]" />
    </button>
    <h1 class="text-cream text-base font-bold font-display m-0">Notifications</h1>
  </div>
</template>
