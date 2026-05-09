<script setup lang="ts">
import { IonPage, IonContent, IonSpinner } from '@ionic/vue'
import type { MapFindDto } from '@/types'
import { COMMUNITIES } from '@/constants'
import { useDiscover } from './useDiscover'
import DiscoverHeader from './components/DiscoverHeader.vue'
import DiscoverCommunityCard from './components/DiscoverCommunityCard.vue'
import DiscoverMap from './components/DiscoverMap.vue'
import DiscoverPreviewSheet from './components/DiscoverPreviewSheet.vue'
import DiscoverNearMe from './components/DiscoverNearMe.vue'
import DiscoverSearchBar from './components/DiscoverSearchBar.vue'

const {
  viewMode,
  communityPreviews,
  previewsLoading,
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
  goToCommunityFeed,
  setViewMode,
  getPreview,
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
    <ion-content
      :fullscreen="true"
      :scroll-y="viewMode === 'communities'"
      :class="[
        '[--background:#0E1F1A]',
        viewMode === 'map' ? 'discover-map-layout' : '',
      ]"
    >
      <!-- Shared chrome: title + Communities | Map toggle; search bar only in map mode -->
      <div
        :class="[
          'z-30 shrink-0 bg-[#0E1F1A] border-b border-white/[0.06]',
          viewMode === 'map' ? 'discover-map-chrome' : 'sticky top-0',
        ]"
      >
        <DiscoverHeader :view-mode="viewMode" @update:view-mode="setViewMode" />

        <div v-if="viewMode === 'map'" class="px-4 pb-3 pt-1 pointer-events-auto">
          <DiscoverSearchBar :initial-query="incomingSearchQuery" @fly-to="flyTo" />
        </div>
      </div>

      <!-- Communities -->
      <template v-if="viewMode === 'communities'">
        <div v-if="previewsLoading && communityPreviews.length === 0" class="flex items-center justify-center py-24">
          <ion-spinner name="crescent" class="text-sage w-8 h-8" />
        </div>

        <div v-else class="flex flex-col gap-5 px-4 pt-4 pb-[calc(env(safe-area-inset-bottom,16px)+96px)]">
          <DiscoverCommunityCard
            v-for="community in COMMUNITIES"
            :key="community.id"
            :community="community"
            :find-count="getPreview(community.id).findCount"
            :preview-images="getPreview(community.id).previewImages"
            @tap="goToCommunityFeed(community.id)"
          />
        </div>
      </template>

      <!-- Map -->
      <div v-else class="discover-map-stage">
        <DiscoverMap
          :finds="finds"
          :user-location="userLocation"
          @map-ready="onMapReady"
          @select-find="handleSelectFind"
        />

        <div class="absolute inset-0 pointer-events-none" style="z-index: 10;">
          <div
            class="absolute right-4 bottom-4 pointer-events-auto"
          >
            <DiscoverNearMe
              :loading="locating"
              :error="locationError"
              @tap="flyToUser"
              @dismiss-error="clearLocationError"
            />
          </div>
        </div>
      </div>
    </ion-content>

    <DiscoverPreviewSheet
      v-if="selectedFind && viewMode === 'map'"
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
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.discover-map-chrome {
  flex: 0 0 auto;
}

.discover-map-stage {
  flex: 1 1 0%;
  position: relative;
  overflow: hidden;
}
</style>
