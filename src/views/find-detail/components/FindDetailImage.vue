<script setup lang="ts">
import { computed } from 'vue'
import { BADGE_DISPLAY_ORDER, getBadgeDefinition } from '@/constants'

const props = defineProps<{
  imageUrl: string
  caption: string | null
  badges: string[]
}>()

const sortedBadges = computed(() => BADGE_DISPLAY_ORDER.filter((id) => props.badges.includes(id)))
</script>

<template>
  <div class="relative w-full">
    <img
      :src="imageUrl"
      :alt="caption ?? 'A find'"
      class="w-full max-h-[70vh] object-cover block"
    />
    <div
      v-if="sortedBadges.length"
      class="pointer-events-none absolute left-3 right-3 top-[calc(env(safe-area-inset-top,0px)+12px)] flex flex-wrap justify-end gap-1"
    >
      <span
        v-for="badgeId in sortedBadges"
        :key="badgeId"
        class="rounded-full px-2.5 py-1 text-[11px] font-medium font-body shadow-md backdrop-blur-sm"
        :style="{
          backgroundColor: (getBadgeDefinition(badgeId)?.color ?? '#52B788') + '33',
          color: getBadgeDefinition(badgeId)?.color ?? '#52B788',
          border: `1px solid ${(getBadgeDefinition(badgeId)?.color ?? '#52B788')}66`,
        }"
      >
        {{ getBadgeDefinition(badgeId)?.label }}
      </span>
    </div>
    <div class="absolute inset-x-0 bottom-[-1px] h-24 bg-gradient-to-t from-app to-transparent pointer-events-none" />
  </div>
</template>
