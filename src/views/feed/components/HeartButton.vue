<script setup lang="ts">
import { ref, watch } from 'vue'
import { Haptics, ImpactStyle } from '@capacitor/haptics'

const props = defineProps<{
  reacted: boolean
  count: number
}>()

defineEmits<{
  toggle: []
}>()

const animating = ref(false)

watch(
  () => props.reacted,
  (newVal) => {
    if (newVal) {
      animating.value = true
      try { Haptics.impact({ style: ImpactStyle.Light }) } catch {}
      setTimeout(() => { animating.value = false }, 350)
    }
  }
)
</script>

<template>
  <button
    class="flex items-center gap-1.5 bg-transparent border-0 p-0 m-0 active:scale-95 transition-transform"
    @click="$emit('toggle')"
  >
    <svg
      viewBox="0 0 24 24"
      class="w-6 h-6 transition-colors duration-200"
      :class="[
        reacted ? 'text-ember' : 'text-white/30',
        animating ? 'animate-heart-bounce' : ''
      ]"
    >
      <path
        v-if="reacted"
        fill="currentColor"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
      <path
        v-else
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
    <span v-if="count > 0" class="text-white/50 text-xs font-body tabular-nums">
      {{ count }}
    </span>
  </button>
</template>

<style scoped>
@keyframes heart-bounce {
  0% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
.animate-heart-bounce {
  animation: heart-bounce 350ms ease-out;
}
</style>
