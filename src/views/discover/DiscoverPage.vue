<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import type { MapFindDto } from '@/types'
import { useDiscover } from './useDiscover'
import DiscoverMap from './components/DiscoverMap.vue'
import DiscoverPreviewSheet from './components/DiscoverPreviewSheet.vue'
import DiscoverNearMe from './components/DiscoverNearMe.vue'
import DiscoverSearchBar from './components/DiscoverSearchBar.vue'

const {
  finds,
  selectedFind,
  userLocation,
  locating,
  locationError,
  clearLocationError,
  incomingSearchQuery,
  onMapReady,
  selectFind,
  clearSelection,
  goToFindDetail,
  flyToUser,
  flyTo,
} = useDiscover()

const handleSelectFind = (find: MapFindDto | null) => {
  if (find) selectFind(find)
  else clearSelection()
}

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true" :scroll-y="false" class="discover-content">
      <!-- Map fills the entire content area -->
      <DiscoverMap
        :finds="finds"
        :user-location="userLocation"
        @map-ready="onMapReady"
        @select-find="handleSelectFind"
      />

      <!-- Floating chrome: search bar top, near-me button bottom-right -->
      <div class="absolute inset-0 pointer-events-none" style="z-index: 10;">
        <div
          class="absolute left-4 right-4 pointer-events-auto"
          style="top: max(env(safe-area-inset-top, 16px), 16px); padding-top: 8px;"
        >
          <DiscoverSearchBar :initial-query="incomingSearchQuery" @fly-to="flyTo" />
        </div>

        <div
          class="absolute right-4 pointer-events-auto"
          style="bottom: calc(env(safe-area-inset-bottom, 0px) + 16px)"
        >
          <DiscoverNearMe
          :loading="locating"
          :error="locationError"
          @tap="flyToUser"
          @dismiss-error="clearLocationError"
        />
        </div>
      </div>
    </ion-content>

    <!-- Preview sheet outside IonContent so it sits above the tab bar -->
    <DiscoverPreviewSheet
      v-if="selectedFind"
      :find="selectedFind"
      @view-find="goToFindDetail"
    />
  </ion-page>
</template>

<style>
.discover-content {
  --background: #0E1F1A;
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
}

/* Make the scroll container fill height and clip overflow */
.discover-content::part(scroll) {
  overflow: hidden;
  position: relative;
  height: 100%;
  touch-action: none;
}
</style>
