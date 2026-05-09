<script setup lang="ts">
import { COMMUNITIES } from '@/constants'
import type { CommunityId } from '@/types'

defineProps<{
  selectedCommunity: CommunityId | null
}>()

defineEmits<{
  select: [id: CommunityId]
}>()
</script>

<template>
  <div class="pt-2">
    <p class="text-white/30 text-[11px] font-body font-medium uppercase tracking-wider mb-2.5">Community</p>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="community in COMMUNITIES"
        :key="community.id"
        class="px-3.5 py-1.5 rounded-full text-xs font-body border transition-all"
        :class="selectedCommunity === community.id
          ? 'border-transparent text-app font-medium shadow-sm'
          : 'border-white/10 text-white/40 bg-transparent active:border-white/20'"
        :style="selectedCommunity === community.id
          ? { background: community.color }
          : {}"
        @click="$emit('select', community.id)"
      >
        {{ community.label }}
      </button>
    </div>
  </div>
</template>
