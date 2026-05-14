<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <p v-if="message" class="text-ember text-sm mt-2">{{ message }}</p>
</template>
