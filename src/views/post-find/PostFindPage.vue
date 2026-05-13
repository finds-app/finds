<script setup lang="ts">
import { ref, watch } from 'vue'
import { IonPage, IonContent } from '@ionic/vue'
import { useRoute, useRouter } from 'vue-router'
import { useImagePicker } from '@/composables/useImagePicker'
import { usePostLocation } from '@/composables/usePostLocation'
import { usePostFind } from './usePostFind'
import PostFindCaptionField from './components/PostFindCaptionField.vue'
import PostFindCommunityPicker from './components/PostFindCommunityPicker.vue'
import PostFindTagInput from './components/PostFindTagInput.vue'
import PostFindError from './components/PostFindError.vue'
import PostFindHeader from './components/PostFindHeader.vue'
import PostFindImagePicker from './components/PostFindImagePicker.vue'
import PostFindLocationRow from './components/PostFindLocationRow.vue'
import PostFindLinkedBanner from './components/PostFindLinkedBanner.vue'
import * as findsService from '@/services/finds.service'
import { ROUTES } from '@/constants'

const router = useRouter()
const route = useRoute()
const { imagePreview, imageBlob, photoGps, pickImage } = useImagePicker()
const { locationName, lat, lng, gpsLoading, setFromCoords, detectDeviceLocation, setManualLocation, clearLocation } = usePostLocation()

const linkToFindId = ref<string | null>(null)
const linkParentPreview = ref<{ imageUrl: string; username: string } | null>(null)

const syncLinkToFromRoute = () => {
  const raw = route.query.linkTo
  const q = Array.isArray(raw) ? raw[0] : raw
  linkToFindId.value = typeof q === 'string' && q.length > 0 ? q : null
}

watch(
  () => route.query.linkTo,
  () => {
    syncLinkToFromRoute()
  },
  { immediate: true },
)

watch(
  linkToFindId,
  async (id) => {
    if (!id) {
      linkParentPreview.value = null
      return
    }
    try {
      const d = await findsService.getFindDetail(id)
      linkParentPreview.value = d
        ? { imageUrl: d.imageUrl, username: d.user.username }
        : null
    } catch {
      linkParentPreview.value = null
    }
  },
  { immediate: true },
)

const { caption, community, tags, canPost, posting, postError, toggleCommunity, post } = usePostFind({
  imageBlob,
  locationName,
  lat,
  lng,
  linkToFindId,
})

const clearLinkedParent = () => {
  void router.replace({ path: ROUTES.postFind })
}

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

      <PostFindLinkedBanner
        v-if="linkParentPreview && linkToFindId"
        :parent-image-url="linkParentPreview.imageUrl"
        :parent-username="linkParentPreview.username"
        @remove="clearLinkedParent"
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

        <div class="border-t border-white/[0.06]">
          <PostFindTagInput v-model="tags" />
        </div>
      </div>

      <PostFindError :message="postError" />

      <div class="pb-[env(safe-area-inset-bottom,16px)]" />
    </ion-content>
  </ion-page>
</template>
