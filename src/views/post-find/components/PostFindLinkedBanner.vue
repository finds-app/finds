<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { closeOutline } from 'ionicons/icons'

defineProps<{
  parentImageUrl: string
  parentUsername: string
}>()

defineEmits<{
  remove: []
}>()
</script>

<template>
  <div
    class="mx-5 mt-3 mb-1 flex items-center gap-3 rounded-2xl bg-white/[0.06] border border-white/[0.08] px-3 py-2.5"
  >
    <div class="w-12 h-12 rounded-xl overflow-hidden shrink-0 ring-1 ring-white/10">
      <img :src="parentImageUrl" alt="" class="w-full h-full object-cover block" />
    </div>
    <div class="min-w-0 flex-1">
      <p class="text-white/45 text-[10px] font-body uppercase tracking-wide m-0 mb-0.5">Linking to</p>
      <p class="text-cream text-sm font-body font-medium m-0 truncate">@{{ parentUsername }}'s find</p>
    </div>
    <button
      type="button"
      class="shrink-0 w-9 h-9 rounded-xl bg-white/[0.06] border-0 flex items-center justify-center active:bg-white/[0.1]"
      aria-label="Remove link"
      @click="$emit('remove')"
    >
      <ion-icon :icon="closeOutline" class="text-white/50 text-xl" />
    </button>
  </div>
</template>
