<template>
  <ion-page>
    <ion-content :fullscreen="true" class="[--background:#0E1F1A]">

      <!-- dot grid background -->
      <div
        class="fixed inset-0 pointer-events-none opacity-40"
        style="background-image: radial-gradient(circle, rgba(82,183,136,0.3) 1px, transparent 1px); background-size: 36px 36px;"
      />

      <div class="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 py-12 text-center">

        <span
          class="font-display font-bold italic text-sage leading-none tracking-tight"
          style="font-size: clamp(5rem, 28vw, 9rem);"
        >finds</span>

        <p
          class="font-display italic text-mint/70 mt-3 mb-2"
          style="font-size: clamp(1.1rem, 4vw, 1.5rem);"
        >things worth a second look</p>

        <p class="font-body font-light text-white/40 text-sm leading-relaxed max-w-[280px] mt-1 mb-8">
          A community of curious eyes. Share the rare, the beautiful,
          the disappearing, the overlooked.
        </p>

        <!-- seven community colour dots -->
        <div class="flex gap-2 mb-12">
          <span
            v-for="c in communities"
            :key="c.color"
            class="w-2 h-2 rounded-full opacity-80"
            :style="{ background: c.color }"
          />
        </div>

        <div class="w-full max-w-xs">
          <ion-button
            expand="block"
            router-link="/auth"
            class="[--background:#52B788] [--background-activated:#48a077] [--color:#1A3C34] [--border-radius:14px] [--padding-top:18px] [--padding-bottom:18px] font-medium text-base mb-3"
          >
            Get started
          </ion-button>
          <p class="text-white/25 text-xs leading-relaxed">
            By continuing you agree to our Terms and Privacy Policy.
          </p>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonButton } from '@ionic/vue'

const communities = [
  { color: '#F2CC60' },
  { color: '#52B788' },
  { color: '#AFA9EC' },
  { color: '#E07A5F' },
  { color: '#85B7EB' },
  { color: '#ED93B1' },
  { color: '#97C459' },
]
</script>
