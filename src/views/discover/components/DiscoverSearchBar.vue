<script setup lang="ts">
import { ref, watch } from 'vue'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

const props = defineProps<{
  initialQuery?: string | null
}>()

const emit = defineEmits<{
  'fly-to': [lng: number, lat: number]
}>()

interface SearchResult {
  id: string
  center: [number, number]
  name: string
  region: string
}

const inputRef = ref<HTMLInputElement | null>(null)
const query = ref('')

// Pre-fill when coming from feed/detail location tap
watch(
  () => props.initialQuery,
  (val) => { if (val) query.value = val },
  { immediate: true },
)
const focused = ref(false)
const results = ref<SearchResult[]>([])
const searching = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const search = async (q: string) => {
  if (!q.trim() || q.length < 2) {
    results.value = []
    return
  }

  if (!MAPBOX_TOKEN) return

  searching.value = true
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${MAPBOX_TOKEN}&types=place,locality,neighborhood,district,region,country&limit=5`
    const res = await fetch(url)
    const json = await res.json()
    results.value = (json.features ?? []).map((f: { id: string; center: [number, number]; place_name: string }) => {
      const parts = f.place_name.split(',')
      return { id: f.id, center: f.center, name: parts[0], region: parts.slice(1).join(',').trim() }
    })
  } catch {
    results.value = []
  } finally {
    searching.value = false
  }
}

const onInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  query.value = val
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => search(val), 300)
}

const selectResult = (result: SearchResult) => {
  emit('fly-to', result.center[0], result.center[1])
  query.value = result.name
  results.value = []
  focused.value = false
  inputRef.value?.blur()
}

const clearSearch = () => {
  query.value = ''
  results.value = []
}
</script>

<template>
  <div class="relative">
    <!-- Input -->
    <div
      class="flex items-center gap-2.5 px-4 py-3 rounded-2xl transition-all duration-200"
      :style="{
        background: '#F8F4EF',
        border: focused ? '1.5px solid rgba(26,60,52,0.25)' : '1px solid rgba(26,60,52,0.12)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.10)',
        colorScheme: 'light',
      }"
    >
      <!-- Search icon -->
      <svg class="w-4 h-4 shrink-0" style="color: #2D6A4F; opacity: 0.6;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <input
        ref="inputRef"
        :value="query"
        type="text"
        placeholder="explore anywhere..."
        class="flex-1 bg-transparent text-sm font-body outline-none border-0"
        style="color: #0E1F1A;"
        @input="onInput"
        @focus="focused = true"
        @blur="focused = false"
      />

      <!-- Clear button -->
      <button
        v-if="query"
        class="shrink-0 p-0 m-0 border-0 bg-transparent transition-opacity active:opacity-40"
        style="color: rgba(14,31,26,0.35);"
        @click="clearSearch"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <!-- Spinner -->
      <svg v-if="searching" class="w-4 h-4 shrink-0 animate-spin" style="color: #2D6A4F; opacity: 0.5;" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    </div>

    <!-- Results dropdown -->
    <Transition name="dropdown">
      <div
        v-if="results.length > 0"
        class="absolute left-0 right-0 mt-1.5 rounded-2xl overflow-hidden"
        style="background: #F8F4EF; border: 1px solid rgba(26,60,52,0.12); box-shadow: 0 12px 40px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.12); color-scheme: light;"
      >
        <button
          v-for="(result, i) in results"
          :key="result.id"
          class="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
          :class="{ 'border-t': i > 0 }"
          style="border-color: rgba(26,60,52,0.07);"
          @mousedown.prevent="selectResult(result)"
        >
          <svg class="w-3 h-3 shrink-0 mt-px" style="color: #2D6A4F;" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <div class="min-w-0">
            <span class="text-sm font-body font-medium truncate block" style="color: #0E1F1A;">{{ result.name }}</span>
            <span class="text-[11px] font-body truncate block leading-tight" style="color: rgba(14,31,26,0.45);">{{ result.region }}</span>
          </div>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
input::placeholder {
  font-style: italic;
  color: rgba(14, 31, 26, 0.35);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
