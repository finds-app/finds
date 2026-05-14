<script setup lang="ts">
defineProps<{
  email: string
  resendCooldown: number
}>()

defineEmits<{
  resend: []
}>()
</script>

<template>
  <span class="font-display text-5xl text-sage mt-20 mb-6">✦</span>
  <h1 class="font-display font-bold text-cream text-3xl leading-tight mb-3">Check your email</h1>
  <p class="font-body font-light text-white/50 text-sm leading-relaxed mb-1">
    We sent a magic link to<br />
    <strong class="text-cream font-medium">{{ email }}</strong>
  </p>
  <p class="font-body font-light text-white/35 text-sm leading-relaxed mb-8">
    Tap the link in the email to sign in. You can close this screen.
  </p>
  <button
    class="self-start border border-white/15 rounded-xl text-white/50 text-sm px-5 py-2.5 bg-transparent disabled:opacity-40"
    :disabled="resendCooldown > 0"
    @click="$emit('resend')"
  >
    {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend link' }}
  </button>
</template>
