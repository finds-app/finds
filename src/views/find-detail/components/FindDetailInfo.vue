<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { locationOutline, cameraOutline } from 'ionicons/icons'
import { COMMUNITIES } from '@/constants'
import type { FindDetailDto } from '@/types'
import { timeAgo } from '@/utils/time'
import { shortLocationName } from '@/utils/geocode'
import HeartButton from '@/views/feed/components/HeartButton.vue'
import SaveButton from '@/views/feed/components/SaveButton.vue'

const props = defineProps<{
  find: FindDetailDto
  showNoticedToo: boolean
}>()

defineEmits<{
  toggleReaction: []
  toggleSave: []
  'noticed-too': []
  tapUser: [userId: string]
  tapLocation: []
  tapCommunity: [communityId: string]
  tapTag: [tag: string]
  tapLikes: []
}>()

const communityMeta = props.find.community
  ? COMMUNITIES.find((c) => c.id === props.find.community)
  : null
</script>

<template>
  <div class="px-5 -mt-6 relative z-10 flex flex-col gap-0">

    <!-- 1. Actions: location left, heart/save/me-too right -->
    <div class="flex items-center justify-between gap-3 pb-4">
      <button
        v-if="find.locationName"
        class="flex items-center gap-1.5 bg-white/[0.05] rounded-full px-3 py-1.5 border-0 m-0 min-w-0 active:opacity-60 transition-opacity"
        :class="find.lat && find.lng ? 'cursor-pointer' : 'cursor-default'"
        @click="find.lat && find.lng ? $emit('tapLocation') : undefined"
      >
        <ion-icon :icon="locationOutline" class="text-sage text-sm shrink-0" />
        <span class="text-white/50 text-xs font-body truncate">{{ shortLocationName(find.locationName) }}</span>
      </button>
      <span v-else />

      <div class="flex items-center gap-4 shrink-0">
        <HeartButton
          :reacted="find.hasReacted"
          :count="find.reactionCount"
          @toggle="$emit('toggleReaction')"
          @tap-count="$emit('tapLikes')"
        />
        <SaveButton
          :saved="find.hasSaved"
          @toggle="$emit('toggleSave')"
        />
        <button
          v-if="showNoticedToo"
          type="button"
          class="flex items-center gap-1.5 bg-white/[0.06] rounded-full pl-2.5 pr-3 py-1.5 border-0 m-0 active:scale-[0.97] transition-all active:bg-sage/15"
          @click="$emit('noticed-too')"
        >
          <ion-icon :icon="cameraOutline" class="text-sage text-base shrink-0" />
          <span class="text-white/50 text-[11px] font-body font-medium">Me too</span>
        </button>
      </div>
    </div>

    <!-- 2. User row -->
    <div class="flex items-center justify-between pb-3">
      <button
        class="flex items-center gap-3 bg-transparent border-0 p-0 m-0"
        @click="$emit('tapUser', find.user.id)"
      >
        <div class="w-9 h-9 rounded-full bg-sage/20 flex items-center justify-center shrink-0">
          <span class="text-sage text-xs font-bold font-display uppercase">{{ find.user.username[0] }}</span>
        </div>
        <div class="flex flex-col items-start">
          <span class="text-cream text-sm font-medium font-body leading-tight">{{ find.user.displayName ?? find.user.username }}</span>
          <span class="text-white/30 text-[11px] font-body">@{{ find.user.username }}</span>
        </div>
      </button>
      <span class="text-white/20 text-[11px] font-body">{{ timeAgo(find.createdAt) }}</span>
    </div>

    <!-- 3. Caption -->
    <p v-if="find.caption" class="text-cream/85 text-[15px] font-body leading-relaxed m-0 pb-3">
      {{ find.caption }}
    </p>

    <!-- 4. Community + tags -->
    <div
      v-if="communityMeta || find.tags.length > 0"
      class="flex items-center gap-2 flex-wrap pb-1"
    >
      <button
        v-if="communityMeta"
        class="px-3 py-1.5 rounded-full text-xs font-medium font-body border-0 m-0 active:opacity-60 transition-opacity"
        :style="{ backgroundColor: communityMeta.color + '18', color: communityMeta.color }"
        @click="$emit('tapCommunity', find.community!)"
      >
        {{ communityMeta.label }}
      </button>

      <button
        v-for="tag in find.tags"
        :key="tag"
        type="button"
        class="px-3 py-1.5 rounded-full text-xs font-medium font-body border-0 m-0 bg-white/[0.06] text-white/40 active:opacity-60 transition-opacity"
        @click="$emit('tapTag', tag)"
      >
        #{{ tag }}
      </button>
    </div>
  </div>
</template>
