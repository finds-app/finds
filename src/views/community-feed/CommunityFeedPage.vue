<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSpinner,
} from '@ionic/vue'
import { useCommunityFeed } from './useCommunityFeed'
import CommunityFeedHeader from './components/CommunityFeedHeader.vue'
import FeedCard from '@/views/feed/components/FeedCard.vue'
import FeedEmpty from '@/views/feed/components/FeedEmpty.vue'

const {
  community,
  invalidCommunity,
  items,
  loading,
  hasMore,
  refresh,
  loadMore,
  toggleReaction,
  toggleSave,
  goToFind,
  goToUser,
  goToMap,
  goBack,
} = useCommunityFeed()

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
    <CommunityFeedHeader v-if="community" :community="community" @back="goBack" />

    <ion-content :fullscreen="true" class="[--background:#0E1F1A]">
      <template v-if="invalidCommunity && !loading">
        <div class="flex flex-col items-center justify-center px-8 py-24 gap-4">
          <p class="text-white/40 text-sm font-body text-center m-0">
            This community doesn&apos;t exist.
          </p>
          <button
            type="button"
            class="text-sage text-sm font-body font-medium border-0 bg-transparent p-0 active:opacity-70"
            @click="goBack"
          >
            Go back
          </button>
        </div>
      </template>

      <template v-else-if="community">
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
          />
        </div>

        <ion-infinite-scroll :disabled="!hasMore" @ion-infinite="handleInfinite">
          <ion-infinite-scroll-content loading-spinner="crescent" />
        </ion-infinite-scroll>
      </template>
    </ion-content>
  </ion-page>
</template>
