<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { MapFindDto } from '@/types'
import { getCommunityColor } from '@/constants'
import { setMapInstance } from '../useDiscover'

const props = defineProps<{
  finds: MapFindDto[]
  userLocation: [number, number] | null
}>()

const emit = defineEmits<{
  'map-ready': []
  'select-find': [find: MapFindDto | null]
}>()

const containerRef = ref<HTMLDivElement | null>(null)

let map: mapboxgl.Map | null = null
let markers: mapboxgl.Marker[] = []
let userMarker: mapboxgl.Marker | null = null
let resizeObserver: ResizeObserver | null = null


const isNew = (createdAt: string): boolean => {
  const age = Date.now() - new Date(createdAt).getTime()
  return age < 24 * 60 * 60 * 1000
}

const createMarkerEl = (find: MapFindDto): HTMLElement => {
  const color = getCommunityColor(find.community)
  const fresh = isNew(find.createdAt)
  const wrapper = document.createElement('div')
  wrapper.className = 'find-marker-wrapper'
  wrapper.innerHTML = `
    <div class="find-bubble${fresh ? ' is-new' : ''}" style="--community-color: ${color}">
      <img src="${find.imageUrl}" alt="" loading="lazy" />
    </div>
  `
  return wrapper
}

const clearMarkers = () => {
  markers.forEach((m) => m.remove())
  markers = []
}

const renderMarkers = (finds: MapFindDto[]) => {
  if (!map) return
  clearMarkers()
  finds.forEach((find) => {
    const el = createMarkerEl(find)
    el.addEventListener('click', (e) => {
      e.stopPropagation()
      emit('select-find', find)
    })
    const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
      .setLngLat([find.lng, find.lat])
      .addTo(map!)
    markers.push(marker)
  })
}

const renderUserMarker = (coords: [number, number]) => {
  if (!map) return
  if (userMarker) userMarker.remove()
  const el = document.createElement('div')
  el.innerHTML = `
    <div class="user-location-marker">
      <div class="user-dot"></div>
      <div class="user-ring"></div>
    </div>
  `
  userMarker = new mapboxgl.Marker({ element: el, anchor: 'center' })
    .setLngLat(coords)
    .addTo(map)
}

const initMap = (container: HTMLDivElement) => {
  if (map) return

  const token = import.meta.env.VITE_MAPBOX_TOKEN
  if (!token) {
    console.error('[finds] VITE_MAPBOX_TOKEN is not set')
    return
  }

  mapboxgl.accessToken = token

  map = new mapboxgl.Map({
    container,
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [0, 20],
    zoom: 2,
    attributionControl: false,
    logoPosition: 'bottom-left',
  })

  map.on('load', () => {
    if (!map) return
    const layers = map.getStyle().layers ?? []
    layers.forEach((layer) => {
      if (layer.type === 'background') {
        map!.setPaintProperty(layer.id, 'background-color', '#0E1F1A')
      }
      if (layer.type === 'fill' && layer.id.includes('water')) {
        map!.setPaintProperty(layer.id, 'fill-color', '#091510')
      }
      if (layer.type === 'line' && (layer.id.includes('road') || layer.id.includes('street'))) {
        map!.setPaintProperty(layer.id, 'line-color', '#1A3C34')
      }
    })
    setMapInstance(map)
    emit('map-ready')
  })

  map.on('click', () => {
    emit('select-find', null)
  })
}

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  // ResizeObserver fires whenever the container gains real dimensions.
  // This handles Ionic's tab visibility — the container starts at 0×0
  // and gets sized only when the tab becomes active.
  resizeObserver = new ResizeObserver((entries) => {
    const { width, height } = entries[0].contentRect
    if (width > 0 && height > 0) {
      resizeObserver?.disconnect()
      resizeObserver = null
      if (!map) initMap(container)
      else map.resize()
    }
  })
  resizeObserver.observe(container)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  clearMarkers()
  userMarker?.remove()
  map?.remove()
  map = null
})

watch(
  () => props.finds,
  (newFinds) => {
    if (map && newFinds.length > 0) renderMarkers(newFinds)
  },
)

watch(
  () => props.userLocation,
  (coords) => {
    if (coords) renderUserMarker(coords)
  },
)
</script>

<template>
  <div ref="containerRef" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; touch-action: none;" />
</template>

<style>
.find-marker-wrapper {
  cursor: pointer;
  touch-action: none;
}

.find-bubble {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2.5px solid var(--community-color, #52B788);
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.7);
  transition: transform 150ms ease, box-shadow 150ms ease;
  position: relative;
  background: #1A3C34;
  touch-action: none;
}

.find-bubble img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.find-bubble:active {
  transform: scale(0.9);
}

.find-marker-wrapper:hover .find-bubble {
  transform: scale(1.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.8);
}

.find-bubble.is-new::after {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid var(--community-color, #52B788);
  opacity: 0.6;
  animation: pulse-ring 2.2s ease-out infinite;
  pointer-events: none;
}

@keyframes pulse-ring {
  0% { transform: scale(0.85); opacity: 0.7; }
  70% { transform: scale(1.4); opacity: 0; }
  100% { transform: scale(1.4); opacity: 0; }
}

.user-location-marker {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #52B788;
  border: 2px solid #fff;
  box-shadow: 0 0 8px rgba(82, 183, 136, 0.8);
  z-index: 1;
  position: relative;
}

.user-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(82, 183, 136, 0.4);
  animation: pulse-ring 2s ease-out infinite;
}

.mapboxgl-ctrl-logo { display: none !important; }
.mapboxgl-ctrl-attrib { display: none !important; }
</style>
