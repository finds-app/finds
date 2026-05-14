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
import { useTagFeed } from './useTagFeed'
import TagFeedHeader from './components/TagFeedHeader.vue'
import FeedCard from '@/views/feed/components/FeedCard.vue'
import FeedEmpty from '@/views/feed/components/FeedEmpty.vue'

const {
  tagSlug,
  invalidTag,
  items,
  loading,
  hasMore,
  refresh,
  loadMore,
  toggleReaction,
  toggleSave,
  goToFind,
  goToFindComments,
  goToUser,
  goToMap,
  goToCollection,
  goToTag,
  goBack,
} = useTagFeed()

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
    <TagFeedHeader v-if="!invalidTag && tagSlug" :tag="tagSlug" @back="goBack" />

    <ion-content :fullscreen="true" class="[--background:#0E1F1A]">
      <template v-if="invalidTag && !loading">
        <div class="flex flex-col items-center justify-center px-8 py-24 gap-4">
          <p class="text-white/40 text-sm font-body text-center m-0">
            This tag isn&apos;t valid. Use letters, numbers, dashes, or underscores.
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

      <template v-else-if="tagSlug">
        <ion-refresher slot="fixed" @ion-refresh="handleRefresh">
          <ion-refresher-content pulling-icon="crescent" refreshing-spinner="crescent" />
        </ion-refresher>

        <div v-if="loading && items.length === 0" class="flex items-center justify-center py-24">
          <ion-spinner name="crescent" class="text-sage w-8 h-8" />
        </div>

        <FeedEmpty
          v-else-if="!loading && items.length === 0"
          title="Nothing tagged yet"
          description="No finds use this tag. Try another one."
        />

        <div v-else class="flex flex-col gap-4 px-4 pt-4 pb-24">
          <FeedCard
            v-for="item in items"
            :key="item.id"
            :item="item"
            @tap-image="() => goToFind(item.id)"
            @toggle-reaction="toggleReaction"
            @toggle-save="toggleSave"
            @tap-comment="goToFindComments"
            @tap-user="goToUser"
            @tap-location="(lat, lng, loc) => goToMap(lat, lng, loc)"
            @tap-collection="goToCollection"
            @tap-tag="goToTag"
          />
        </div>

        <ion-infinite-scroll :disabled="!hasMore" @ion-infinite="handleInfinite">
          <ion-infinite-scroll-content loading-spinner="crescent" />
        </ion-infinite-scroll>
      </template>
    </ion-content>
  </ion-page>
</template>
