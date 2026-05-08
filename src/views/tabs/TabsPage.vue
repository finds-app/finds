<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue'
import { homeOutline, searchOutline, addOutline, ribbonOutline, personOutline } from 'ionicons/icons'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/constants'

const router = useRouter()
</script>

<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />
      <ion-tab-bar slot="bottom" class="[--background:#0A1712] [--border-color:rgba(255,255,255,0.06)]">

        <ion-tab-button tab="tab1" :href="ROUTES.feed" class="[--color:rgba(255,255,255,0.35)] [--color-selected:#52B788]">
          <ion-icon :icon="homeOutline" />
          <ion-label>Feed</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" :href="ROUTES.discover" class="[--color:rgba(255,255,255,0.35)] [--color-selected:#52B788]">
          <ion-icon :icon="searchOutline" />
          <ion-label>Explore</ion-label>
        </ion-tab-button>

        <ion-tab-button disabled class="[--color:transparent] [--color-selected:transparent] opacity-0">
          <ion-icon :icon="addOutline" />
        </ion-tab-button>

        <ion-tab-button tab="tab3" :href="ROUTES.profile" class="[--color:rgba(255,255,255,0.35)] [--color-selected:#52B788]">
          <ion-icon :icon="ribbonOutline" />
          <ion-label>Trophies</ion-label>
        </ion-tab-button>

        <ion-tab-button class="[--color:rgba(255,255,255,0.35)] [--color-selected:#52B788]">
          <ion-icon :icon="personOutline" />
          <ion-label>Profile</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>

    <button
      class="fixed left-1/2 -translate-x-1/2 bottom-[calc(env(safe-area-inset-bottom,0px)+16px)] z-50 w-[56px] h-[56px] rounded-2xl bg-sage flex items-center justify-center shadow-lg shadow-sage/25 active:scale-95 transition-transform"
      @click="router.push(ROUTES.postFind)"
    >
      <ion-icon :icon="addOutline" class="text-[28px] text-forest" />
    </button>
  </ion-page>
</template>
