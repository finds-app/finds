<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <p v-if="message" class="text-ember text-sm px-5 pb-4">{{ message }}</p>
</template>
