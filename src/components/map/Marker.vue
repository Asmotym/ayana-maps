<template>
    <l-marker :lat-lng="[marker.x, marker.y]" class="map-marker" :icon="getMarkerIconFromMarker(marker)">
        <l-tooltip class="map-marker__tooltip">{{ marker.label }} <i>({{ marker.category_name }})</i></l-tooltip>
        <l-popup ref="popupRef" class="map-marker__popup">
            <v-card class="">
                <template #title>
                    <v-container class="d-flex justify-space-between align-center pa-0">
                        <span class="map-marker__popup-label">{{ marker.label }}</span>
                        
                        <v-tooltip text="Close">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon="mdi-close" variant="text" size="small" color="primary" @click="closePopup" />
                        </template>
                    </v-tooltip>
                    </v-container>
                </template>
                <template #subtitle>
                    <v-container class="d-flex justify-space-between align-center pa-0">
                        <span class="text-caption">{{ marker.category_name || 'No category' }}</span>
                    </v-container>
                </template>
                <template #text>{{ marker.description || 'No description' }}</template>
                <template #actions>
                    <MarkerActions :marker="marker" :user-authorized="userAuthorized" @marker:removed="handleMarkerRemoved"
                        @marker:updated="handleMarkerUpdated" />
                </template>
            </v-card>
        </l-popup>
    </l-marker>
</template>

<script setup lang="ts">
import { LMarker, LTooltip, LPopup } from '@vue-leaflet/vue-leaflet';
import type { MapMarker } from '../../../netlify/core/database/types';
import { computed, defineProps, ref } from 'vue';
import MarkerActions from './marker/MarkerActions.vue';
import { useLogger } from 'vue-logger-plugin';
import { getMarkerIconFromMarker } from '../../helpers/markers-icon.helper';

const logger = useLogger();

const props = defineProps<{
    marker: MapMarker;
    userAuthorized: boolean;
}>();

const marker = computed<MapMarker>(() => props.marker);
const popupRef = ref<typeof LPopup | null>(null);
const emit = defineEmits<{
    'marker:removed': [marker: MapMarker];
    'marker:updated': [marker: MapMarker];
}>();

function handleMarkerRemoved(marker: MapMarker) {
    closePopup();
    emit('marker:removed', marker);
}

function handleMarkerUpdated(marker: MapMarker) {
    emit('marker:updated', marker);
}

function closePopup() {
    logger.info('Closing popup');
    popupRef.value?.leafletObject.close();
}
</script>

<style>
.leaflet-popup-close-button {
    display: none !important;
}

.leaflet-popup-content-wrapper {
    background: transparent !important;
    box-shadow: none !important;
}

.leaflet-popup-tip-container .leaflet-popup-tip {
    background: rgb(var(--v-theme-surface)) !important;
}

.leaflet-popup-content {
    margin: 0 !important;
    width: max-content !important;
    max-width: 250px;
}
.map-marker__popup-label {
    text-wrap: auto;
}
</style>