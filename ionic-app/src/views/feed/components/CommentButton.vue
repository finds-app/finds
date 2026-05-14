<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { chatbubbleOutline } from 'ionicons/icons'

defineProps<{
  count: number
}>()

defineEmits<{
  tap: []
}>()
</script>

<template>
  <button
    type="button"
    class="flex items-center gap-1.5 bg-transparent border-0 p-0 m-0 active:scale-95 transition-transform leading-none"
    aria-label="View comments"
    @click="$emit('tap')"
  >
    <ion-icon :icon="chatbubbleOutline" class="w-[22px] h-[22px] text-white/30" />
    <span
      v-if="count > 0"
      class="text-white/50 text-xs font-body tabular-nums"
    >
      {{ count }}
    </span>
  </button>
</template>
