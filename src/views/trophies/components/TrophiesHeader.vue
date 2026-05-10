<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  earned: number
  total: number
}>()

const ratio = computed(() => (props.total > 0 ? props.earned / props.total : 0))
const pct = computed(() => Math.round(ratio.value * 100))

/** Circle circumference for r=15.5 in 36×36 viewBox */
const C = 97.4
const dashOffset = computed(() => C * (1 - ratio.value))
</script>

<template>
  <header
    class="relative overflow-hidden px-4 pb-8 pt-[calc(env(safe-area-inset-top,0px)+8px)]"
  >
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.35]"
      aria-hidden="true"
    >
      <div
        class="absolute -top-16 left-1/2 h-56 w-[120%] max-w-xl -translate-x-1/2 rounded-[100%] bg-gradient-to-b from-sage/25 via-moss/10 to-transparent blur-2xl"
      />
      <div class="absolute -right-8 top-24 h-32 w-32 rounded-full bg-gold/15 blur-3xl" />
    </div>

    <div class="relative flex flex-col items-center text-center">
      <p class="mb-2 font-body text-[10px] font-medium uppercase tracking-[0.28em] text-sage/90">
        Your shelf
      </p>

      <div class="relative mb-5 flex items-center justify-center">
        <svg
          class="h-[104px] w-[104px] -rotate-90 text-white/[0.07]"
          viewBox="0 0 36 36"
          aria-hidden="true"
        >
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
          />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="url(#trophyRingGold)"
            stroke-width="1.75"
            stroke-linecap="round"
            :stroke-dasharray="String(C)"
            :stroke-dashoffset="dashOffset"
            class="transition-[stroke-dashoffset] duration-700 ease-out"
          />
          <defs>
            <linearGradient id="trophyRingGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#F2CC60" />
              <stop offset="100%" stop-color="#52B788" />
            </linearGradient>
          </defs>
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center pt-0.5">
          <span class="font-display text-3xl font-bold tabular-nums leading-none text-cream">{{ earned }}</span>
          <span class="mt-0.5 font-body text-[11px] font-medium tracking-wide text-white/35">/ {{ total }}</span>
        </div>
      </div>

      <h1 class="font-display text-[1.65rem] font-bold italic leading-tight text-cream sm:text-3xl">
        Trophies
      </h1>
      <p class="mt-2 max-w-[17rem] font-body text-sm font-light leading-relaxed text-white/50">
        Small proofs of attention — rarer than likes, slower than streaks.
      </p>
      <p class="mt-3 font-body text-xs text-white/30">
        {{ pct }}% of the shelf filled
      </p>
    </div>
  </header>
</template>
