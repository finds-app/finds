<script setup lang="ts">
import { computed } from 'vue'
import type { AchievementTemplate } from '@/constants/achievements'
import type { AchievementCategory } from '@/constants/achievements'
import type { AchievementProgressDto } from '@/types'
import { COLLECTIONS } from '@/constants'

const props = defineProps<{
  template: AchievementTemplate
  progress: AchievementProgressDto | undefined
}>()

const accent = computed(() => {
  if (props.template.collectionId) {
    return COLLECTIONS.find((c) => c.id === props.template.collectionId)?.color ?? '#52B788'
  }
  const byCat: Record<AchievementCategory, string> = {
    general: '#52B788',
    engagement: '#F2CC60',
    collection: '#85B7EB',
  }
  return byCat[props.template.category]
})

const pct = computed(() => {
  const p = props.progress
  if (!p || p.goal <= 0) return 0
  if (p.unlocked) return 100
  return Math.min(100, Math.round((p.current / p.goal) * 100))
})

const remaining = computed(() => {
  const p = props.progress
  if (!p || p.unlocked) return null
  const n = Math.max(0, p.goal - p.current)
  if (n === 0) return null
  if (props.template.goal === 1) return null
  return n === 1 ? 'One step left' : `${n} to go`
})

const unlocked = computed(() => props.progress?.unlocked ?? false)

const formattedDate = computed(() => {
  const d = props.progress?.unlockedAt
  if (!d) return null
  try {
    return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return null
  }
})
</script>

<template>
  <article
    class="group relative overflow-hidden rounded-2xl transition-[transform,box-shadow] duration-300 active:scale-[0.99]"
    :class="unlocked
      ? 'border border-gold/25 bg-gradient-to-br from-[#152a24] via-[#0f1f1a] to-[#0c1814] shadow-[0_12px_40px_-8px_rgba(242,204,96,0.12)]'
      : 'border border-white/[0.07] border-l-[3px] bg-[#0a1512]/90'"
    :style="!unlocked ? { borderLeftColor: accent } : undefined"
  >
    <div
      v-if="unlocked"
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(242,204,96,0.14),transparent_55%)]"
      aria-hidden="true"
    />

    <div class="relative flex items-start gap-3.5 p-4 sm:p-[1.125rem]">
      <div
        class="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-xl leading-none transition-colors"
        :class="unlocked
          ? 'border-gold/20 bg-gold/[0.08] shadow-inner shadow-black/20'
          : 'border-white/[0.08] bg-white/[0.04]'"
      >
        {{ template.icon }}
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span class="font-display text-[1.05rem] font-bold leading-snug text-cream sm:text-lg">
            {{ template.label }}
          </span>
          <span
            v-if="unlocked"
            class="rounded-md border border-gold/20 bg-gold/[0.12] px-1.5 py-0.5 font-body text-[9px] font-semibold uppercase tracking-wider text-gold"
          >
            Earned
          </span>
        </div>
        <p class="mt-1.5 font-body text-[13px] font-light leading-relaxed text-white/48 sm:text-sm">
          {{ template.description }}
        </p>

        <div v-if="unlocked && formattedDate" class="mt-3 font-body text-[11px] text-white/32">
          {{ formattedDate }}
        </div>

        <div v-else-if="!unlocked" class="mt-3 space-y-2">
          <div class="flex items-center justify-between gap-2">
            <div
              class="h-2 flex-1 overflow-hidden rounded-full bg-black/40 ring-1 ring-inset ring-white/[0.06]"
            >
              <div
                class="h-full rounded-full transition-all duration-500 ease-out"
                :style="{
                  width: `${pct}%`,
                  backgroundColor: accent,
                  boxShadow: `0 0 12px ${accent}55`,
                }"
              />
            </div>
            <span class="shrink-0 font-body text-[10px] font-medium tabular-nums text-white/40">
              {{ progress?.current ?? 0 }}/{{ template.goal }}
            </span>
          </div>
          <p v-if="remaining" class="font-body text-[11px] italic text-white/28">
            {{ remaining }}
          </p>
        </div>
      </div>
    </div>
  </article>
</template>
