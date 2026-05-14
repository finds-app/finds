<script setup lang="ts">
import { IonButton, IonInput, IonSpinner } from '@ionic/vue'

defineProps<{
  email: string
  loading: boolean
  error: string
  canSubmit: boolean
}>()

defineEmits<{
  'update:email': [value: string]
  submit: []
}>()
</script>

<template>
  <h1 class="font-display font-bold text-cream text-3xl leading-tight mt-20 mb-3">Join finds</h1>
  <p class="font-body font-light text-white/50 text-sm leading-relaxed mb-6">
    Enter your email and we'll send you a magic link - no password needed.
  </p>

  <div class="rounded-xl border border-white/10 overflow-hidden mb-1">
    <ion-input
      :model-value="email"
      type="email"
      placeholder="your@email.com"
      inputmode="email"
      autocomplete="email"
      :disabled="loading"
      class="[--background:rgba(255,255,255,0.06)] [--color:#F8F4EF] [--placeholder-color:rgba(255,255,255,0.3)] [--padding-start:16px] [--padding-end:16px] [--padding-top:14px] [--padding-bottom:14px]"
      @ion-input="$emit('update:email', String($event.detail.value ?? ''))"
      @keyup.enter="$emit('submit')"
    />
  </div>

  <p v-if="error" class="text-ember text-xs mt-1 mb-3">{{ error }}</p>

  <ion-button
    expand="block"
    :disabled="!canSubmit"
    class="[--background:#52B788] [--background-activated:#48a077] [--color:#1A3C34] [--border-radius:14px] [--padding-top:18px] [--padding-bottom:18px] font-medium text-base mt-4"
    @click="$emit('submit')"
  >
    <ion-spinner v-if="loading" name="crescent" />
    <span v-else>Send magic link</span>
  </ion-button>
</template>
