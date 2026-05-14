<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { linkOutline } from 'ionicons/icons'

defineEmits<{
  'open-link-modal': []
}>()
</script>

<template>
  <button
    type="button"
    class="w-full flex items-center justify-center gap-2 rounded-2xl py-3 px-3 bg-white/[0.06] border border-white/[0.08] text-cream text-sm font-body font-medium active:bg-white/[0.1]"
    @click="$emit('open-link-modal')"
  >
    <ion-icon :icon="linkOutline" class="text-sage text-lg shrink-0" />
    <span class="truncate">Link one of my finds</span>
  </button>
</template>
