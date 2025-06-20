<template>
  <div class="image-map">
    <l-map v-if="!loading" :zoom="zoom" :center="center" :crs="L.CRS.Simple" :maxBounds="bounds" :maxZoom="4"
      style="height: 500px; width: 100%;" @click="handleClick">
      <l-image-overlay :url="mapUrl" :bounds="bounds" />
      <!-- Marker -->
      <!-- <l-marker :lat-lng="markerCenter" /> -->
      <l-marker v-for="marker in markers" :lat-lng="[marker.x, marker.y]" class="map-marker">
        <l-tooltip class="map-marker__tooltip">{{ marker.label }}</l-tooltip>
        <l-popup class="map-marker__popup">
          <div class="map-marker__popup-content">
            <h3 class="map-marker__popup-content-title">{{ marker.label }}</h3>
            <p class="map-marker__popup-content-description">{{ marker.description || 'No description' }}</p>
          </div>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { LMap, LImageOverlay, LMarker, LTooltip, LPopup } from '@vue-leaflet/vue-leaflet';
import * as L from 'leaflet';
import mapUrl from '../assets/map.jpg';
import { getMapMarkers } from '../database/queries/map-markers.query';
import type { MapMarker } from '../../netlify/core/database/queries/map_markers.query';

// initialize ref & computed
const zoom = ref<number>(1);
const mapWidth = ref<number>(0);
const mapHeight = ref<number>(0);
const loading = ref<boolean>(true);
const bounds = computed<L.LatLngBoundsLiteral>(() => [[0, 0], [mapHeight.value, mapWidth.value]]);
// const markerCenter = computed<L.LatLngExpression>(() => [mapHeight.value / 2, mapWidth.value / 2]);
const center = computed<L.PointExpression>(() => [mapHeight.value / 2, mapWidth.value / 2]);
const markers = ref<MapMarker[]>([]);

async function loadMapDimensions(): Promise<void> {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.src = mapUrl;
    img.onload = () => {
      mapWidth.value = img.naturalWidth;
      mapHeight.value = img.naturalHeight;
      console.log('[Map] Map dimensions loaded', mapWidth.value, mapHeight.value);
      resolve();
    }
  });
}

function handleClick(event: L.LeafletMouseEvent) {
  console.log('[Map] Clicked at', event.latlng);
}

onMounted(async () => {
  // setup map dimensions
  await loadMapDimensions();

  // load map markers
  markers.value = await getMapMarkers() as MapMarker[];
  console.log('[Map] Map markers loaded', markers.value);

  loading.value = false;
});
</script>