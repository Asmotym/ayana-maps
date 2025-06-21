<template>
    <l-marker :lat-lng="[marker.x, marker.y]" class="map-marker">
        <l-tooltip class="map-marker__tooltip">{{ marker.label }}</l-tooltip>
        <l-popup class="map-marker__popup">
            <div class="map-marker__popup-content">
                <h3 class="map-marker__popup-content-title">{{ marker.label }}</h3>
                <p class="map-marker__popup-content-description">{{ marker.description || 'No description' }}</p>
                <MarkerActions :marker="marker" :user-authorized="userAuthorized" @marker:removed="handleMarkerRemoved"
                    @marker:updated="handleMarkerUpdated" />
            </div>
        </l-popup>
    </l-marker>
</template>

<script setup lang="ts">
import { LMarker, LTooltip, LPopup } from '@vue-leaflet/vue-leaflet';
import type { MapMarker } from '../../../netlify/core/database/types';
import { computed, defineProps } from 'vue';
import MarkerActions from './marker/MarkerActions.vue';

const props = defineProps<{
    marker: MapMarker;
    userAuthorized: boolean;
}>();

const marker = computed<MapMarker>(() => props.marker);
const emit = defineEmits<{
    'marker:removed': [marker: MapMarker];
    'marker:updated': [marker: MapMarker];
}>();

function handleMarkerRemoved(marker: MapMarker) {
    emit('marker:removed', marker);
}

function handleMarkerUpdated(marker: MapMarker) {
    emit('marker:updated', marker);
}
</script>