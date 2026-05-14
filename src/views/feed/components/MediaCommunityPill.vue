<script setup lang="ts">
import type { CommunityId } from '@/types'

defineProps<{
  community: CommunityId
  label: string
  color: string
}>()

defineEmits<{
  tap: []
}>()
</script>

<template>
  <button
    type="button"
    class="pointer-events-auto rounded-full px-2.5 py-1 border-0 m-0 text-[10px] font-medium font-body shadow-sm backdrop-blur-sm active:opacity-70 transition-opacity"
    :style="{
      backgroundColor: color + '33',
      color,
      border: `1px solid ${color}66`,
    }"
    :aria-label="`View ${label} community`"
    @click="$emit('tap')"
  >
    {{ label }}
  </button>
</template>
