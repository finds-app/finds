<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import type { MapFindDto } from '@/types'
import { useDiscover } from './useDiscover'
import DiscoverMap from './components/DiscoverMap.vue'
import DiscoverPreviewSheet from './components/DiscoverPreviewSheet.vue'
import DiscoverNearMe from './components/DiscoverNearMe.vue'
import DiscoverUnifiedSearch from './components/DiscoverUnifiedSearch.vue'

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
  flyToCoords,
} = useDiscover()

const handleSelectFind = (find: MapFindDto | null) => {
  if (find) selectFind(find)
  else clearSelection()
}

const onSelectPlace = (lng: number, lat: number, zoom?: number) => {
  flyToCoords(lng, lat, zoom ?? 13)
}
</script>

<template>
  <ion-page>
    <ion-content
      :fullscreen="true"
      :scroll-y="false"
      class="[--background:#0E1F1A] discover-map-layout"
    >
      <div class="discover-map-fullscreen">
        <DiscoverMap
          :finds="finds"
          :user-location="userLocation"
          @map-ready="onMapReady"
          @select-find="handleSelectFind"
        />

        <!-- Search bar floating over the map -->
        <div class="absolute inset-x-0 top-0 z-30 pt-[env(safe-area-inset-top,0px)] pointer-events-none">
          <div class="pointer-events-auto">
            <DiscoverUnifiedSearch
              :initial-query="incomingSearchQuery"
              @select-place="onSelectPlace"
            />
          </div>
        </div>

        <!-- Near me button -->
        <div class="absolute right-4 bottom-4 z-10 pointer-events-auto">
          <DiscoverNearMe
            :loading="locating"
            :error="locationError"
            @tap="flyToUser"
            @dismiss-error="clearLocationError"
          />
        </div>
      </div>
    </ion-content>

    <DiscoverPreviewSheet
      v-if="selectedFind"
      :find="selectedFind"
      @view-find="goToFindDetail"
    />
  </ion-page>
</template>

<style>
.discover-map-layout {
  --padding-bottom: 0;
  --padding-top: 0;
  --padding-start: 0;
  --padding-end: 0;
}

.discover-map-layout::part(scroll) {
  height: 100%;
  overflow: hidden;
}

.discover-map-fullscreen {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
