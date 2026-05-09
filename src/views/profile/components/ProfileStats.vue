<script setup lang="ts">
import type { ProfileStatsDto } from '@/types'

defineProps<{
  stats: ProfileStatsDto
}>()

defineEmits<{
  'tap-followers': []
  'tap-following': []
}>()
</script>

<template>
  <div class="flex items-center justify-center gap-0 py-4 mx-6">
    <div class="flex-1 flex flex-col items-center gap-0.5">
      <span class="text-cream text-lg font-bold font-display">{{ stats.findsCount }}</span>
      <span class="text-white/40 text-xs font-body">Finds</span>
    </div>
    <div class="w-px h-8 bg-white/10" />
    <button
      type="button"
      class="flex-1 flex flex-col items-center gap-0.5 border-0 bg-transparent p-0 m-0 active:opacity-70 transition-opacity"
      @click="$emit('tap-followers')"
    >
      <span class="text-cream text-lg font-bold font-display">{{ stats.followersCount }}</span>
      <span class="text-white/40 text-xs font-body">Followers</span>
    </button>
    <div class="w-px h-8 bg-white/10" />
    <button
      type="button"
      class="flex-1 flex flex-col items-center gap-0.5 border-0 bg-transparent p-0 m-0 active:opacity-70 transition-opacity"
      @click="$emit('tap-following')"
    >
      <span class="text-cream text-lg font-bold font-display">{{ stats.followingCount }}</span>
      <span class="text-white/40 text-xs font-body">Following</span>
    </button>
  </div>
</template>
