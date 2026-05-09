<script setup lang="ts">
import type { Community } from '@/types'

const props = defineProps<{
  community: Community
  findCount: number
  previewImages: string[]
}>()

defineEmits<{
  tap: []
}>()

const slots = [0, 1, 2, 3] as const

const imageAt = (index: number): string | null =>
  props.previewImages[index] ?? null
</script>

<template>
  <button
    type="button"
    class="relative w-full rounded-3xl overflow-hidden border border-white/[0.08] bg-white/[0.03] text-left min-h-[280px] active:scale-[0.98] transition-transform duration-150 shadow-lg shadow-black/30"
    :style="{ boxShadow: `0 16px 48px rgba(0,0,0,0.35), inset 0 -3px 0 0 ${community.color}44` }"
    @click="$emit('tap')"
  >
    <!-- Mosaic -->
    <div class="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-px bg-black/40">
      <div
        v-for="i in slots"
        :key="i"
        class="relative overflow-hidden bg-forest/90"
      >
        <img
          v-if="imageAt(i)"
          :src="imageAt(i)!"
          alt=""
          class="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div
          v-else
          class="absolute inset-0 opacity-40"
          :style="{
            background: `linear-gradient(145deg, ${community.color}33 0%, transparent 55%)`,
          }"
        />
      </div>
    </div>

    <!-- Readability -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-[#0E1F1A]/95 via-[#0E1F1A]/55 to-transparent pointer-events-none"
    />

    <!-- Content -->
    <div class="relative z-10 flex flex-col justify-end min-h-[280px] p-5 pt-16">
      <div class="flex items-center gap-2 mb-2">
        <span
          class="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
          :style="{ backgroundColor: community.color }"
        />
        <span
          class="font-display font-bold text-cream text-xl leading-tight tracking-tight"
        >
          {{ community.label }}
        </span>
      </div>

      <p class="text-white/60 text-sm font-body leading-relaxed line-clamp-3 mb-4 m-0">
        {{ community.description }}
      </p>

      <div class="flex items-center gap-2">
        <span
          class="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-body font-medium text-white/90 bg-black/35 border border-white/[0.08]"
        >
          {{ findCount }} {{ findCount === 1 ? 'find' : 'finds' }}
        </span>
      </div>
    </div>
  </button>
</template>
