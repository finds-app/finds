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
    <ion-content
      :fullscreen="true"
      :scroll-y="viewMode === 'grid'"
      :class="[
        '[--background:#0E1F1A]',
        viewMode === 'map' ? 'profile-map-layout' : '',
      ]"
    >
      <!-- Toggle row: same position as Explore header -->
      <div
        v-if="!loading && profile && finds.length > 0"
        :class="[
          'z-30 shrink-0 bg-[#0E1F1A] border-b border-white/[0.06] px-2 pb-2 pt-[env(safe-area-inset-top,0px)]',
          viewMode === 'map' ? 'profile-map-chrome' : 'sticky top-0',
        ]"
      >
        <div class="flex items-center justify-between gap-3 min-h-[48px] pt-2">
          <h1 class="font-display font-bold italic text-cream text-xl shrink-0 pl-1 m-0">
            Profile
          </h1>
          <ProfileViewToggle :view-mode="viewMode" @change="viewMode = $event" />
        </div>
      </div>

      <!-- Grid mode -->
      <template v-if="viewMode === 'grid'">
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

          <ProfileGrid v-if="finds.length > 0" :finds="finds" @tap-find="goToFind" />
          <ProfileEmpty v-else :is-own-profile="isOwnProfile" />

          <SignOutButton v-if="isOwnProfile" @sign-out="signOut" />
        </template>
      </template>

      <!-- Map mode -->
      <div v-else class="profile-map-stage">
        <ProfileMap :finds="mapFinds" @select-find="goToFind" />
      </div>
    </ion-content>
  </ion-page>
</template>

<style>
.profile-map-layout {
  --padding-bottom: 0;
  --padding-top: 0;
  --padding-start: 0;
  --padding-end: 0;
}

.profile-map-layout::part(scroll) {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.profile-map-chrome {
  flex: 0 0 auto;
}

.profile-map-stage {
  flex: 1 1 0%;
  position: relative;
  overflow: hidden;
}
</style>
