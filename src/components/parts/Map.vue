<template>
  <v-container ref="containerRef" class="image-map pa-0 map-container" fluid>
    <v-skeleton-loader v-if="loading" type="image" full-height />
    <l-map :class="'l-map'" ref="mapRef" v-if="!loading" :zoom="zoom" :center="center" :crs="L.CRS.Simple"
      :maxBounds="bounds" :maxZoom="4" @click="handleClick">
      <l-image-overlay :url="mapUrl" :bounds="bounds" />
      <!-- Add existing markers from the database -->
      <Marker v-for="marker in mapMarkerStore.filteredMarkers" ref="markersComponents" :marker="marker"
        :user-authorized="userAuthorized" />
      <!-- Add new marker dialog -->
      <MapActionAdd :active="dialogAddMarkerActive" :position="lastNewMarkerPosition" :user-authorized="userAuthorized"
        @update:active="dialogAddMarkerActive = $event" />
    </l-map>
    <!-- Map Filters -->
    <MapFilters ref="mapFilters" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { LMap, LImageOverlay } from '@vue-leaflet/vue-leaflet';
import * as L from 'leaflet';
import mapUrl from '../../assets/map.jpg';
import { VContainer } from 'vuetify/lib/components/index.mjs';
import Marker from '../map/Marker.vue';
import MapActionAdd from '../map/MapActionAdd.vue';
import MapFilters from '../map/MapFilters.vue';
import { useMapDimensions } from '../../composables/useMapDimensions';
import { useMapInteraction } from '../../composables/useMapInteraction';
import { useMapMarkers } from '../../composables/useMapMarkers';

// Component state
const loading = ref<boolean>(true);

// Template refs
const markersRefs = useTemplateRef('markersComponents');
const mapFilters = useTemplateRef('mapFilters');
const mapRef = useTemplateRef('mapRef');
const containerRef = useTemplateRef('containerRef');

// Initialize composables
const {
  zoom,
  bounds,
  center,
  userAuthorized
} = useMapDimensions(
  loading,
  mapRef,
  containerRef
);

// Map interaction composable
const { dialogAddMarkerActive, lastNewMarkerPosition, handleClick } = useMapInteraction(
  markersRefs,
  mapFilters
);

const { mapMarkerStore } = useMapMarkers();
</script>

<style scoped>
.v-skeleton-loader {
  position: absolute !important;
  width: 100% !important;
  height: 100% !important;
}

.v-skeleton-loader>.v-skeleton-loader__bone.v-skeleton-loader__image {
  position: absolute !important;
  width: 100% !important;
  height: 100% !important;
}

.l-map {
  position: fixed !important;
}
</style>