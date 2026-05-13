<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonRefresher, IonRefresherContent, IonIcon } from '@ionic/vue'
import { chevronBackOutline } from 'ionicons/icons'
import { useProfile } from './useProfile'
import ProfileHeader from './components/ProfileHeader.vue'
import ProfileStats from './components/ProfileStats.vue'
import ProfileGrid from './components/ProfileGrid.vue'
import ProfileMap from './components/ProfileMap.vue'
import ProfileEmpty from './components/ProfileEmpty.vue'
import ProfileSavedGrid from './components/ProfileSavedGrid.vue'
import ProfileSavedEmpty from './components/ProfileSavedEmpty.vue'
import ProfileSkeleton from './components/ProfileSkeleton.vue'
import ProfileViewToggle from './components/ProfileViewToggle.vue'
import SignOutButton from './components/SignOutButton.vue'
import FollowButton from './components/FollowButton.vue'
import FollowListModal from './components/FollowListModal.vue'

const {
  profile,
  finds,
  mapFinds,
  savedFinds,
  savedFindsLoading,
  stats,
  loading,
  viewMode,
  isOwnProfile,
  isFollowing,
  followLoading,
  followListMode,
  followListUsers,
  followListLoading,
  editingBio,
  bioDraft,
  savingBio,
  refresh,
  toggleFollow,
  openFollowList,
  closeFollowList,
  goToFollowUser,
  startEditBio,
  cancelEditBio,
  saveBio,
  goToFind,
  goToTrophies,
  signOut,
  showProfileChrome,
  goBack,
} = useProfile()

const handleRefresh = async (event: CustomEvent) => {
  await refresh()
  ;(event.target as HTMLIonRefresherElement).complete()
}
</script>

<template>
  <ion-page>
    <!-- Toggle row: always above scroll area so refresher starts below -->
    <ion-header
      v-if="showProfileChrome"
      class="ion-no-border profile-chrome-header"
    >
      <ion-toolbar class="[--background:#0E1F1A] [--border-width:0] [--padding-start:0] [--padding-end:0] [--min-height:0]">
        <div class="px-2 pb-2 border-b border-white/[0.06]">
          <div class="relative flex min-h-[48px] items-center justify-center pt-2">
            <div
              v-if="!isOwnProfile"
              class="absolute left-0 top-1/2 z-10 flex -translate-y-1/2 items-center"
            >
              <button
                type="button"
                class="-ml-1 flex h-10 w-10 items-center justify-center rounded-xl border-0 bg-transparent text-cream active:bg-white/[0.06]"
                aria-label="Go back"
                @click="goBack"
              >
                <ion-icon :icon="chevronBackOutline" class="text-[26px]" />
              </button>
            </div>
            <ProfileViewToggle
              v-if="isOwnProfile || finds.length > 0"
              class="relative z-20"
              :view-mode="viewMode"
              :is-own-profile="isOwnProfile"
              @change="viewMode = $event"
            />
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content
      :fullscreen="true"
      :scroll-y="viewMode !== 'map'"
      :class="[
        '[--background:#0E1F1A]',
        viewMode === 'map' ? 'profile-map-layout' : '',
      ]"
    >
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

          <FollowButton
            v-if="!isOwnProfile"
            :following="isFollowing"
            :loading="followLoading"
            @toggle="toggleFollow"
          />

          <ProfileStats
            :stats="stats"
            :is-own-profile="isOwnProfile"
            @tap-followers="openFollowList('followers')"
            @tap-following="openFollowList('following')"
            @tap-trophies="goToTrophies"
          />

          <ProfileGrid v-if="finds.length > 0" :finds="finds" @tap-find="goToFind" />
          <ProfileEmpty v-else :is-own-profile="isOwnProfile" />

          <SignOutButton v-if="isOwnProfile" @sign-out="signOut" />
        </template>
      </template>

      <!-- Saved mode -->
      <template v-else-if="viewMode === 'saved'">
        <ion-refresher slot="fixed" @ion-refresh="handleRefresh">
          <ion-refresher-content pulling-icon="crescent" refreshing-spinner="crescent" />
        </ion-refresher>

        <ProfileSkeleton v-if="savedFindsLoading && savedFinds.length === 0" />
        <ProfileSavedGrid
          v-else-if="savedFinds.length > 0"
          :finds="savedFinds"
          @tap-find="goToFind"
        />
        <ProfileSavedEmpty v-else />

        <div class="pb-[calc(env(safe-area-inset-bottom,16px)+96px)]" />
      </template>

      <!-- Map mode -->
      <div v-else class="profile-map-stage">
        <ProfileMap :finds="mapFinds" @select-find="goToFind" />
      </div>
    </ion-content>

    <FollowListModal
      :is-open="followListMode !== null"
      :mode="followListMode ?? 'followers'"
      :users="followListUsers"
      :loading="followListLoading"
      @close="closeFollowList"
      @tap-user="goToFollowUser"
    />
  </ion-page>
</template>

<style>
.profile-chrome-header {
  background: #0E1F1A;
}

.profile-map-layout {
  --padding-bottom: 0;
  --padding-top: 0;
  --padding-start: 0;
  --padding-end: 0;
}

.profile-map-stage {
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
