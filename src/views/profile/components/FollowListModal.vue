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
import type { FollowUserDto } from '@/types'

defineProps<{
  isOpen: boolean
  mode: 'followers' | 'following'
  users: FollowUserDto[]
  loading: boolean
}>()

defineEmits<{
  close: []
  'tap-user': [userId: string]
}>()

const titleFor = (mode: 'followers' | 'following') =>
  mode === 'followers' ? 'Followers' : 'Following'
</script>

<template>
  <ion-modal :is-open="isOpen" @did-dismiss="$emit('close')">
    <ion-header class="ion-no-border">
      <ion-toolbar class="[--background:#0E1F1A] [--border-color:rgba(255,255,255,0.06)]">
        <ion-title class="font-display font-semibold text-cream text-base">
          {{ titleFor(mode) }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" class="text-sage font-body text-sm" @click="$emit('close')">
            Done
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="[--background:#0E1F1A]">
      <div v-if="loading" class="flex justify-center py-16">
        <ion-spinner name="crescent" class="text-sage w-8 h-8" />
      </div>

      <div v-else-if="users.length === 0" class="px-6 py-16 text-center">
        <p class="text-white/35 text-sm font-body m-0">No one here yet.</p>
      </div>

      <ul v-else class="list-none m-0 p-0">
        <li v-for="u in users" :key="u.id" class="border-b border-white/[0.06]">
          <button
            type="button"
            class="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-0 text-left active:bg-white/[0.04]"
            @click="$emit('tap-user', u.id)"
          >
            <div class="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center shrink-0">
              <span class="text-sage text-sm font-bold font-display uppercase">{{ u.username[0] }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <span class="text-cream text-sm font-medium font-body block truncate">
                {{ u.displayName ?? u.username }}
              </span>
              <span class="text-white/35 text-xs font-body block truncate">@{{ u.username }}</span>
            </div>
          </button>
        </li>
      </ul>
    </ion-content>
  </ion-modal>
</template>
