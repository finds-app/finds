<script setup lang="ts">
import { ref } from 'vue'
import { IonIcon } from '@ionic/vue'
import { logOutOutline } from 'ionicons/icons'
import ConfirmSheet from '@/components/ConfirmSheet.vue'

const emit = defineEmits<{
  signOut: []
}>()

const sheetOpen = ref(false)
</script>

<template>
  <div class="flex justify-center py-8">
    <button
      class="flex items-center gap-2 bg-transparent border-0 px-4 py-2"
      @click="sheetOpen = true"
    >
      <ion-icon :icon="logOutOutline" class="text-white/30 text-lg" />
      <span class="text-white/30 text-sm font-body">Sign out</span>
    </button>
  </div>

  <ConfirmSheet
    :open="sheetOpen"
    title="Sign out?"
    confirm-label="Sign out"
    confirm-color="ember"
    @confirm="emit('signOut')"
    @cancel="sheetOpen = false"
  />
</template>
