<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import { useOnboarding } from './useOnboarding'
import DisplayNameField from './components/DisplayNameField.vue'
import OnboardingError from './components/OnboardingError.vue'
import OnboardingIntro from './components/OnboardingIntro.vue'
import OnboardingSubmitButton from './components/OnboardingSubmitButton.vue'
import UsernameField from './components/UsernameField.vue'

const {
  username,
  displayName,
  usernameError,
  canSubmit,
  loading,
  error,
  updateUsername,
  updateDisplayName,
  save,
} = useOnboarding()
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true" class="[--background:#0E1F1A]">
      <div class="flex flex-col min-h-screen px-8 pt-16 pb-8 max-w-sm mx-auto">
        <OnboardingIntro />

        <div class="flex flex-col gap-5 mb-2">
          <UsernameField
            :username="username"
            :username-error="usernameError"
            :loading="loading"
            @update:username="updateUsername"
          />
          <DisplayNameField
            :display-name="displayName"
            :loading="loading"
            @update:display-name="updateDisplayName"
          />
        </div>

        <OnboardingError :message="error" />

        <OnboardingSubmitButton :loading="loading" :can-submit="canSubmit" @submit="save" />

      </div>
    </ion-content>
  </ion-page>
</template>
