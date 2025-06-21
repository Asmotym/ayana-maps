<template>
    <v-container class="d-flex flex-row justify-center align-center pa-0">
        <MarkerActionDialog :marker="marker" :user-authorized="userAuthorized" @marker:updated="handleMarkerUpdated" />
        <MarkerActionRemove :marker="marker" :user-authorized="userAuthorized" @marker:removed="handleMarkerRemoved" />
    </v-container>
</template>

<script setup lang="ts">
import type { MapMarker } from '../../../../netlify/core/database/types';
import { computed, defineEmits, defineProps } from 'vue';
import MarkerActionDialog from './actions/MarkerActionDialog.vue';
import MarkerActionRemove from './actions/MarkerActionRemove.vue';

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