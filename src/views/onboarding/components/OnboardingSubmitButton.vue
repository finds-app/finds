<script setup lang="ts">
import { IonButton, IonSpinner } from '@ionic/vue'

defineProps<{
  loading: boolean
  canSubmit: boolean
}>()

defineEmits<{
  submit: []
}>()
</script>

<template>
  <ion-button
    expand="block"
    :disabled="loading || !canSubmit"
    class="[--background:#52B788] [--background-activated:#48a077] [--color:#1A3C34] [--border-radius:14px] [--padding-top:18px] [--padding-bottom:18px] font-medium text-base mt-6"
    @click="$emit('submit')"
  >
    <ion-spinner v-if="loading" name="crescent" />
    <span v-else>Let's go</span>
  </ion-button>
</template>
