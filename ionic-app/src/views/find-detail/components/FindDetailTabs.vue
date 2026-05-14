<script setup lang="ts">
type DetailTab = 'comments' | 'linked'

defineProps<{
  activeTab: DetailTab
  commentCount: number
  chainCount: number
}>()

defineEmits<{
  change: [tab: DetailTab]
}>()
</script>

<template>
  <div class="sticky top-0 z-10 bg-app/95 backdrop-blur supports-[backdrop-filter]:bg-app/80 px-5 pt-3 pb-2">
    <div class="flex items-center gap-1 bg-white/[0.04] rounded-full p-1">
      <button
        type="button"
        class="flex-1 flex items-center justify-center gap-1.5 rounded-full py-2 px-3 border-0 m-0 text-sm font-body font-medium transition-colors"
        :class="activeTab === 'comments'
          ? 'bg-sage/15 text-cream'
          : 'bg-transparent text-white/45 active:text-white/70'"
        @click="$emit('change', 'comments')"
      >
        <span>Comments</span>
        <span
          v-if="commentCount > 0"
          class="text-[11px] tabular-nums"
          :class="activeTab === 'comments' ? 'text-sage' : 'text-white/30'"
        >
          {{ commentCount }}
        </span>
      </button>
      <button
        type="button"
        class="flex-1 flex items-center justify-center gap-1.5 rounded-full py-2 px-3 border-0 m-0 text-sm font-body font-medium transition-colors"
        :class="activeTab === 'linked'
          ? 'bg-sage/15 text-cream'
          : 'bg-transparent text-white/45 active:text-white/70'"
        @click="$emit('change', 'linked')"
      >
        <span>Linked</span>
        <span
          v-if="chainCount > 0"
          class="text-[11px] tabular-nums"
          :class="activeTab === 'linked' ? 'text-sage' : 'text-white/30'"
        >
          {{ chainCount }}
        </span>
      </button>
    </div>
  </div>
</template>
