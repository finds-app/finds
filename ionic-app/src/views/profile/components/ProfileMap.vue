<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@/theme/map-markers.css'
import type { FindDto } from '@/types'
import { getCollectionColor } from '@/constants'

const props = defineProps<{
  finds: FindDto[]
}>()

const emit = defineEmits<{
  'select-find': [findId: string]
}>()

const containerRef = ref<HTMLDivElement | null>(null)

let map: mapboxgl.Map | null = null
let markers: mapboxgl.Marker[] = []
let resizeObserver: ResizeObserver | null = null

const isNew = (createdAt: string): boolean =>
  Date.now() - new Date(createdAt).getTime() < 24 * 60 * 60 * 1000

const createMarkerEl = (find: FindDto): HTMLElement => {
  const color = getCollectionColor(find.collection)
  const wrapper = document.createElement('div')
  wrapper.className = 'find-marker-wrapper'
  wrapper.innerHTML = `
    <div class="find-bubble${isNew(find.createdAt) ? ' is-new' : ''}" style="--collection-color: ${color}">
      <img src="${find.imageUrl}" alt="" loading="lazy" />
    </div>
  `
  return wrapper
}

const clearMarkers = () => {
  markers.forEach((m) => m.remove())
  markers = []
}

const renderMarkers = (finds: FindDto[]) => {
  if (!map) return
  clearMarkers()
  finds.forEach((find) => {
    if (!find.lat || !find.lng) return
    const el = createMarkerEl(find)
    el.addEventListener('click', (e) => {
      e.stopPropagation()
      emit('select-find', find.id)
    })
    const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
      .setLngLat([find.lng, find.lat])
      .addTo(map!)
    markers.push(marker)
  })
}

const fitToFinds = (finds: FindDto[]) => {
  if (!map) return
  const geoFinds = finds.filter((f) => f.lat && f.lng)
  if (geoFinds.length === 0) return

  if (geoFinds.length === 1) {
    map.flyTo({ center: [geoFinds[0].lng!, geoFinds[0].lat!], zoom: 13, duration: 0 })
    return
  }

  const bounds = geoFinds.reduce(
    (b, f) => b.extend([f.lng!, f.lat!] as [number, number]),
    new mapboxgl.LngLatBounds([geoFinds[0].lng!, geoFinds[0].lat!], [geoFinds[0].lng!, geoFinds[0].lat!]),
  )
  map.fitBounds(bounds, { padding: 60, maxZoom: 14, duration: 0 })
}

const initMap = (container: HTMLDivElement) => {
  if (map) return

  const token = import.meta.env.VITE_MAPBOX_TOKEN
  if (!token) return

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
      if (layer.type === 'background') map!.setPaintProperty(layer.id, 'background-color', '#0E1F1A')
      if (layer.type === 'fill' && layer.id.includes('water')) map!.setPaintProperty(layer.id, 'fill-color', '#091510')
      if (layer.type === 'line' && (layer.id.includes('road') || layer.id.includes('street')))
        map!.setPaintProperty(layer.id, 'line-color', '#1A3C34')
    })

    if (props.finds.length > 0) {
      renderMarkers(props.finds)
      fitToFinds(props.finds)
    }
  })
}

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  // ResizeObserver handles Ionic tab visibility — container starts at 0×0
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
  map?.remove()
  map = null
})

watch(
  () => props.finds,
  (newFinds) => {
    if (map && newFinds.length > 0) {
      renderMarkers(newFinds)
      fitToFinds(newFinds)
    }
  },
)
</script>

<template>
  <div ref="containerRef" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; touch-action: none;" />
</template>
