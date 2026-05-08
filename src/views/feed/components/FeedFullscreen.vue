<script setup lang="ts">
defineProps<{
  imageUrl: string | null
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="imageUrl"
        class="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
        @click="$emit('close')"
      >
        <img
          :src="imageUrl"
          class="max-w-full max-h-full object-contain"
          @click.stop
        />
        <button
          class="absolute top-[env(safe-area-inset-top,16px)] right-4 mt-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-xl"
          @click="$emit('close')"
        >
          &times;
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
