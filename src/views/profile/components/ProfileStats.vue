<script setup lang="ts">
import type { ProfileStatsDto } from '@/types'

defineProps<{
  stats: ProfileStatsDto
}>()
</script>

<template>
  <div class="flex items-center justify-center gap-0 py-4 mx-6">
    <div class="flex-1 flex flex-col items-center gap-0.5">
      <span class="text-cream text-lg font-bold font-display">{{ stats.findsCount }}</span>
      <span class="text-white/40 text-xs font-body">Finds</span>
    </div>
    <div class="w-px h-8 bg-white/10" />
    <div class="flex-1 flex flex-col items-center gap-0.5">
      <span class="text-cream text-lg font-bold font-display">{{ stats.followersCount }}</span>
      <span class="text-white/40 text-xs font-body">Followers</span>
    </div>
    <div class="w-px h-8 bg-white/10" />
    <div class="flex-1 flex flex-col items-center gap-0.5">
      <span class="text-cream text-lg font-bold font-display">{{ stats.followingCount }}</span>
      <span class="text-white/40 text-xs font-body">Following</span>
    </div>
  </div>
</template>
