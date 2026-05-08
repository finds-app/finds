<script setup lang="ts">
import { IonInput } from '@ionic/vue'

defineProps<{
  displayName: string
  loading: boolean
}>()

defineEmits<{
  'update:displayName': [value: string]
}>()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label class="text-white/45 text-xs font-medium uppercase tracking-widest">Display name</label>
    <div class="rounded-xl border border-white/10 overflow-hidden">
      <ion-input
        :model-value="displayName"
        type="text"
        placeholder="Your name"
        autocomplete="name"
        :disabled="loading"
        class="[--background:rgba(255,255,255,0.06)] [--color:#F8F4EF] [--placeholder-color:rgba(255,255,255,0.25)] [--padding-start:16px] [--padding-end:16px] [--padding-top:14px] [--padding-bottom:14px]"
        @ion-input="$emit('update:displayName', String($event.detail.value ?? ''))"
      />
    </div>
  </div>
</template>
