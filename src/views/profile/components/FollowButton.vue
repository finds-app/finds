<script setup lang="ts">
import { IonSpinner } from '@ionic/vue'

defineProps<{
  following: boolean
  loading: boolean
}>()

defineEmits<{
  toggle: []
}>()
</script>

<template>
  <div class="flex justify-center px-6 pb-2">
    <button
      type="button"
      class="min-w-[140px] px-6 py-2.5 rounded-xl text-sm font-body font-semibold border transition-opacity active:opacity-90 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
      :class="following
        ? 'bg-transparent border-sage/40 text-sage'
        : 'bg-sage border-transparent text-forest'"
      :disabled="loading"
      @click="$emit('toggle')"
    >
      <ion-spinner v-if="loading" name="crescent" class="w-4 h-4 text-current" />
      <span v-else>{{ following ? 'Following' : 'Follow' }}</span>
    </button>
  </div>
</template>
