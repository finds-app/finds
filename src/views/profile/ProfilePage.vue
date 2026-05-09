<script setup lang="ts">
import { IonPage, IonContent, IonRefresher, IonRefresherContent } from '@ionic/vue'
import { useProfile } from './useProfile'
import ProfileHeader from './components/ProfileHeader.vue'
import ProfileStats from './components/ProfileStats.vue'
import ProfileGrid from './components/ProfileGrid.vue'
import ProfileMap from './components/ProfileMap.vue'
import ProfileEmpty from './components/ProfileEmpty.vue'
import ProfileSkeleton from './components/ProfileSkeleton.vue'
import ProfileViewToggle from './components/ProfileViewToggle.vue'
import SignOutButton from './components/SignOutButton.vue'

const {
  profile,
  finds,
  mapFinds,
  stats,
  loading,
  viewMode,
  isOwnProfile,
  editingBio,
  bioDraft,
  savingBio,
  refresh,
  startEditBio,
  cancelEditBio,
  saveBio,
  goToFind,
  signOut,
} = useProfile()

const handleRefresh = async (event: CustomEvent) => {
  await refresh()
  ;(event.target as HTMLIonRefresherElement).complete()
}
</script>

<template>
  <ion-page>
    <!-- Map mode: full-screen map with floating toggle -->
    <ion-content
      v-if="!loading && profile && viewMode === 'map'"
      :fullscreen="true"
      :scroll-y="false"
      class="profile-map-content"
    >
      <ProfileMap :finds="mapFinds" @select-find="goToFind" />

      <div class="absolute inset-x-0 z-10 flex justify-center pointer-events-none" style="top: max(env(safe-area-inset-top, 16px), 16px);">
        <ProfileViewToggle :view-mode="viewMode" class="pointer-events-auto" @change="viewMode = $event" />
      </div>
    </ion-content>

    <!-- Grid mode: scrollable profile layout -->
    <ion-content v-else :fullscreen="true" class="[--background:#0E1F1A]">
      <ion-refresher slot="fixed" @ion-refresh="handleRefresh">
        <ion-refresher-content pulling-icon="crescent" refreshing-spinner="crescent" />
      </ion-refresher>

      <ProfileSkeleton v-if="loading" />

      <template v-else-if="profile">
        <ProfileHeader
          :profile="profile"
          :is-own-profile="isOwnProfile"
          :editing-bio="editingBio"
          :bio-draft="bioDraft"
          :saving-bio="savingBio"
          @start-edit-bio="startEditBio"
          @cancel-edit-bio="cancelEditBio"
          @save-bio="saveBio"
          @update:bio-draft="bioDraft = $event"
        />

        <ProfileStats :stats="stats" />


        <div class="flex justify-center pb-4">
          <ProfileViewToggle
            v-if="finds.length > 0"
            :view-mode="viewMode"
            @change="viewMode = $event"
          />
        </div>

        <ProfileGrid v-if="finds.length > 0" :finds="finds" @tap-find="goToFind" />
        <ProfileEmpty v-else :is-own-profile="isOwnProfile" />

        <SignOutButton v-if="isOwnProfile" @sign-out="signOut" />
      </template>
    </ion-content>
  </ion-page>
</template>

<style>
.profile-map-content {
  --background: #0E1F1A;
}

.profile-map-content::part(scroll) {
  overflow: hidden;
  height: 100%;
  touch-action: none;
}
</style>
