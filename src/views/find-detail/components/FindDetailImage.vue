<script setup lang="ts">
defineProps<{
  imageUrl: string
  caption: string | null
}>()
</script>

<template>
  <div class="relative w-full">
    <img
      :src="imageUrl"
      :alt="caption ?? 'A find'"
      class="w-full max-h-[70vh] object-cover block"
    />
    <div class="absolute inset-x-0 bottom-[-1px] h-24 bg-gradient-to-t from-app to-transparent pointer-events-none" />
  </div>
</template>
