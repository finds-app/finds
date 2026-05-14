<script setup lang="ts">
import { ref, watch } from 'vue'
import { Haptics, ImpactStyle } from '@capacitor/haptics'

const props = defineProps<{
  saved: boolean
}>()

defineEmits<{
  toggle: []
}>()

const animating = ref(false)

watch(
  () => props.saved,
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
    class="bg-transparent border-0 p-0 m-0 active:scale-95 transition-transform"
    @click="$emit('toggle')"
  >
    <svg
      viewBox="0 0 24 24"
      class="w-[22px] h-[22px] transition-colors duration-200"
      :class="[
        saved ? 'text-gold' : 'text-white/30',
        animating ? 'animate-save-pop' : ''
      ]"
    >
      <path
        v-if="saved"
        fill="currentColor"
        d="M5 2h14a1 1 0 0 1 1 1v19.143a.5.5 0 0 1-.766.424L12 18.03l-7.234 4.536A.5.5 0 0 1 4 22.143V3a1 1 0 0 1 1-1z"
      />
      <path
        v-else
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        d="M5 2h14a1 1 0 0 1 1 1v19.143a.5.5 0 0 1-.766.424L12 18.03l-7.234 4.536A.5.5 0 0 1 4 22.143V3a1 1 0 0 1 1-1z"
      />
    </svg>
  </button>
</template>

<style scoped>
@keyframes save-pop {
  0% { transform: scale(1); }
  30% { transform: scale(1.25); }
  60% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
.animate-save-pop {
  animation: save-pop 350ms ease-out;
}
</style>
