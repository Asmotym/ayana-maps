<template>
  <v-container ref="containerRef" class="image-map pa-0" fluid>
    <l-map :class="'l-map'" ref="mapRef" v-if="!loading" :zoom="zoom" :center="center" :crs="L.CRS.Simple"
      :maxBounds="bounds" :maxZoom="4" @click="handleClick" style="position: absolute">
      <l-image-overlay :url="mapUrl" :bounds="bounds" />
      <!-- Add existing markers from the database -->
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
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { LMap, LImageOverlay, LMarker, LTooltip, LPopup } from '@vue-leaflet/vue-leaflet';
import * as L from 'leaflet';
import mapUrl from '../assets/map.jpg';
import { getMapMarkers } from '../database/queries/map-markers.query';
import type { MapMarker } from '../../netlify/core/database/queries/map_markers.query';
import { VContainer } from 'vuetify/lib/components/index.mjs';

// initialize ref & computed
const zoom = ref<number>(1);
const mapWidth = ref<number>(0);
const mapHeight = ref<number>(0);
const loading = ref<boolean>(true);
const bounds = computed<L.LatLngBoundsLiteral>(() => [[0, 0], [mapHeight.value, mapWidth.value]]);
const center = computed<L.PointExpression>(() => [mapHeight.value / 2, mapWidth.value / 2]);
const markers = ref<MapMarker[]>([]);
const mapRef = ref<typeof LMap | null>(null);
const containerRef = ref<typeof VContainer | null>(null);

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

function updateMapDimensions() {
  const mainRef = document.querySelector('.v-main');
  if (mainRef && mapRef.value && containerRef.value) {
    const paddingTop = mainRef.computedStyleMap().get('padding-top') as { value: number, unit: string };
    console.log('[Map] Updating map dimensions', {
      width: mainRef.clientWidth, 
      height: mainRef.clientHeight - paddingTop.value,
      mainRef,
      containerRef
    });
    mapRef.value.$el.setAttribute('style', `width: ${mainRef.clientWidth}px; height: ${mainRef.clientHeight - paddingTop.value}px; position: absolute;`);
    containerRef.value.$el.setAttribute('style', `padding-top: ${paddingTop.value}px;`);
  }
}

onMounted(async () => {
  await nextTick();
  // setInterval(() => {
  //   updateMapDimensions();
  // }, 1000);
  updateMapDimensions();
  window.addEventListener('resize', updateMapDimensions);

  // setup map dimensions
  await loadMapDimensions();



  // load map markers
  markers.value = await getMapMarkers() as MapMarker[];
  console.log('[Map] Map markers loaded', markers.value);

  loading.value = false;
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateMapDimensions);
});
</script>

<style scoped>
</style>