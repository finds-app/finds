<script setup lang="ts">
import { computed, watch } from 'vue'
import { IonSpinner } from '@ionic/vue'

type ConfirmColor = 'ember' | 'sage'

const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
    confirmColor?: ConfirmColor
    loading?: boolean
  }>(),
  {
    message: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    confirmColor: 'ember',
    loading: false,
  },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

// Static class maps so Tailwind keeps these classes in the build
const confirmClasses = computed(() => {
  if (props.confirmColor === 'sage') {
    return 'text-sage bg-sage/15 border border-sage/25 active:bg-sage/20'
  }
  return 'text-ember bg-ember/15 border border-ember/25 active:bg-ember/20'
})

const onCancel = () => {
  if (props.loading) return
  emit('cancel')
}

const onConfirm = () => {
  if (props.loading) return
  emit('confirm')
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) document.body.classList.add('confirm-sheet-open')
    else document.body.classList.remove('confirm-sheet-open')
  },
  { immediate: true },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="confirm-backdrop">
      <div
        v-if="open"
        class="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm"
        role="presentation"
        @click="onCancel"
      />
    </Transition>

    <Transition name="confirm-sheet">
      <div
        v-if="open"
        class="fixed inset-x-0 bottom-0 z-[10001]"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <div
          class="bg-[#0E1F1A]/95 backdrop-blur-xl rounded-t-3xl border-t border-white/[0.06] pb-[calc(env(safe-area-inset-bottom,0px)+16px)] pt-3"
        >
          <div class="flex justify-center pb-3">
            <div class="h-1 w-10 rounded-full bg-white/15" />
          </div>

          <div class="px-6 pb-5 text-center">
            <h2 class="font-display text-xl font-semibold text-cream m-0">{{ title }}</h2>
            <p
              v-if="message"
              class="mt-2 font-body text-sm leading-relaxed text-white/55 m-0"
            >
              {{ message }}
            </p>
          </div>

          <div class="px-5 pb-2 flex flex-col gap-2.5">
            <button
              type="button"
              class="rounded-2xl py-3.5 font-body text-sm font-medium border-0 m-0 active:scale-[0.99] transition-all flex items-center justify-center"
              :class="confirmClasses"
              :disabled="loading"
              @click="onConfirm"
            >
              <ion-spinner v-if="loading" name="crescent" class="w-5 h-5" />
              <span v-else>{{ confirmLabel }}</span>
            </button>
            <button
              type="button"
              class="rounded-2xl py-3.5 font-body text-sm text-white/55 bg-white/[0.04] border-0 m-0 active:bg-white/[0.07] transition-colors"
              :disabled="loading"
              @click="onCancel"
            >
              {{ cancelLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.confirm-backdrop-enter-active,
.confirm-backdrop-leave-active {
  transition: opacity 220ms ease;
}
.confirm-backdrop-enter-from,
.confirm-backdrop-leave-to {
  opacity: 0;
}

.confirm-sheet-enter-active,
.confirm-sheet-leave-active {
  transition: transform 280ms cubic-bezier(0.32, 0.72, 0, 1);
}
.confirm-sheet-enter-from,
.confirm-sheet-leave-to {
  transform: translateY(100%);
}
</style>
