<script setup lang="ts">
import { watch } from 'vue'
import { useAchievementCelebration } from '@/composables/useAchievementCelebration'

const { current } = useAchievementCelebration()

watch(
  current,
  (t) => {
    if (t) document.body.classList.add('achievement-celebration-open')
    else document.body.classList.remove('achievement-celebration-open')
  },
  { immediate: true },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="achievement-pop">
      <div
        v-if="current"
        class="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/75 px-6 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-label="`Trophy unlocked: ${current.label}`"
      >
        <div
          class="max-w-sm rounded-3xl border border-white/10 bg-[#0E1F1A] px-8 py-10 text-center shadow-2xl shadow-sage/20"
        >
          <p class="mb-2 font-body text-xs uppercase tracking-[0.2em] text-sage">Trophy unlocked</p>
          <p class="mb-4 font-display text-5xl leading-none">{{ current.icon }}</p>
          <h2 class="mb-2 font-display text-2xl font-bold text-cream">{{ current.label }}</h2>
          <p class="font-body text-sm leading-relaxed text-white/55">{{ current.description }}</p>
        </div>
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
          <span
            v-for="n in 18"
            :key="n"
            class="achievement-confetti absolute h-2 w-2 rounded-full opacity-80"
            :style="{
              left: `${(n * 53) % 100}%`,
              top: `${(n * 17) % 40}%`,
              backgroundColor: n % 2 === 0 ? '#52B788' : '#F2CC60',
              animationDelay: `${n * 0.05}s`,
            }"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.achievement-pop-enter-active,
.achievement-pop-leave-active {
  transition: opacity 0.35s ease;
}
.achievement-pop-enter-active .max-w-sm,
.achievement-pop-leave-active .max-w-sm {
  transition: transform 0.35s ease, opacity 0.35s ease;
}
.achievement-pop-enter-from,
.achievement-pop-leave-to {
  opacity: 0;
}
.achievement-pop-enter-from .max-w-sm,
.achievement-pop-leave-to .max-w-sm {
  opacity: 0;
  transform: scale(0.92) translateY(12px);
}
.achievement-confetti {
  animation: confetti-fall 2.8s ease-in forwards;
}
@keyframes confetti-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(520deg);
    opacity: 0;
  }
}
</style>
