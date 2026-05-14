<script setup lang="ts">
import { COLLECTIONS } from '@/constants'
import type { CollectionId } from '@/types'

defineProps<{
  selectedCollection: CollectionId | null
}>()

defineEmits<{
  select: [id: CollectionId]
}>()
</script>

<template>
  <div class="pt-2">
    <p class="text-white/30 text-[11px] font-body font-medium uppercase tracking-wider mb-2.5">Collection</p>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="collection in COLLECTIONS"
        :key="collection.id"
        class="px-3.5 py-1.5 rounded-full text-xs font-body border transition-all"
        :class="selectedCollection === collection.id
          ? 'border-transparent text-app font-medium shadow-sm'
          : 'border-white/10 text-white/40 bg-transparent active:border-white/20'"
        :style="selectedCollection === collection.id
          ? { background: collection.color }
          : {}"
        @click="$emit('select', collection.id)"
      >
        {{ collection.label }}
      </button>
    </div>
  </div>
</template>
