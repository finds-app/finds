<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col items-center gap-4 px-6 pt-8 pb-4 animate-pulse">
    <div class="w-20 h-20 rounded-full bg-white/[0.05]" />
    <div class="flex flex-col items-center gap-2">
      <div class="w-32 h-5 rounded-md bg-white/[0.05]" />
      <div class="w-24 h-4 rounded-md bg-white/[0.05]" />
    </div>
    <div class="w-48 h-4 rounded-md bg-white/[0.05] mt-1" />

    <div class="flex items-center justify-center gap-6 py-4 w-full">
      <div class="flex flex-col items-center gap-1.5" v-for="i in 3" :key="i">
        <div class="w-10 h-5 rounded-md bg-white/[0.05]" />
        <div class="w-14 h-3 rounded-md bg-white/[0.05]" />
      </div>
    </div>

    <div class="grid grid-cols-3 gap-0.5 w-full mt-2">
      <div v-for="i in 6" :key="i" class="aspect-square bg-white/[0.05]" />
    </div>
  </div>
</template>
