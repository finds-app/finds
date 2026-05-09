<script setup lang="ts">
import { ref, watch } from 'vue'
import { IonIcon } from '@ionic/vue'
import { locationOutline, navigateOutline } from 'ionicons/icons'

const props = defineProps<{
  locationName: string
  gpsLoading: boolean
  hasLocation: boolean
}>()

const emit = defineEmits<{
  'update:locationName': [value: string]
  'select-place': [name: string, lat: number, lng: number]
  'use-current': []
  'clear': []
}>()

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

interface SearchResult {
  id: string
  center: [number, number]
  name: string
  region: string
}

const inputRef = ref<HTMLInputElement | null>(null)
const query = ref(props.locationName)
const results = ref<SearchResult[]>([])
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.locationName,
  (val) => { if (val !== query.value) query.value = val },
)

const search = async (q: string) => {
  if (!q.trim() || q.length < 2) { results.value = []; return }
  if (!MAPBOX_TOKEN) return
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${MAPBOX_TOKEN}&types=place,locality,neighborhood,district,region,country&limit=5`,
    )
    const json = await res.json()
    results.value = (json.features ?? []).map((f: { id: string; center: [number, number]; place_name: string }) => {
      const parts = f.place_name.split(',')
      return { id: f.id, center: f.center, name: parts[0], region: parts.slice(1).join(',').trim() }
    })
  } catch {
    results.value = []
  }
}

const onInput = (e: Event) => {
  query.value = (e.target as HTMLInputElement).value
  emit('update:locationName', query.value)
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => search(query.value), 300)
}

const selectResult = (result: SearchResult) => {
  query.value = result.name
  results.value = []
  inputRef.value?.blur()
  emit('select-place', result.name, result.center[1], result.center[0])
}

const clearQuery = () => {
  query.value = ''
  results.value = []
  emit('clear')
}
</script>

<template>
  <div>
    <div class="flex items-center gap-3 py-3">
      <ion-icon :icon="locationOutline" class="text-sage/60 text-lg shrink-0" />

      <div class="flex-1 min-w-0">
        <span v-if="gpsLoading" class="text-white/35 text-sm font-body">Locating...</span>
        <input
          v-else
          ref="inputRef"
          :value="query"
          type="text"
          placeholder="Add a location..."
          class="w-full bg-transparent text-white/70 text-sm font-body outline-none border-0 placeholder:text-white/20"
          @input="onInput"
        />
      </div>

      <button
        v-if="query && !gpsLoading"
        class="shrink-0 p-0 m-0 border-0 bg-transparent text-white/20 active:text-white/40"
        @click="clearQuery"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <button
        v-if="!hasLocation && !query && !gpsLoading"
        class="shrink-0 p-1 m-0 border-0 bg-transparent text-sage/70"
        @click="emit('use-current')"
      >
        <ion-icon :icon="navigateOutline" class="text-sm" />
      </button>
    </div>

    <div v-if="results.length > 0" class="pb-2 pl-8">
      <button
        v-for="(result, i) in results"
        :key="result.id"
        class="w-full flex items-center gap-3 px-0 py-2 text-left border-0 bg-transparent transition-opacity active:opacity-60"
        :class="{ 'border-t border-white/[0.05]': i > 0 }"
        @mousedown.prevent="selectResult(result)"
      >
        <div class="min-w-0">
          <span class="text-white/70 text-sm font-body block truncate">{{ result.name }}</span>
          <span class="text-white/25 text-[11px] font-body block truncate">{{ result.region }}</span>
        </div>
      </button>
    </div>
  </div>
</template>
