<script setup lang="ts">
import { watch, computed, onMounted, onUnmounted } from 'vue'
import { IonIcon, IonSpinner } from '@ionic/vue'
import {
  searchOutline,
  closeOutline,
  pricetagOutline,
  locationOutline,
} from 'ionicons/icons'
import { useRouter } from 'vue-router'
import { buildTagRoute, pushUserProfile } from '@/constants'
import { useAuthStore } from '@/stores/auth'
import { useSearch, type PlaceSearchResult } from '../useSearch'

const props = defineProps<{
  initialQuery?: string | null
}>()

const emit = defineEmits<{
  'select-place': [lng: number, lat: number, zoom?: number]
}>()

const router = useRouter()
const authStore = useAuthStore()

const {
  query,
  users,
  tags,
  places,
  loading,
  error,
  dropdownOpen,
  openDropdown,
  closeDropdown,
  clear,
  dismiss,
  dismissAfterPlace,
} = useSearch()

watch(
  () => props.initialQuery,
  (val) => {
    if (val) {
      query.value = val
      openDropdown()
    }
  },
  { immediate: true },
)

const trimmedLen = computed(() => query.value.trim().length)

const showBackdrop = computed(() => dropdownOpen.value && trimmedLen.value > 0)

const showDropdownBody = computed(() => showBackdrop.value)

const onInput = (e: Event) => {
  query.value = (e.target as HTMLInputElement).value
  if (trimmedLen.value > 0) openDropdown()
}

const onFocus = () => {
  if (trimmedLen.value > 0) openDropdown()
}

const onBackdropPointerDown = (e: Event) => {
  if ((e.target as HTMLElement).dataset.backdrop === '1') {
    closeDropdown()
  }
}

const goUser = (userId: string) => {
  pushUserProfile(router, userId, authStore.user?.id)
  dismiss()
}

const goTag = (tag: string) => {
  router.push(buildTagRoute(tag))
  dismiss()
}

const goPlace = (p: PlaceSearchResult) => {
  emit('select-place', p.center[0], p.center[1], 13)
  dismissAfterPlace(p.name)
}

const onClear = () => {
  clear()
}

const showHint = computed(() => trimmedLen.value > 0 && trimmedLen.value < 2)
const showResultBody = computed(() => trimmedLen.value >= 2 && !loading.value && !error.value)
const showEmpty = computed(
  () =>
    showResultBody.value &&
    users.value.length === 0 &&
    tags.value.length === 0 &&
    places.value.length === 0,
)

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeDropdown()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="relative z-[100] border-b border-white/[0.06] px-4 pb-2 pt-2">
    <!-- Backdrop: below dropdown, above page content -->
    <Transition name="fade">
      <div
        v-if="showBackdrop"
        data-backdrop="1"
        class="fixed inset-0 z-[90] bg-black/45"
        aria-hidden="true"
        @pointerdown="onBackdropPointerDown"
      />
    </Transition>

    <div
      class="relative z-[100] flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 transition-colors"
      :class="showBackdrop ? 'border-sage/30 bg-white/[0.08]' : 'border-white/[0.08] bg-white/[0.04]'"
    >
      <ion-icon :icon="searchOutline" class="text-lg shrink-0 text-sage/70" />
      <input
        :value="query"
        type="search"
        enterkeyhint="search"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        placeholder="People, tags, or places…"
        class="min-w-0 flex-1 bg-transparent font-body text-sm text-cream outline-none border-0 placeholder:text-white/25"
        @input="onInput"
        @focus="onFocus"
      />
      <ion-spinner
        v-if="trimmedLen >= 2 && loading"
        name="crescent"
        class="h-5 w-5 shrink-0 text-sage"
      />
      <button
        v-if="query"
        type="button"
        class="m-0 shrink-0 rounded-full border-0 bg-white/[0.06] p-1.5 text-white/40 transition-opacity active:opacity-70"
        aria-label="Clear search"
        @click="onClear"
      >
        <ion-icon :icon="closeOutline" class="text-lg" />
      </button>
    </div>

    <!-- Floating dropdown -->
    <Transition name="dropdown">
      <div
        v-if="showDropdownBody"
        class="absolute left-4 right-4 top-full z-[100] mt-1.5 max-h-[min(62vh,30rem)] overflow-y-auto rounded-2xl border border-white/[0.1] bg-[#0A1712] shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
      >
        <p v-if="showHint" class="m-0 px-4 py-5 text-center font-body text-xs leading-relaxed text-white/35">
          Type at least 2 characters to search people, tags, and places.
        </p>

        <p v-else-if="error" class="m-0 px-4 py-5 text-center font-body text-xs text-ember/90">
          {{ error }}
        </p>

        <div v-else-if="trimmedLen >= 2 && loading" class="flex justify-center py-10">
          <ion-spinner name="crescent" class="h-6 w-6 text-sage" />
        </div>

        <template v-else-if="showResultBody">
          <p v-if="showEmpty" class="m-0 px-4 py-10 text-center font-body text-sm text-white/30">
            No results for that search.
          </p>

          <template v-else>
            <section v-if="users.length > 0" class="border-b border-white/[0.06] pb-1 pt-1">
              <p class="m-0 px-4 py-2 font-body text-[10px] font-medium uppercase tracking-wider text-white/30">
                People
              </p>
              <button
                v-for="u in users"
                :key="u.id"
                type="button"
                class="flex w-full items-center gap-3 border-0 bg-transparent px-4 py-3 text-left transition-opacity active:opacity-70"
                @mousedown.prevent="goUser(u.id)"
              >
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage/20">
                  <span class="font-body text-sm font-bold uppercase text-sage">{{ u.username[0] }}</span>
                </div>
                <div class="min-w-0 flex-1">
                  <span class="block truncate font-body text-sm font-medium text-cream">{{ u.displayName || u.username }}</span>
                  <span class="block truncate font-body text-xs text-white/35">@{{ u.username }}</span>
                </div>
              </button>
            </section>

            <section v-if="tags.length > 0" class="border-b border-white/[0.06] pb-1 pt-1">
              <p class="m-0 px-4 py-2 font-body text-[10px] font-medium uppercase tracking-wider text-white/30">
                Tags
              </p>
              <button
                v-for="t in tags"
                :key="t.tag"
                type="button"
                class="flex w-full items-center justify-between gap-3 border-0 bg-transparent px-4 py-3 text-left transition-opacity active:opacity-70"
                @mousedown.prevent="goTag(t.tag)"
              >
                <span class="flex min-w-0 items-center gap-2">
                  <ion-icon :icon="pricetagOutline" class="shrink-0 text-base text-sage/60" />
                  <span class="truncate font-body text-sm font-medium text-cream">#{{ t.tag }}</span>
                </span>
                <span class="shrink-0 font-body text-[11px] tabular-nums text-white/30">{{ t.findCount }} finds</span>
              </button>
            </section>

            <section v-if="places.length > 0" class="pb-1 pt-1">
              <p class="m-0 px-4 py-2 font-body text-[10px] font-medium uppercase tracking-wider text-white/30">
                Places
              </p>
              <button
                v-for="p in places"
                :key="p.id"
                type="button"
                class="flex w-full items-center gap-3 border-0 bg-transparent px-4 py-3 text-left transition-opacity active:opacity-70"
                @mousedown.prevent="goPlace(p)"
              >
                <ion-icon :icon="locationOutline" class="mt-0.5 shrink-0 text-base text-sage/60" />
                <div class="min-w-0 flex-1">
                  <span class="block truncate font-body text-sm font-medium text-cream">{{ p.name }}</span>
                  <span v-if="p.region" class="block truncate font-body text-[11px] leading-tight text-white/35">{{ p.region }}</span>
                </div>
              </button>
            </section>
          </template>
        </template>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
