<script setup lang="ts">
import { IonPage, IonContent, IonRefresher, IonRefresherContent } from '@ionic/vue'
import { useProfile } from './useProfile'
import ProfileHeader from './components/ProfileHeader.vue'
import ProfileStats from './components/ProfileStats.vue'
import ProfileGrid from './components/ProfileGrid.vue'
import ProfileEmpty from './components/ProfileEmpty.vue'
import ProfileSkeleton from './components/ProfileSkeleton.vue'
import SignOutButton from './components/SignOutButton.vue'

const {
  profile,
  finds,
  stats,
  loading,
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
    <ion-content :fullscreen="true" class="[--background:#0E1F1A]">
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

        <div class="w-full h-px bg-white/10 my-2" />

        <ProfileGrid v-if="finds.length > 0" :finds="finds" @tap-find="goToFind" />
        <ProfileEmpty v-else :is-own-profile="isOwnProfile" />

        <SignOutButton v-if="isOwnProfile" @sign-out="signOut" />
      </template>
    </ion-content>
  </ion-page>
</template>
