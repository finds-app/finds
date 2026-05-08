<script setup lang="ts">
import { IonTextarea } from '@ionic/vue'

defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <ion-textarea
    :model-value="modelValue"
    placeholder="What did you notice?"
    :auto-grow="true"
    :rows="3"
    class="[--background:transparent] [--color:#F8F4EF] [--placeholder-color:rgba(255,255,255,0.25)] [--padding-start:0] text-base font-body border-b border-white/[0.08] pb-4 mb-4"
    @ion-input="$emit('update:modelValue', String($event.detail.value ?? ''))"
  />
</template>
