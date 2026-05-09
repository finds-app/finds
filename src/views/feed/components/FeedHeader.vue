<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { planetOutline, peopleOutline } from 'ionicons/icons'

defineProps<{
  feedMode: 'forYou' | 'following'
}>()

defineEmits<{
  'update:feedMode': [mode: 'forYou' | 'following']
}>()
</script>

<template>
  <!-- Same chrome layout as DiscoverHeader / Profile toggle row -->
  <div class="px-2 pb-2 pt-[env(safe-area-inset-top,0px)]">
    <div class="flex items-center justify-between gap-3 min-h-[48px] pt-2">
      <h1 class="font-display font-bold italic text-sage text-xl shrink-0 pl-1 m-0">
        finds
      </h1>

      <div
        class="flex rounded-xl bg-white/[0.06] p-0.5 border border-white/[0.08]"
        role="group"
        aria-label="Feed source"
      >
        <button
          type="button"
          class="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-xs font-body font-medium border-0 transition-colors"
          :class="feedMode === 'forYou'
            ? 'bg-white/[0.12] text-cream'
            : 'bg-transparent text-white/35 active:text-white/50'"
          @click="$emit('update:feedMode', 'forYou')"
        >
          <ion-icon :icon="planetOutline" class="text-base" />
          <span>For you</span>
        </button>
        <button
          type="button"
          class="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-xs font-body font-medium border-0 transition-colors"
          :class="feedMode === 'following'
            ? 'bg-white/[0.12] text-sage'
            : 'bg-transparent text-white/35 active:text-white/50'"
          @click="$emit('update:feedMode', 'following')"
        >
          <ion-icon :icon="peopleOutline" class="text-base" />
          <span>Following</span>
        </button>
      </div>
    </div>
  </div>
</template>
