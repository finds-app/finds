<script setup lang="ts">
import { computed } from 'vue'
import { IonIcon, IonSpinner, IonTextarea } from '@ionic/vue'
import { sendOutline, trashOutline, chatbubbleOutline } from 'ionicons/icons'
import type { CommentDto } from '@/types'
import { MAX_COMMENT_LENGTH } from '@/services/comments.service'
import { timeAgo } from '@/utils/time'

const props = defineProps<{
  comments: CommentDto[]
  loading: boolean
  submitting: boolean
  errorMessage: string
  newCommentText: string
  currentUserId: string | null
}>()

const emit = defineEmits<{
  'update:newCommentText': [value: string]
  submit: []
  remove: [commentId: string]
  'tap-user': [userId: string]
}>()

const trimmedLength = computed(() => props.newCommentText.trim().length)
const canSubmit = computed(
  () => !props.submitting && trimmedLength.value > 0 && trimmedLength.value <= MAX_COMMENT_LENGTH,
)

const onInput = (value: string) => {
  emit('update:newCommentText', value)
}

const onSubmit = () => {
  if (!canSubmit.value) return
  emit('submit')
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    onSubmit()
  }
}
</script>

<template>
  <section class="px-5 pt-2 pb-2">
    <div class="flex items-center gap-2 pb-3">
      <ion-icon :icon="chatbubbleOutline" class="text-sage text-base shrink-0" />
      <h2 class="text-cream text-sm font-semibold font-display m-0">
        Comments
        <span v-if="comments.length > 0" class="text-white/35 font-normal ml-1">{{ comments.length }}</span>
      </h2>
    </div>

    <div v-if="loading" class="flex justify-center py-6">
      <ion-spinner name="crescent" class="text-sage w-6 h-6" />
    </div>

    <div v-else-if="comments.length === 0" class="py-4">
      <p class="text-white/30 text-sm font-body m-0">Be the first to comment.</p>
    </div>

    <ul v-else class="list-none m-0 p-0 flex flex-col gap-3">
      <li
        v-for="c in comments"
        :key="c.id"
        class="flex items-start gap-3"
      >
        <button
          type="button"
          class="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center shrink-0 border-0 m-0 p-0 active:opacity-60 transition-opacity"
          :aria-label="`View profile of @${c.user.username}`"
          @click="$emit('tap-user', c.user.id)"
        >
          <span class="text-sage text-xs font-bold font-display uppercase">
            {{ c.user.username[0] }}
          </span>
        </button>

        <div class="min-w-0 flex-1">
          <div class="flex items-baseline gap-2 flex-wrap">
            <button
              type="button"
              class="bg-transparent border-0 p-0 m-0 text-cream text-sm font-medium font-body active:opacity-60 transition-opacity"
              @click="$emit('tap-user', c.user.id)"
            >
              @{{ c.user.username }}
            </button>
            <span class="text-white/30 text-[11px] font-body">{{ timeAgo(c.createdAt) }}</span>
          </div>
          <p class="text-cream/85 text-[14px] font-body leading-relaxed m-0 mt-0.5 whitespace-pre-wrap break-words">
            {{ c.body }}
          </p>
        </div>

        <button
          v-if="currentUserId && c.user.id === currentUserId"
          type="button"
          class="bg-transparent border-0 p-1 m-0 shrink-0 active:opacity-60 transition-opacity"
          aria-label="Delete comment"
          @click="$emit('remove', c.id)"
        >
          <ion-icon :icon="trashOutline" class="text-white/30 text-base" />
        </button>
      </li>
    </ul>

    <div v-if="currentUserId" class="mt-4 flex items-end gap-2 bg-white/[0.04] rounded-2xl px-3 py-2">
      <ion-textarea
        :model-value="newCommentText"
        placeholder="Add a comment..."
        :auto-grow="true"
        :rows="1"
        :maxlength="MAX_COMMENT_LENGTH"
        :disabled="submitting"
        class="flex-1 [--background:transparent] [--color:#F8F4EF] [--placeholder-color:rgba(255,255,255,0.25)] [--padding-start:0] [--padding-end:0] text-[14px] font-body"
        @ion-input="onInput(String($event.detail.value ?? ''))"
        @keydown="onKeydown"
      />
      <button
        type="button"
        class="bg-transparent border-0 p-2 m-0 shrink-0 transition-opacity"
        :class="canSubmit ? 'active:scale-95' : 'opacity-40'"
        :disabled="!canSubmit"
        aria-label="Post comment"
        @click="onSubmit"
      >
        <ion-spinner v-if="submitting" name="crescent" class="text-sage w-5 h-5" />
        <ion-icon v-else :icon="sendOutline" class="text-sage text-xl" />
      </button>
    </div>

    <p v-if="errorMessage" class="text-ember text-xs font-body m-0 mt-2">
      {{ errorMessage }}
    </p>
  </section>
</template>
