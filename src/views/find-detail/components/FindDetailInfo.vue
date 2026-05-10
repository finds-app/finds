<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { locationOutline } from 'ionicons/icons'
import { COMMUNITIES } from '@/constants'
import type { FindDetailDto } from '@/types'
import { timeAgo } from '@/utils/time'
import { shortLocationName } from '@/utils/geocode'
import HeartButton from '@/views/feed/components/HeartButton.vue'
import SaveButton from '@/views/feed/components/SaveButton.vue'

const props = defineProps<{
  find: FindDetailDto
}>()

defineEmits<{
  toggleReaction: []
  toggleSave: []
  tapUser: [userId: string]
  tapLocation: []
  tapCommunity: [communityId: string]
}>()

const communityMeta = props.find.community
  ? COMMUNITIES.find((c) => c.id === props.find.community)
  : null
</script>

<template>
  <div class="px-5 -mt-6 relative z-10 flex flex-col gap-4">
    <!-- User row -->
    <div class="flex items-center justify-between">
      <button
        class="flex items-center gap-3 bg-transparent border-0 p-0 m-0"
        @click="$emit('tapUser', find.user.id)"
      >
        <div class="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center shrink-0">
          <span class="text-sage text-sm font-bold font-display uppercase">{{ find.user.username[0] }}</span>
        </div>
        <div class="flex flex-col items-start">
          <span class="text-cream text-sm font-medium font-body">{{ find.user.displayName ?? find.user.username }}</span>
          <span class="text-white/35 text-xs font-body">@{{ find.user.username }}</span>
        </div>
      </button>
      <span class="text-white/25 text-xs font-body">{{ timeAgo(find.createdAt) }}</span>
    </div>

    <!-- Caption -->
    <p v-if="find.caption" class="text-cream/90 text-[15px] font-body leading-relaxed m-0">
      {{ find.caption }}
    </p>

    <!-- Actions row -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <HeartButton
          :reacted="find.hasReacted"
          :count="find.reactionCount"
          @toggle="$emit('toggleReaction')"
        />
        <SaveButton
          :saved="find.hasSaved"
          @toggle="$emit('toggleSave')"
        />
      </div>
    </div>

    <!-- Location + Community -->
    <div class="flex items-center gap-3 flex-wrap">
      <button
        v-if="find.locationName"
        class="flex items-center gap-1.5 bg-white/[0.05] rounded-full px-3 py-1.5 border-0 m-0 active:opacity-60 transition-opacity"
        :class="find.lat && find.lng ? 'cursor-pointer' : 'cursor-default'"
        @click="find.lat && find.lng ? $emit('tapLocation') : undefined"
      >
        <ion-icon :icon="locationOutline" class="text-sage text-sm" />
        <span class="text-white/50 text-xs font-body">{{ shortLocationName(find.locationName) }}</span>
      </button>

      <button
        v-if="communityMeta"
        class="px-3 py-1.5 rounded-full text-xs font-medium font-body border-0 m-0 active:opacity-60 transition-opacity"
        :style="{ backgroundColor: communityMeta.color + '18', color: communityMeta.color }"
        @click="$emit('tapCommunity', find.community!)"
      >
        {{ communityMeta.label }}
      </button>
    </div>
  </div>
</template>
