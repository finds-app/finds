<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import { useFindDetail } from './useFindDetail'
import { useAuthStore } from '@/stores/auth'
import FindDetailHeader from './components/FindDetailHeader.vue'
import FindDetailImage from './components/FindDetailImage.vue'
import FindDetailInfo from './components/FindDetailInfo.vue'
import FindDetailSkeleton from './components/FindDetailSkeleton.vue'
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
        />
        <FindDetailInfo
          :find="find"
          :show-noticed-too="showNoticedToo"
          @toggle-reaction="toggleReaction"
          @toggle-save="toggleSave"
          @noticed-too="goToPostLinked"
          @tap-user="goToUser"
          @tap-location="goToMap"
          @tap-community="goToCommunity"
          @tap-tag="goToTag"
          @tap-likes="openLikesModal"
        />

        <CommentsSection
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

        <!-- Chain section -->
        <div class="px-5 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+24px)]">
          <FindChainStrip
            v-if="find.chainCount > 0"
            :chained-finds="find.chainedFinds"
            @tap-find="goToChainedFind"
          />
          <div :class="find.chainCount > 0 ? 'mt-3' : ''">
            <FindChainActions @open-link-modal="openLinkModal" />
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
