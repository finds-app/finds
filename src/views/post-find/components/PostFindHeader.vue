<script setup lang="ts">
import { IonButton, IonButtons, IonHeader, IonSpinner, IonTitle, IonToolbar } from '@ionic/vue'

defineProps<{
  canPost: boolean
  posting: boolean
}>()

defineEmits<{
  cancel: []
  post: []
}>()
</script>

<template>
  <ion-header>
    <ion-toolbar class="[--background:#0E1F1A] [--border-color:rgba(255,255,255,0.08)]">
      <ion-buttons slot="start">
        <ion-button class="[--color:#F8F4EF]" @click="$emit('cancel')">Cancel</ion-button>
      </ion-buttons>
      <ion-title class="font-display italic text-sage text-lg">finds</ion-title>
      <ion-buttons slot="end">
        <ion-button
          :disabled="!canPost || posting"
          class="[--color:#52B788] font-medium"
          @click="$emit('post')"
        >
          <ion-spinner v-if="posting" name="crescent" class="w-4 h-4" />
          <span v-else>Post</span>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>
