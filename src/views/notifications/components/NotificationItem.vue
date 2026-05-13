<script setup lang="ts">
import { computed } from 'vue'
import type { NotificationDto } from '@/types'
import { timeAgo } from '@/utils/time'

const props = defineProps<{
  notification: NotificationDto
}>()

const emit = defineEmits<{
  'tap-find': [findId: string]
  'tap-user': [userId: string]
}>()

const message = computed(() => {
  switch (props.notification.type) {
    case 'reaction':
      return 'hearted your find'
    case 'follow':
      return 'started following you'
    case 'chain':
      return 'chained a find to yours'
    default:
      return ''
  }
})

const displayName = computed(() => props.notification.actor.username || 'Someone')

const onTapRow = () => {
  if (props.notification.findId) emit('tap-find', props.notification.findId)
  else emit('tap-user', props.notification.actorId)
}
</script>

<template>
  <li class="border-b border-white/[0.06]" :class="!notification.read ? 'bg-sage/[0.04]' : ''">
    <button
      type="button"
      class="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-0 text-left active:bg-white/[0.04]"
      @click="onTapRow"
    >
      <div class="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center shrink-0">
        <span class="text-sage text-sm font-bold font-display uppercase">
          {{ displayName[0] }}
        </span>
      </div>

      <div class="min-w-0 flex-1">
        <p class="m-0 text-sm font-body leading-snug">
          <span class="text-cream font-semibold">@{{ displayName }}</span>
          <span class="text-white/60 ml-1"> {{ message }}</span>
        </p>
        <span class="text-white/35 text-xs font-body block mt-0.5">
          {{ timeAgo(notification.createdAt) }}
        </span>
      </div>

      <div
        v-if="notification.find"
        class="w-12 h-12 rounded-lg overflow-hidden bg-white/[0.03] shrink-0"
      >
        <img
          :src="notification.find.imageUrl"
          alt=""
          class="w-full h-full object-cover block"
          loading="lazy"
        />
      </div>

      <span
        v-if="!notification.read"
        class="w-2 h-2 rounded-full bg-sage shrink-0"
        aria-label="Unread"
      />
    </button>
  </li>
</template>
