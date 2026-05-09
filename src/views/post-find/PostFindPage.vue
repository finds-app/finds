<script setup lang="ts">
import { watch } from 'vue'
import { IonPage, IonContent } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useImagePicker } from '@/composables/useImagePicker'
import { usePostLocation } from '@/composables/usePostLocation'
import { usePostFind } from './usePostFind'
import PostFindCaptionField from './components/PostFindCaptionField.vue'
import PostFindCommunityPicker from './components/PostFindCommunityPicker.vue'
import PostFindError from './components/PostFindError.vue'
import PostFindHeader from './components/PostFindHeader.vue'
import PostFindImagePicker from './components/PostFindImagePicker.vue'
import PostFindLocationRow from './components/PostFindLocationRow.vue'

const router = useRouter()
const { imagePreview, imageBlob, photoGps, pickImage } = useImagePicker()
const { locationName, lat, lng, gpsLoading, setFromCoords, detectDeviceLocation, setManualLocation, clearLocation } = usePostLocation()
const { caption, community, canPost, posting, postError, toggleCommunity, post } = usePostFind({
  imageBlob,
  locationName,
  lat,
  lng,
})

watch(photoGps, (gps) => {
  if (gps) setFromCoords(gps.lat, gps.lng)
})
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true" class="[--background:#0E1F1A]">
      <PostFindHeader
        :can-post="canPost"
        :posting="posting"
        @cancel="router.back()"
        @post="post"
      />

      <PostFindImagePicker :image-preview="imagePreview" @pick="pickImage" />

      <div class="px-5 pt-5 pb-4 flex flex-col gap-0">
        <PostFindCaptionField v-model="caption" />

        <div class="border-t border-white/[0.06] mt-3">
          <PostFindLocationRow
            :location-name="locationName"
            :gps-loading="gpsLoading"
            :has-location="!!locationName"
            @update:location-name="locationName = $event"
            @select-place="(name, lat, lng) => setManualLocation(name, lat, lng)"
            @use-current="detectDeviceLocation"
            @clear="clearLocation"
          />
        </div>

        <div class="border-t border-white/[0.06]">
          <PostFindCommunityPicker :selected-community="community" @select="toggleCommunity" />
        </div>
      </div>

      <PostFindError :message="postError" />

      <div class="pb-[env(safe-area-inset-bottom,16px)]" />
    </ion-content>
  </ion-page>
</template>
