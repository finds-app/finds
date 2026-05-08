<template>
  <ion-page>
    <ion-content :fullscreen="true" class="[--background:#0E1F1A]">
      <div class="flex flex-col min-h-screen px-8 pt-16 pb-8 max-w-sm mx-auto relative">

        <button
          class="absolute top-12 left-6 w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.07] text-cream border-0"
          @click="router.back()"
        >
          <ion-icon :icon="arrowBack" class="text-lg" />
        </button>

        <!-- Sent state -->
        <template v-if="sent">
          <span class="font-display text-5xl text-sage mt-20 mb-6">✦</span>
          <h1 class="font-display font-bold text-cream text-3xl leading-tight mb-3">Check your email</h1>
          <p class="font-body font-light text-white/50 text-sm leading-relaxed mb-1">
            We sent a magic link to<br />
            <strong class="text-cream font-medium">{{ email }}</strong>
          </p>
          <p class="font-body font-light text-white/35 text-sm leading-relaxed mb-8">
            Tap the link in the email to sign in. You can close this screen.
          </p>
          <button
            class="self-start border border-white/15 rounded-xl text-white/50 text-sm px-5 py-2.5 bg-transparent disabled:opacity-40"
            :disabled="resendCooldown > 0"
            @click="submit"
          >
            {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend link' }}
          </button>
        </template>

        <!-- Entry state -->
        <template v-else>
          <h1 class="font-display font-bold text-cream text-3xl leading-tight mt-20 mb-3">Join finds</h1>
          <p class="font-body font-light text-white/50 text-sm leading-relaxed mb-6">
            Enter your email and we'll send you a magic link — no password needed.
          </p>

          <div class="rounded-xl border border-white/10 overflow-hidden mb-1">
            <ion-input
              v-model="email"
              type="email"
              placeholder="your@email.com"
              inputmode="email"
              autocomplete="email"
              :disabled="loading"
              class="[--background:rgba(255,255,255,0.06)] [--color:#F8F4EF] [--placeholder-color:rgba(255,255,255,0.3)] [--padding-start:16px] [--padding-end:16px] [--padding-top:14px] [--padding-bottom:14px]"
              @keyup.enter="submit"
            />
          </div>

          <p v-if="errorMsg" class="text-ember text-xs mt-1 mb-3">{{ errorMsg }}</p>

          <ion-button
            expand="block"
            :disabled="loading || !email"
            class="[--background:#52B788] [--background-activated:#48a077] [--color:#1A3C34] [--border-radius:14px] [--padding-top:18px] [--padding-bottom:18px] font-medium text-base mt-4"
            @click="submit"
          >
            <ion-spinner v-if="loading" name="crescent" />
            <span v-else>Send magic link</span>
          </ion-button>
        </template>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonPage, IonContent, IonButton, IonInput, IonIcon, IonSpinner } from '@ionic/vue'
import { arrowBack } from 'ionicons/icons'
import { Capacitor } from '@capacitor/core'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const redirectTo = Capacitor.isNativePlatform()
  ? 'io.finds.app://login-callback'
  : window.location.origin

const router = useRouter()
const email = ref('')
const loading = ref(false)
const sent = ref(false)
const errorMsg = ref('')
const resendCooldown = ref(0)

async function submit() {
  if (!email.value || loading.value) return
  errorMsg.value = ''
  loading.value = true

  const { error } = await supabase.auth.signInWithOtp({
    email: email.value.trim(),
    options: { emailRedirectTo: redirectTo },
  })

  loading.value = false

  if (error) {
    errorMsg.value = error.message
    return
  }

  sent.value = true
  startResendCooldown()
}

function startResendCooldown() {
  resendCooldown.value = 60
  const interval = setInterval(() => {
    resendCooldown.value -= 1
    if (resendCooldown.value <= 0) clearInterval(interval)
  }, 1000)
}
</script>
