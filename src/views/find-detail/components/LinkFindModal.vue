<script setup lang="ts">
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonSpinner,
} from '@ionic/vue'
import type { FindDto } from '@/types'

defineProps<{
  isOpen: boolean
  finds: FindDto[]
  loading: boolean
  submitting: boolean
  errorMessage: string
}>()

defineEmits<{
  close: []
  select: [findId: string]
}>()
</script>

<template>
  <ion-modal :is-open="isOpen" @did-dismiss="$emit('close')">
    <ion-header class="ion-no-border">
      <ion-toolbar class="[--background:#0E1F1A] [--border-color:rgba(255,255,255,0.06)]">
        <ion-title class="font-display font-semibold text-cream text-base">Link my find</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" class="text-sage font-body text-sm" @click="$emit('close')">
            Cancel
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="[--background:#0E1F1A]">
        <p v-if="errorMessage" class="text-ember/90 text-xs font-body px-4 pt-2 m-0">{{ errorMessage }}</p>

      <div v-if="loading" class="flex justify-center py-16">
        <ion-spinner name="crescent" class="text-sage w-8 h-8" />
      </div>

      <div v-else-if="finds.length === 0" class="px-6 py-16 text-center">
        <p class="text-white/35 text-sm font-body m-0 leading-relaxed">
          You don't have any finds to link yet.
        </p>
      </div>

      <div v-else class="grid grid-cols-3 gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          v-for="f in finds"
          :key="f.id"
          type="button"
          :disabled="submitting"
          class="relative aspect-square rounded-xl overflow-hidden border-0 p-0 m-0 bg-white/[0.06] active:opacity-70 disabled:opacity-40"
          @click="$emit('select', f.id)"
        >
          <img :src="f.imageUrl" alt="" class="w-full h-full object-cover block" loading="lazy" />
        </button>
      </div>
    </ion-content>
  </ion-modal>
</template>
