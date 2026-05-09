<script setup lang="ts">
defineProps<{
  viewMode: 'grid' | 'map'
}>()

const emit = defineEmits<{
  change: [mode: 'grid' | 'map']
}>()
</script>

<template>
  <div class="flex items-center rounded-xl overflow-hidden border border-white/10 bg-white/[0.05]">
    <button
      class="flex items-center justify-center w-9 h-9 transition-colors border-0 m-0"
      :class="viewMode === 'grid' ? 'bg-white/15 text-cream' : 'bg-transparent text-white/30'"
      @click="emit('change', 'grid')"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    </button>
    <button
      class="flex items-center justify-center w-9 h-9 transition-colors border-0 m-0"
      :class="viewMode === 'map' ? 'bg-white/15 text-cream' : 'bg-transparent text-white/30'"
      @click="emit('change', 'map')"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" y1="3" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="21" />
      </svg>
    </button>
  </div>
</template>
