<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import { useFindDetail } from './useFindDetail'
import FindDetailHeader from './components/FindDetailHeader.vue'
import FindDetailImage from './components/FindDetailImage.vue'
import FindDetailInfo from './components/FindDetailInfo.vue'
import FindDetailSkeleton from './components/FindDetailSkeleton.vue'

const {
  find,
  loading,
  toggleReaction,
  toggleSave,
  goToUser,
  goToMap,
  goToCommunity,
  goBack,
} = useFindDetail()
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true" class="[--background:#0E1F1A]">
      <FindDetailHeader @back="goBack" />

      <FindDetailSkeleton v-if="loading" />

      <template v-else-if="find">
        <FindDetailImage
          :image-url="find.imageUrl"
          :caption="find.caption"
        />
        <FindDetailInfo
          :find="find"
          @toggle-reaction="toggleReaction"
          @toggle-save="toggleSave"
          @tap-user="goToUser"
          @tap-location="goToMap"
          @tap-community="goToCommunity"
        />
      </template>

      <div v-else class="flex items-center justify-center py-24">
        <p class="text-white/30 text-sm font-body">Find not found</p>
      </div>
    </ion-content>
  </ion-page>
</template>
