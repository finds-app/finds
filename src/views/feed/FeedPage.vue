<script setup lang="ts">
import { IonPage, IonContent, IonRefresher, IonRefresherContent, IonInfiniteScroll, IonInfiniteScrollContent, IonSpinner } from '@ionic/vue'
import { useFeed } from './useFeed'
import FeedCard from './components/FeedCard.vue'
import FeedEmpty from './components/FeedEmpty.vue'
import FeedFullscreen from './components/FeedFullscreen.vue'
import FeedHeader from './components/FeedHeader.vue'

const {
  items,
  loading,
  hasMore,
  fullscreenImage,
  refresh,
  loadMore,
  toggleReaction,
  toggleSave,
  goToFind,
  goToUser,
  goToMap,
  goToCommunity,
  openFullscreen,
  closeFullscreen,
} = useFeed()

const handleRefresh = async (event: CustomEvent) => {
  await refresh()
  ;(event.target as HTMLIonRefresherElement).complete()
}

const handleInfinite = async (event: CustomEvent) => {
  await loadMore()
  ;(event.target as HTMLIonInfiniteScrollElement).complete()
}
</script>

<template>
  <ion-page>
    <FeedHeader />

    <ion-content :fullscreen="true" class="[--background:#0E1F1A]">
      <ion-refresher slot="fixed" @ion-refresh="handleRefresh">
        <ion-refresher-content pulling-icon="crescent" refreshing-spinner="crescent" />
      </ion-refresher>

      <div v-if="loading && items.length === 0" class="flex items-center justify-center py-24">
        <ion-spinner name="crescent" class="text-sage w-8 h-8" />
      </div>

      <FeedEmpty v-else-if="!loading && items.length === 0" />

      <div v-else class="flex flex-col gap-4 px-4 pt-4 pb-24">
        <FeedCard
          v-for="item in items"
          :key="item.id"
          :item="item"
          @tap-image="() => goToFind(item.id)"
          @toggle-reaction="toggleReaction"
          @toggle-save="toggleSave"
          @tap-user="goToUser"
          @tap-location="(lat, lng, loc) => goToMap(lat, lng, loc)"
          @tap-community="goToCommunity"
        />
      </div>

      <ion-infinite-scroll :disabled="!hasMore" @ion-infinite="handleInfinite">
        <ion-infinite-scroll-content loading-spinner="crescent" />
      </ion-infinite-scroll>
    </ion-content>

    <FeedFullscreen :image-url="fullscreenImage" @close="closeFullscreen" />
  </ion-page>
</template>
