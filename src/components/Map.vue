<template>
  <div class="image-map">
    <l-map :zoom="zoom" :center="center" :crs="L.CRS.Simple" :maxBounds="bounds" :maxZoom="4"
      style="height: 500px; width: 100%;">
      <l-image-overlay :url="mapUrl" :bounds="bounds" />
      <l-marker :lat-lng="markerCenter" />
    </l-map>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { LMap, LImageOverlay, LMarker } from '@vue-leaflet/vue-leaflet';
import * as L from 'leaflet';
import mapUrl from '../assets/map.png';

// Image dimensions (in virtual "map units", not geo coords)
const imageWidth = 1000;
const imageHeight = 800;

// Define bounds: [[yMin, xMin], [yMax, xMax]]
const bounds = ref<L.LatLngBoundsLiteral>([
  [0, 0],
  [imageHeight, imageWidth],
]);

// Explicitly set center as a ref with LatLngExpression type
const markerCenter = ref<L.LatLngExpression>([
  imageHeight / 2,
  imageWidth / 2,
]);

// Explicitly set center as a ref with LatLngExpression type
const center = computed<L.PointExpression>(() => [
  imageHeight / 2,
  imageWidth / 2,
]);

const zoom = ref<number>(1);
</script>