<script setup lang="ts">
import type { MapFindDto } from '@/types'
import { getCommunityColor, getCommunityLabel } from '@/constants'

defineProps<{
  find: MapFindDto
}>()

const emit = defineEmits<{
  'view-find': []
}>()

const formatUsername = (username: string) => `@${username}`
</script>

<template>
  <Transition name="sheet">
    <div v-if="find" class="fixed inset-x-0 bottom-0 z-50 pointer-events-none">
      <!-- Sheet -->
      <div class="bg-[#0E1F1A]/95 backdrop-blur-xl rounded-t-3xl border-t border-white/[0.06] pb-safe-area-bottom pt-4 pointer-events-auto">
        <div class="px-4 pb-4 flex gap-3 items-start">
          <!-- Image -->
          <div class="shrink-0 w-[90px] h-[90px] rounded-2xl overflow-hidden bg-white/5">
            <img :src="find.imageUrl" alt="" class="w-full h-full object-cover" />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0 pt-0.5">
            <div class="flex items-center gap-2 mb-1.5 flex-wrap">
              <span class="text-white/50 text-xs font-body">{{ formatUsername(find.user.username) }}</span>
              <span
                v-if="find.community"
                class="text-[10px] font-body px-2 py-0.5 rounded-full"
                :style="{ background: `${getCommunityColor(find.community)}18`, color: getCommunityColor(find.community) }"
              >
                {{ getCommunityLabel(find.community) }}
              </span>
            </div>
            <p class="text-white/80 text-sm font-body leading-snug line-clamp-2">a find worth seeing</p>
          </div>
        </div>

        <!-- CTA -->
        <div class="px-4 pb-2">
          <button
            class="w-full bg-sage/15 border border-sage/25 text-sage font-body text-sm font-medium rounded-2xl py-3 active:scale-[0.98] transition-transform"
            @click="emit('view-find')"
          >
            View find →
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition: transform 280ms cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
}
</style>
