<script setup lang="ts">
import type { FindDto } from '@/types'

defineProps<{
  finds: FindDto[]
}>()

defineEmits<{
  tapFind: [findId: string]
}>()
</script>

<template>
  <div class="grid grid-cols-3 gap-0.5 px-0.5">
    <button
      v-for="find in finds"
      :key="find.id"
      class="aspect-square overflow-hidden bg-white/[0.03] border-0 p-0 m-0"
      @click="$emit('tapFind', find.id)"
    >
      <img
        :src="find.imageUrl"
        :alt="find.caption ?? 'A find'"
        class="w-full h-full object-cover block"
        loading="lazy"
      />
    </button>
  </div>
</template>
