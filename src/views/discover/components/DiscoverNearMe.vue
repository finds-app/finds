<script setup lang="ts">
import { IonToast } from '@ionic/vue'

defineProps<{
  loading: boolean
  error: boolean
}>()

const emit = defineEmits<{
  tap: []
  'dismiss-error': []
}>()
</script>

<template>
  <div>
    <button
      class="flex items-center justify-center w-12 h-12 rounded-2xl bg-forest border border-sage/20 shadow-lg active:scale-95 transition-transform"
      :class="{ 'opacity-70': loading }"
      @click="emit('tap')"
    >
      <svg v-if="loading" class="w-5 h-5 text-sage animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <svg v-else class="w-5 h-5 text-sage" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
      </svg>
    </button>

    <ion-toast
      :is-open="error"
      message="Couldn't get your location"
      :duration="2500"
      position="top"
      color="dark"
      @did-dismiss="emit('dismiss-error')"
    />
  </div>
</template>
