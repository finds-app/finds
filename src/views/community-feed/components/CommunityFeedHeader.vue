<script setup lang="ts">
import { IonHeader, IonToolbar, IonIcon } from '@ionic/vue'
import { arrowBackOutline } from 'ionicons/icons'
import type { Community } from '@/types'

defineProps<{
  community: Community
}>()

defineEmits<{
  back: []
}>()
</script>

<template>
  <ion-header class="ion-no-border">
    <ion-toolbar class="[--background:#0E1F1A] [--border-color:rgba(255,255,255,0.06)] px-1">
      <div class="flex items-center gap-2 min-h-[52px]">
        <button
          type="button"
          class="shrink-0 w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center border-0 p-0 ml-1 active:opacity-70"
          aria-label="Back"
          @click="$emit('back')"
        >
          <ion-icon :icon="arrowBackOutline" class="text-white text-xl" />
        </button>

        <div class="flex-1 flex items-center justify-center gap-2 min-w-0 pr-10">
          <span
            class="w-2 h-2 rounded-full shrink-0 shadow-sm"
            :style="{ backgroundColor: community.color }"
          />
          <span
            class="truncate font-display font-semibold text-base tracking-tight"
            :style="{ color: community.color }"
          >
            {{ community.label }}
          </span>
        </div>
      </div>
    </ion-toolbar>
  </ion-header>
</template>
