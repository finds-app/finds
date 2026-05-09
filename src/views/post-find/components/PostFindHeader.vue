<script setup lang="ts">
import { IonSpinner } from '@ionic/vue'

defineProps<{
  canPost: boolean
  posting: boolean
}>()

defineEmits<{
  cancel: []
  post: []
}>()
</script>

<template>
  <header class="sticky top-0 z-10 px-5 pt-[env(safe-area-inset-top)] bg-app">
    <div class="flex items-center justify-between h-14">
      <button
        class="text-sm font-body text-white/60 active:text-white/80 border-0 bg-transparent p-0"
        @click="$emit('cancel')"
      >
        Cancel
      </button>

      <h1 class="text-[15px] font-body font-medium text-white/80">New Find</h1>

      <button
        :disabled="!canPost || posting"
        class="text-sm font-body font-semibold border-0 bg-transparent p-0 transition-opacity"
        :class="canPost && !posting ? 'text-sage' : 'text-sage/30'"
        @click="$emit('post')"
      >
        <ion-spinner v-if="posting" name="crescent" class="w-4 h-4 text-sage" />
        <span v-else>Share</span>
      </button>
    </div>
  </header>
</template>
