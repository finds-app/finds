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
    placeholder="What did you find?"
    :auto-grow="true"
    :rows="2"
    class="[--background:transparent] [--color:#F8F4EF] [--placeholder-color:rgba(255,255,255,0.25)] [--padding-start:0] [--padding-end:0] text-[15px] font-body"
    @ion-input="$emit('update:modelValue', String($event.detail.value ?? ''))"
  />
</template>
