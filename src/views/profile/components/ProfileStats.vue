<script setup lang="ts">
import type { ProfileStatsDto } from '@/types'

defineProps<{
  stats: ProfileStatsDto
  isOwnProfile: boolean
}>()

defineEmits<{
  'tap-followers': []
  'tap-following': []
  'tap-trophies': []
}>()
</script>

<template>
  <div class="flex items-center justify-center gap-0 py-4 mx-4 sm:mx-6">
    <div class="flex min-w-0 flex-1 flex-col items-center gap-0.5 px-0.5">
      <span class="text-cream text-base font-bold font-display sm:text-lg">{{ stats.findsCount }}</span>
      <span class="text-white/40 text-[10px] font-body sm:text-xs">Finds</span>
    </div>
    <div class="h-8 w-px shrink-0 bg-white/10" />
    <button
      type="button"
      class="flex min-w-0 flex-1 flex-col items-center gap-0.5 border-0 bg-transparent p-0 px-0.5 m-0 active:opacity-70 transition-opacity"
      @click="$emit('tap-followers')"
    >
      <span class="text-cream text-base font-bold font-display sm:text-lg">{{ stats.followersCount }}</span>
      <span class="text-white/40 text-[10px] font-body sm:text-xs">Followers</span>
    </button>
    <div class="h-8 w-px shrink-0 bg-white/10" />
    <button
      type="button"
      class="flex min-w-0 flex-1 flex-col items-center gap-0.5 border-0 bg-transparent p-0 px-0.5 m-0 active:opacity-70 transition-opacity"
      @click="$emit('tap-following')"
    >
      <span class="text-cream text-base font-bold font-display sm:text-lg">{{ stats.followingCount }}</span>
      <span class="text-white/40 text-[10px] font-body sm:text-xs">Following</span>
    </button>
    <div class="h-8 w-px shrink-0 bg-white/10" />
    <button
      v-if="isOwnProfile"
      type="button"
      class="flex min-w-0 flex-1 flex-col items-center gap-0.5 border-0 bg-transparent p-0 px-0.5 m-0 active:opacity-70 transition-opacity"
      @click="$emit('tap-trophies')"
    >
      <span class="text-cream text-base font-bold font-display sm:text-lg">{{ stats.trophiesCount }}</span>
      <span class="text-white/40 text-[10px] font-body sm:text-xs">Trophies</span>
    </button>
    <div v-else class="flex min-w-0 flex-1 flex-col items-center gap-0.5 px-0.5 opacity-80">
      <span class="text-cream text-base font-bold font-display sm:text-lg">{{ stats.trophiesCount }}</span>
      <span class="text-white/40 text-[10px] font-body sm:text-xs">Trophies</span>
    </div>
  </div>
</template>
