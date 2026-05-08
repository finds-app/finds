<template>
  <ion-page>
    <ion-content :fullscreen="true" class="[--background:#0E1F1A]">
      <div class="flex flex-col min-h-screen px-8 pt-16 pb-8 max-w-sm mx-auto">

        <span class="font-display font-bold italic text-sage text-2xl mb-10">finds</span>

        <h1 class="font-display font-bold text-cream text-4xl leading-tight mb-2">You're in.</h1>
        <p class="font-body font-light text-white/50 text-sm leading-relaxed mb-8">
          Last step — pick a username so the community can find you.
        </p>

        <div class="flex flex-col gap-5 mb-2">

          <!-- Username -->
          <div class="flex flex-col gap-1.5">
            <label class="text-white/45 text-xs font-medium uppercase tracking-widest">Username</label>
            <div class="flex items-center bg-white/[0.06] border border-white/10 rounded-xl overflow-hidden">
              <span class="pl-4 text-sage font-medium text-base shrink-0">@</span>
              <ion-input
                v-model="username"
                type="text"
                placeholder="yourcuriouseye"
                autocomplete="username"
                autocorrect="off"
                autocapitalize="none"
                :disabled="loading"
                class="[--background:transparent] [--color:#F8F4EF] [--placeholder-color:rgba(255,255,255,0.25)] [--padding-start:6px] [--padding-end:14px] [--padding-top:14px] [--padding-bottom:14px]"
                @ion-input="onUsernameInput"
              />
            </div>
            <p v-if="usernameError" class="text-ember text-xs">{{ usernameError }}</p>
            <p v-else-if="username && !usernameError" class="text-white/30 text-xs">
              Lowercase letters, numbers, and underscores only.
            </p>
          </div>

          <!-- Display name -->
          <div class="flex flex-col gap-1.5">
            <label class="text-white/45 text-xs font-medium uppercase tracking-widest">Display name</label>
            <div class="rounded-xl border border-white/10 overflow-hidden">
              <ion-input
                v-model="displayName"
                type="text"
                placeholder="Your name"
                autocomplete="name"
                :disabled="loading"
                class="[--background:rgba(255,255,255,0.06)] [--color:#F8F4EF] [--placeholder-color:rgba(255,255,255,0.25)] [--padding-start:16px] [--padding-end:16px] [--padding-top:14px] [--padding-bottom:14px]"
              />
            </div>
          </div>

        </div>

        <p v-if="submitError" class="text-ember text-sm mt-2">{{ submitError }}</p>

        <ion-button
          expand="block"
          :disabled="loading || !canSubmit"
          class="[--background:#52B788] [--background-activated:#48a077] [--color:#1A3C34] [--border-radius:14px] [--padding-top:18px] [--padding-bottom:18px] font-medium text-base mt-6"
          @click="save"
        >
          <ion-spinner v-if="loading" name="crescent" />
          <span v-else>Let's go</span>
        </ion-button>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IonPage, IonContent, IonButton, IonInput, IonSpinner } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const displayName = ref('')
const loading = ref(false)
const usernameError = ref('')
const submitError = ref('')

const usernameRegex = /^[a-z0-9_]{3,20}$/

const canSubmit = computed(() =>
  username.value.length >= 3 &&
  !usernameError.value &&
  displayName.value.trim().length >= 1
)

function onUsernameInput() {
  const val = username.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
  username.value = val
  if (val.length > 0 && !usernameRegex.test(val)) {
    usernameError.value = val.length < 3 ? 'At least 3 characters' : 'Letters, numbers, and underscores only'
  } else {
    usernameError.value = ''
  }
}

async function save() {
  if (!canSubmit.value || loading.value) return
  submitError.value = ''
  loading.value = true

  const { error } = await authStore.createProfile(username.value, displayName.value)

  loading.value = false

  if (error) {
    if (error.message.includes('unique') || error.message.includes('duplicate')) {
      usernameError.value = 'That username is taken'
    } else {
      submitError.value = error.message
    }
    return
  }

  router.replace('/tabs/tab1')
}
</script>
