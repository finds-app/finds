<script setup lang="ts">
import { computed } from 'vue'
import { IonPage, IonContent } from '@ionic/vue'
import { useFindDetail } from './useFindDetail'
import { useAuthStore } from '@/stores/auth'
import { COMMUNITIES } from '@/constants'
import FindDetailHeader from './components/FindDetailHeader.vue'
import FindDetailImage from './components/FindDetailImage.vue'
import FindDetailInfo from './components/FindDetailInfo.vue'
import FindDetailSkeleton from './components/FindDetailSkeleton.vue'
import FindDetailTabs from './components/FindDetailTabs.vue'
import FindChainStrip from './components/FindChainStrip.vue'
import FindChainActions from './components/FindChainActions.vue'
import LinkFindModal from './components/LinkFindModal.vue'
import LikesListModal from './components/LikesListModal.vue'
import CommentsSection from './components/CommentsSection.vue'

const authStore = useAuthStore()

const {
  find,
  loading,
  linkModalOpen,
  linkSubmitting,
  linkError,
  linkModalFinds,
  linkModalLoading,
  likesModalOpen,
  likesModalUsers,
  likesModalLoading,
  comments,
  commentsLoading,
  commentSubmitting,
  commentError,
  newCommentText,
  activeTab,
  setActiveTab,
  showNoticedToo,
  toggleReaction,
  toggleSave,
  goToUser,
  goToMap,
  goToCommunity,
  goToTag,
  goBack,
  goToPostLinked,
  openLinkModal,
  closeLinkModal,
  linkExistingFind,
  goToChainedFind,
  openLikesModal,
  closeLikesModal,
  goToLikedUser,
  submitComment,
  removeComment,
  goToCommentUser,
} = useFindDetail()

const communityMeta = computed(() => {
  const id = find.value?.community
  if (!id) return null
  return COMMUNITIES.find((c) => c.id === id) ?? null
})
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true" class="[--background:#0E1F1A]">
      <FindDetailHeader @back="goBack" />

      <FindDetailSkeleton v-if="loading" />

      <template v-else-if="find">
        <FindDetailImage
          :image-url="find.imageUrl"
          :caption="find.caption"
          :badges="find.badges"
          :community="find.community"
          :community-label="communityMeta?.label ?? null"
          :community-color="communityMeta?.color ?? null"
          @tap-community="goToCommunity"
        />
        <FindDetailInfo
          :find="find"
          :show-noticed-too="showNoticedToo"
          @toggle-reaction="toggleReaction"
          @toggle-save="toggleSave"
          @noticed-too="goToPostLinked"
          @tap-user="goToUser"
          @tap-location="goToMap"
          @tap-tag="goToTag"
          @tap-likes="openLikesModal"
        />

        <div class="mx-5 h-px bg-white/[0.06] mt-4" />

        <FindDetailTabs
          :active-tab="activeTab"
          :comment-count="find.commentCount"
          :chain-count="find.chainCount"
          @change="setActiveTab"
        />

        <div class="pb-[calc(env(safe-area-inset-bottom,0px)+24px)]">
          <CommentsSection
            v-if="activeTab === 'comments'"
            :comments="comments"
            :loading="commentsLoading"
            :submitting="commentSubmitting"
            :error-message="commentError"
            :new-comment-text="newCommentText"
            :current-user-id="authStore.user?.id ?? null"
            @update:new-comment-text="newCommentText = $event"
            @submit="submitComment"
            @remove="removeComment"
            @tap-user="goToCommentUser"
          />

          <div v-else class="px-5 pt-3">
            <FindChainStrip
              v-if="find.chainCount > 0"
              :chained-finds="find.chainedFinds"
              @tap-find="goToChainedFind"
            />
            <div :class="find.chainCount > 0 ? 'mt-3' : ''">
              <FindChainActions @open-link-modal="openLinkModal" />
            </div>
          </div>
        </div>

        <LinkFindModal
          :is-open="linkModalOpen"
          :finds="linkModalFinds"
          :loading="linkModalLoading"
          :submitting="linkSubmitting"
          :error-message="linkError"
          @close="closeLinkModal"
          @select="linkExistingFind"
        />

        <LikesListModal
          :is-open="likesModalOpen"
          :users="likesModalUsers"
          :loading="likesModalLoading"
          @close="closeLikesModal"
          @tap-user="goToLikedUser"
        />
      </template>

      <div v-else class="flex items-center justify-center py-24">
        <p class="text-white/30 text-sm font-body">Find not found</p>
      </div>
    </ion-content>
  </ion-page>
</template>
