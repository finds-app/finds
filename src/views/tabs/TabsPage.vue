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

        <ion-tab-button class="[--color:transparent] [--color-selected:transparent]" @click="router.push(ROUTES.postFind)">
          <div class="w-[52px] h-[52px] rounded-2xl bg-sage flex items-center justify-center -mt-3">
            <ion-icon :icon="addOutline" class="text-[28px] text-forest" />
          </div>
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
  </ion-page>
</template>
