<script setup lang="ts">
import { IonInput } from '@ionic/vue'

defineProps<{
  username: string
  usernameError: string
  loading: boolean
}>()

defineEmits<{
  'update:username': [value: string]
}>()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label class="text-white/45 text-xs font-medium uppercase tracking-widest">Username</label>
    <div class="flex items-center bg-white/[0.06] border border-white/10 rounded-xl overflow-hidden">
      <span class="pl-4 text-sage font-medium text-base shrink-0">@</span>
      <ion-input
        :model-value="username"
        type="text"
        placeholder="yourcuriouseye"
        autocomplete="username"
        autocorrect="off"
        autocapitalize="none"
        :disabled="loading"
        class="[--background:transparent] [--color:#F8F4EF] [--placeholder-color:rgba(255,255,255,0.25)] [--padding-start:6px] [--padding-end:14px] [--padding-top:14px] [--padding-bottom:14px]"
        @ion-input="$emit('update:username', String($event.detail.value ?? ''))"
      />
    </div>
    <p v-if="usernameError" class="text-ember text-xs">{{ usernameError }}</p>
    <p v-else-if="username && !usernameError" class="text-white/30 text-xs">
      Lowercase letters, numbers, and underscores only.
    </p>
  </div>
</template>
