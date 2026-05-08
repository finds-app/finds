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
  <div class="pt-4">
    <p class="text-white/35 text-xs font-medium uppercase tracking-widest mb-3">Community</p>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="community in COMMUNITIES"
        :key="community.id"
        class="px-3 py-1.5 rounded-full text-xs font-body border transition-all"
        :class="selectedCommunity === community.id
          ? 'border-transparent text-app font-medium'
          : 'border-white/15 text-white/45 bg-transparent'"
        :style="selectedCommunity === community.id
          ? { background: community.color, borderColor: community.color }
          : {}"
        @click="$emit('select', community.id)"
      >
        {{ community.label }}
      </button>
    </div>
  </div>
</template>
