<script setup lang="ts">
import { ref } from 'vue'
import { IonIcon } from '@ionic/vue'
import { logOutOutline } from 'ionicons/icons'

defineEmits<{
  signOut: []
}>()

const confirming = ref(false)
</script>

<template>
  <div class="flex justify-center py-8">
    <button
      v-if="!confirming"
      class="flex items-center gap-2 bg-transparent border-0 px-4 py-2"
      @click="confirming = true"
    >
      <ion-icon :icon="logOutOutline" class="text-white/30 text-lg" />
      <span class="text-white/30 text-sm font-body">Sign out</span>
    </button>

    <div v-else class="flex items-center gap-3">
      <span class="text-white/40 text-sm font-body">Sign out?</span>
      <button
        class="px-4 py-1.5 text-sm font-body font-medium text-ember bg-ember/10 rounded-lg border-0"
        @click="$emit('signOut')"
      >
        Yes
      </button>
      <button
        class="px-4 py-1.5 text-sm font-body text-white/40 bg-transparent border-0"
        @click="confirming = false"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
