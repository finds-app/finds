<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useImagePicker } from '@/composables/useImagePicker'
import { useLocation } from '@/composables/useLocation'
import { usePostFind } from './usePostFind'
import PostFindCaptionField from './components/PostFindCaptionField.vue'
import PostFindCommunityPicker from './components/PostFindCommunityPicker.vue'
import PostFindError from './components/PostFindError.vue'
import PostFindHeader from './components/PostFindHeader.vue'
import PostFindImagePicker from './components/PostFindImagePicker.vue'
import PostFindLocationRow from './components/PostFindLocationRow.vue'

const router = useRouter()
const { imagePreview, imageBlob, pickImage } = useImagePicker()
const { locationName, lat, lng, locationLoading } = useLocation()
const { caption, community, canPost, posting, postError, toggleCommunity, post } = usePostFind({
  imageBlob,
  locationName,
  lat,
  lng,
})
</script>

<template>
  <ion-page>
    <PostFindHeader
      :can-post="canPost"
      :posting="posting"
      @cancel="router.back()"
      @post="post"
    />

    <ion-content class="[--background:#0E1F1A]">
      <div class="flex flex-col min-h-full">
        <PostFindImagePicker :image-preview="imagePreview" @pick="pickImage" />

        <div class="flex flex-col gap-0 px-5 py-4">
          <PostFindCaptionField v-model="caption" />
          <PostFindLocationRow :location-name="locationName" :location-loading="locationLoading" />
          <PostFindCommunityPicker :selected-community="community" @select="toggleCommunity" />
        </div>
      </div>

      <PostFindError :message="postError" />
    </ion-content>
  </ion-page>
</template>
