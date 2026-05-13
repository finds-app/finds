<script setup lang="ts">
import type { ChainedFindDto } from '@/types'
import { getCommunityColor } from '@/constants'
import { shortLocationName } from '@/utils/geocode'

const props = defineProps<{
  chainedFinds: ChainedFindDto[]
}>()

defineEmits<{
  'tap-find': [findId: string]
}>()

const ringStyle = (community: ChainedFindDto['community']) => ({
  borderColor: getCommunityColor(community),
})
</script>

<template>
  <div v-if="props.chainedFinds.length > 0" class="mt-2">
    <p class="text-white/40 text-xs font-body font-medium tracking-wide uppercase m-0 mb-2">
      Linked finds
      <span class="text-white/25 normal-case font-normal">({{ props.chainedFinds.length }})</span>
    </p>

    <div class="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
      <button
        v-for="c in props.chainedFinds"
        :key="c.id"
        type="button"
        class="shrink-0 flex flex-col items-center gap-1.5 w-[88px] bg-transparent border-0 p-0 m-0 active:opacity-75"
        @click="$emit('tap-find', c.id)"
      >
        <div
          class="w-[76px] h-[76px] rounded-2xl overflow-hidden p-[2px] border-2 border-solid bg-white/[0.04]"
          :style="ringStyle(c.community)"
        >
          <img :src="c.imageUrl" alt="" class="w-full h-full object-cover rounded-[12px] block" loading="lazy" />
        </div>
        <span class="text-white/45 text-[10px] font-body truncate w-full text-center">@{{ c.user.username }}</span>
        <span
          v-if="c.locationName"
          class="text-white/25 text-[9px] font-body truncate w-full text-center leading-tight"
        >
          {{ shortLocationName(c.locationName) }}
        </span>
      </button>
    </div>
  </div>
</template>
