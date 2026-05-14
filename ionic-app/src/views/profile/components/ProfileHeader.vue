<script setup lang="ts">
import { IonIcon, IonSpinner } from '@ionic/vue'
import { createOutline } from 'ionicons/icons'
import { nextTick, ref, watch } from 'vue'
import type { UserDto } from '@/types'

const props = defineProps<{
  profile: UserDto
  isOwnProfile: boolean
  editingBio: boolean
  bioDraft: string
  savingBio: boolean
}>()

defineEmits<{
  startEditBio: []
  cancelEditBio: []
  saveBio: []
  'update:bioDraft': [value: string]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

watch(
  () => props.editingBio,
  async (editing) => {
    if (editing) {
      await nextTick()
      textareaRef.value?.focus()
    }
  }
)
</script>

<template>
  <div class="flex flex-col items-center gap-3 px-6 pt-8 pb-2">
    <div class="w-20 h-20 rounded-full bg-sage/20 flex items-center justify-center">
      <span class="text-sage text-2xl font-bold font-display uppercase">
        {{ profile.username[0] }}
      </span>
    </div>

    <div class="text-center">
      <h1 v-if="profile.displayName" class="text-cream text-xl font-bold font-display m-0">
        {{ profile.displayName }}
      </h1>
      <p class="text-white/40 text-sm font-body m-0 mt-0.5">@{{ profile.username }}</p>
    </div>

    <div v-if="editingBio" class="w-full mt-1">
      <textarea
        ref="textareaRef"
        :value="bioDraft"
        placeholder="Write something about yourself..."
        maxlength="150"
        rows="3"
        class="w-full bg-white/[0.05] text-cream text-sm font-body rounded-xl px-4 py-3 border border-white/10 outline-none resize-none placeholder:text-white/20 focus:border-sage/40 transition-colors"
        @input="$emit('update:bioDraft', ($event.target as HTMLTextAreaElement).value)"
      />
      <div class="flex items-center justify-end gap-2 mt-2">
        <button
          class="px-4 py-1.5 text-white/40 text-sm font-body bg-transparent border-0"
          @click="$emit('cancelEditBio')"
        >
          Cancel
        </button>
        <button
          class="px-4 py-1.5 text-forest text-sm font-body font-medium bg-sage rounded-lg border-0 disabled:opacity-50"
          :disabled="savingBio"
          @click="$emit('saveBio')"
        >
          <ion-spinner v-if="savingBio" name="crescent" class="w-4 h-4" />
          <span v-else>Save</span>
        </button>
      </div>
    </div>

    <div v-else class="flex items-center gap-1.5 mt-1">
      <p v-if="profile.bio" class="text-white/60 text-sm font-body text-center m-0 leading-relaxed">
        {{ profile.bio }}
      </p>
      <p v-else-if="isOwnProfile" class="text-white/20 text-sm font-body text-center m-0 italic">
        Add a bio...
      </p>
      <button
        v-if="isOwnProfile"
        class="bg-transparent border-0 p-1 m-0 shrink-0"
        @click="$emit('startEditBio')"
      >
        <ion-icon :icon="createOutline" class="text-white/30 text-base" />
      </button>
    </div>
  </div>
</template>
