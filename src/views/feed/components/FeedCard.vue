<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { locationOutline, linkOutline, cameraOutline } from 'ionicons/icons'
import { COMMUNITIES, BADGE_DISPLAY_ORDER, getBadgeDefinition } from '@/constants'
import type { FeedItemDto } from '@/types'
import { timeAgo } from '@/utils/time'
import { shortLocationName } from '@/utils/geocode'
import HeartButton from './HeartButton.vue'
import SaveButton from './SaveButton.vue'

const props = defineProps<{
  item: FeedItemDto
}>()

const emit = defineEmits<{
  tapImage: [imageUrl: string]
  toggleReaction: [findId: string]
  toggleSave: [findId: string]
  noticedToo: [findId: string]
  tapUser: [userId: string]
  tapLocation: [lat: number, lng: number, locationName: string]
  tapCommunity: [communityId: string]
  tapTag: [tag: string]
}>()

const communityMeta = props.item.community
  ? COMMUNITIES.find((c) => c.id === props.item.community)
  : null

const sortedBadges = BADGE_DISPLAY_ORDER.filter((id) => (props.item.badges ?? []).includes(id))

const onLocationTap = (e: Event) => {
  if (!props.item.lat || !props.item.lng) return
  ;(e.currentTarget as HTMLElement).blur()
  emit('tapLocation', props.item.lat, props.item.lng, props.item.locationName!)
}
</script>

<template>
  <article class="bg-white/[0.03] rounded-2xl overflow-hidden">
    <!-- Image -->
    <div class="relative w-full">
      <button class="w-full block border-0 p-0 m-0 bg-transparent leading-[0]" @click="$emit('tapImage', item.imageUrl)">
        <img
          :src="item.imageUrl"
          :alt="item.caption ?? 'A find'"
          class="w-full aspect-[4/5] object-cover block"
          loading="lazy"
        />
      </button>
      <div
        v-if="sortedBadges.length || item.chainCount > 0"
        class="pointer-events-none absolute left-2 right-2 top-2 flex flex-wrap justify-end gap-1"
      >
        <span
          v-if="item.chainCount > 0"
          class="rounded-full px-2 py-0.5 text-[10px] font-medium font-body shadow-sm backdrop-blur-sm flex items-center gap-0.5 bg-white/10 text-white/55 border border-white/15"
        >
          <ion-icon :icon="linkOutline" class="text-[11px]" />
          {{ item.chainCount }}
        </span>
        <span
          v-for="badgeId in sortedBadges"
          :key="badgeId"
          class="rounded-full px-2 py-0.5 text-[10px] font-medium font-body shadow-sm backdrop-blur-sm"
          :style="{
            backgroundColor: (getBadgeDefinition(badgeId)?.color ?? '#52B788') + '22',
            color: getBadgeDefinition(badgeId)?.color ?? '#52B788',
            border: `1px solid ${(getBadgeDefinition(badgeId)?.color ?? '#52B788')}55`,
          }"
        >
          {{ getBadgeDefinition(badgeId)?.label }}
        </span>
      </div>
    </div>

    <div class="px-4 pt-3 pb-3.5 flex flex-col gap-0">
      <!-- Row 1: User + time -->
      <div class="flex items-center justify-between pb-2">
        <button
          class="flex items-center gap-2 bg-transparent border-0 p-0 m-0"
          @click="$emit('tapUser', item.user.id)"
        >
          <div class="w-7 h-7 rounded-full bg-sage/20 flex items-center justify-center shrink-0">
            <span class="text-sage text-xs font-bold uppercase">{{ item.user.username[0] }}</span>
          </div>
          <span class="text-cream text-sm font-medium font-body">{{ item.user.username }}</span>
        </button>
        <span class="text-white/25 text-xs font-body">{{ timeAgo(item.createdAt) }}</span>
      </div>

      <!-- Row 2: Caption -->
      <p v-if="item.caption" class="text-white/70 text-sm font-body leading-relaxed m-0 pb-2.5">
        {{ item.caption }}
      </p>

      <!-- Row 3: Actions — location left, reactions right -->
      <div class="flex items-center justify-between gap-2">
        <button
          v-if="item.locationName"
          class="flex items-center gap-1 bg-white/[0.05] rounded-full px-2.5 py-1 border-0 m-0 min-w-0 transition-opacity"
          :class="item.lat && item.lng ? 'active:opacity-60' : 'cursor-default'"
          @click="onLocationTap"
        >
          <ion-icon :icon="locationOutline" class="text-sage text-xs shrink-0" />
          <span class="text-white/50 text-[11px] font-body truncate">{{ shortLocationName(item.locationName) }}</span>
        </button>
        <span v-else />

        <div class="flex items-center gap-3 shrink-0">
          <HeartButton
            :reacted="item.hasReacted"
            :count="item.reactionCount"
            @toggle="$emit('toggleReaction', item.id)"
          />
          <SaveButton
            :saved="item.hasSaved"
            @toggle="$emit('toggleSave', item.id)"
          />
          <button
            type="button"
            title="I noticed this too"
            class="bg-transparent border-0 p-0 m-0 active:scale-95 transition-transform text-white/30"
            @click="$emit('noticedToo', item.id)"
          >
            <ion-icon :icon="cameraOutline" class="w-[22px] h-[22px]" />
          </button>
        </div>
      </div>

      <!-- Row 4: Community + tags -->
      <div
        v-if="communityMeta || item.tags.length > 0"
        class="flex items-center gap-1.5 flex-wrap pt-2.5"
      >
        <button
          v-if="communityMeta"
          class="px-2 py-0.5 rounded-full text-[10px] font-medium font-body border-0 m-0 active:opacity-60 transition-opacity"
          :style="{ backgroundColor: communityMeta.color + '22', color: communityMeta.color }"
          @click="$emit('tapCommunity', item.community!)"
        >
          {{ communityMeta.label }}
        </button>

        <button
          v-for="tag in item.tags"
          :key="tag"
          type="button"
          class="px-2 py-0.5 rounded-full text-[10px] font-medium font-body border-0 m-0 bg-white/[0.06] text-white/40 active:opacity-60 transition-opacity"
          @click="$emit('tapTag', tag)"
        >
          #{{ tag }}
        </button>
      </div>
    </div>
  </article>
</template>
