<script setup lang="ts">
defineProps<{
  feedMode: 'forYou' | 'following' | 'collections'
}>()

defineEmits<{
  'update:feedMode': [mode: 'forYou' | 'following' | 'collections']
}>()
</script>

<template>
  <!-- Same chrome layout as DiscoverHeader / Profile toggle row -->
  <div class="px-2 pb-2 pt-[env(safe-area-inset-top,0px)]">
    <div class="relative flex min-h-[48px] items-center justify-center pt-2">
      <h1 class="pointer-events-none absolute left-0 top-1/2 z-10 m-0 -translate-y-1/2 pl-1 font-display text-xl font-bold italic text-sage">
        finds
      </h1>

      <div
        class="relative z-20 flex rounded-xl border border-white/[0.08] bg-white/[0.06] p-0.5"
        role="group"
        aria-label="Feed source"
      >
        <button
          type="button"
          class="px-3 py-2 rounded-[10px] text-xs font-body font-medium border-0 transition-colors"
          :class="feedMode === 'forYou'
            ? 'bg-white/[0.12] text-cream'
            : 'bg-transparent text-white/35 active:text-white/50'"
          @click="$emit('update:feedMode', 'forYou')"
        >
          For you
        </button>
        <button
          type="button"
          class="px-3 py-2 rounded-[10px] text-xs font-body font-medium border-0 transition-colors"
          :class="feedMode === 'following'
            ? 'bg-white/[0.12] text-sage'
            : 'bg-transparent text-white/35 active:text-white/50'"
          @click="$emit('update:feedMode', 'following')"
        >
          Following
        </button>
        <button
          type="button"
          class="px-3 py-2 rounded-[10px] text-xs font-body font-medium border-0 transition-colors"
          :class="feedMode === 'collections'
            ? 'bg-white/[0.12] text-sage'
            : 'bg-transparent text-white/35 active:text-white/50'"
          @click="$emit('update:feedMode', 'collections')"
        >
          Collections
        </button>
      </div>
    </div>
  </div>
</template>
