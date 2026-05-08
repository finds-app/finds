<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useAuth } from './useAuth'
import AuthBackButton from './components/AuthBackButton.vue'
import MagicLinkForm from './components/MagicLinkForm.vue'
import MagicLinkSent from './components/MagicLinkSent.vue'

const router = useRouter()
const { email, sent, resendCooldown, canSubmit, loading, error, sendMagicLink } = useAuth()
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true" class="[--background:#0E1F1A]">
      <div class="flex flex-col min-h-screen px-8 pt-16 pb-8 max-w-sm mx-auto relative">
        <AuthBackButton @back="router.back()" />

        <template v-if="sent">
          <MagicLinkSent
            :email="email"
            :resend-cooldown="resendCooldown"
            @resend="sendMagicLink"
          />
        </template>

        <template v-else>
          <MagicLinkForm
            v-model:email="email"
            :loading="loading"
            :error="error"
            :can-submit="canSubmit"
            @submit="sendMagicLink"
          />
        </template>

      </div>
    </ion-content>
  </ion-page>
</template>
