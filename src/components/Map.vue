<template>
  <v-container ref="containerRef" class="image-map pa-0" fluid>
    <l-map :class="'l-map'" ref="mapRef" v-if="!loading" :zoom="zoom" :center="center" :crs="L.CRS.Simple"
      :maxBounds="bounds" :maxZoom="4" @click="handleClick" style="position: absolute">
      <l-image-overlay :url="mapUrl" :bounds="bounds" />
      <!-- Add existing markers from the database -->
      <Marker v-for="marker in markers" :marker="marker" :user-authorized="userAuthorized" @marker:removed="handleMarkerRemoved" />
      <!-- Add new marker dialog -->
      <MapActionAdd :active="dialogAddMarkerActive" :position="lastNewMarkerPosition" :user-authorized="userAuthorized"
        @update:active="dialogAddMarkerActive = $event" @marker:added="handleMarkerAdded" @marker:updated="handleMarkerUpdated" />
    </l-map>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { LMap, LImageOverlay } from '@vue-leaflet/vue-leaflet';
import * as L from 'leaflet';
import mapUrl from '../assets/map.jpg';
import { getMapMarkers } from '../database/queries/map-markers.query';
import { type MapMarker, UserRights } from '../../netlify/core/database/types';
import { VContainer } from 'vuetify/lib/components/index.mjs';
import Marker from './map/Marker.vue';
import MapActionAdd from './map/MapActionAdd.vue';
import { DiscordService } from '../services/discord.service';
import { isUserAuthorized } from '../database/queries/users.query';

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
const dialogAddMarkerActive = ref<boolean>(false);
const lastNewMarkerPosition = ref<L.LatLng | null>(null);
const userAuthorized = ref<boolean>(false);

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
  dialogAddMarkerActive.value = true;
  lastNewMarkerPosition.value = event.latlng;
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

function handleMarkerAdded(marker: MapMarker) {
  console.log('[Map] Marker added', marker);
  loadMapMarkers();
}

function handleMarkerRemoved(marker: MapMarker) {
  console.log('[Map] Marker removed', marker);
  loadMapMarkers();
}

function handleMarkerUpdated(marker: MapMarker) {
  console.log('[Map] Marker updated', marker);
  loadMapMarkers();
}

async function loadMapMarkers() {
  markers.value = await getMapMarkers() as MapMarker[];
  console.log('[Map] Map markers loaded', markers.value);
}

async function loadUserAuthorization() {
  const currentUser = DiscordService.getInstance().getUser();
  if (currentUser === null) {
    userAuthorized.value = false;
    return;
  }
  userAuthorized.value = await isUserAuthorized(currentUser.id, UserRights.UPDATE);
}

onMounted(async () => {
  await nextTick();
  updateMapDimensions();
  window.addEventListener('resize', updateMapDimensions);

  // setup map dimensions
  await loadMapDimensions();

  // load map markers
  await loadMapMarkers();

  // load user authorization
  await loadUserAuthorization();

  loading.value = false;
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateMapDimensions);
});
</script>
