<script setup lang="ts">
import { IonPage, IonContent, IonRefresher, IonRefresherContent, IonIcon } from '@ionic/vue'
import { chevronBackOutline } from 'ionicons/icons'
import { useProfile } from './useProfile'
import ProfileHeader from './components/ProfileHeader.vue'
import ProfileStats from './components/ProfileStats.vue'
import ProfileGrid from './components/ProfileGrid.vue'
import ProfileMap from './components/ProfileMap.vue'
import ProfileEmpty from './components/ProfileEmpty.vue'
import ProfileSkeleton from './components/ProfileSkeleton.vue'
import ProfileViewToggle from './components/ProfileViewToggle.vue'
import SignOutButton from './components/SignOutButton.vue'
import FollowButton from './components/FollowButton.vue'
import FollowListModal from './components/FollowListModal.vue'

const {
  profile,
  finds,
  mapFinds,
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
    <ion-content
      :fullscreen="true"
      :scroll-y="viewMode === 'grid'"
      :class="[
        '[--background:#0E1F1A]',
        viewMode === 'map' ? 'profile-map-layout' : '',
      ]"
    >
      <!-- Toggle row: centered toggle; back only when viewing someone else -->
      <div
        v-if="showProfileChrome"
        :class="[
          'z-30 shrink-0 bg-[#0E1F1A] border-b border-white/[0.06] px-2 pb-2 pt-[env(safe-area-inset-top,0px)]',
          viewMode === 'map' ? 'profile-map-chrome' : 'sticky top-0',
        ]"
      >
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
            v-if="finds.length > 0"
            class="relative z-20"
            :view-mode="viewMode"
            @change="viewMode = $event"
          />
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
