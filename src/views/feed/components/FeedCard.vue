<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { locationOutline } from 'ionicons/icons'
import { COMMUNITIES } from '@/constants'
import type { FeedItemDto } from '@/types'
import { timeAgo } from '@/utils/time'
import HeartButton from './HeartButton.vue'
import SaveButton from './SaveButton.vue'

const props = defineProps<{
  item: FeedItemDto
}>()

defineEmits<{
  tapImage: [imageUrl: string]
  toggleReaction: [findId: string]
  toggleSave: [findId: string]
  tapUser: [userId: string]
}>()

const communityMeta = props.item.community
  ? COMMUNITIES.find((c) => c.id === props.item.community)
  : null
</script>

<template>
  <article class="bg-white/[0.03] rounded-2xl overflow-hidden">
    <button class="w-full block border-0 p-0 m-0 bg-transparent leading-[0]" @click="$emit('tapImage', item.imageUrl)">
      <img
        :src="item.imageUrl"
        :alt="item.caption ?? 'A find'"
        class="w-full aspect-[4/5] object-cover block"
        loading="lazy"
      />
    </button>

    <div class="px-4 py-3 flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <button
          class="flex items-center gap-2 bg-transparent border-0 p-0 m-0"
          @click="$emit('tapUser', item.user.id)"
        >
          <div class="w-7 h-7 rounded-full bg-sage/20 flex items-center justify-center shrink-0">
            <span class="text-sage text-xs font-bold uppercase">{{ item.user.username[0] }}</span>
          </div>
          <span class="text-cream text-sm font-medium font-body">{{ item.user.username }}</span>
        </button>
        <span class="text-white/30 text-xs font-body">{{ timeAgo(item.createdAt) }}</span>
      </div>

      <p v-if="item.caption" class="text-white/70 text-sm font-body leading-relaxed">
        {{ item.caption }}
      </p>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3 flex-wrap">
          <div v-if="item.locationName" class="flex items-center gap-1">
            <ion-icon :icon="locationOutline" class="text-sage text-sm" />
            <span class="text-white/40 text-xs font-body">{{ item.locationName }}</span>
          </div>

          <span
            v-if="communityMeta"
            class="px-2 py-0.5 rounded-full text-[10px] font-medium font-body"
            :style="{ backgroundColor: communityMeta.color + '22', color: communityMeta.color }"
          >
            {{ communityMeta.label }}
          </span>
        </div>

        <div class="flex items-center gap-3">
          <HeartButton
            :reacted="item.hasReacted"
            :count="item.reactionCount"
            @toggle="$emit('toggleReaction', item.id)"
          />
          <SaveButton
            :saved="item.hasSaved"
            @toggle="$emit('toggleSave', item.id)"
          />
        </div>
      </div>
    </div>
  </article>
</template>
