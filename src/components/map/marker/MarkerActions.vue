<template>
    <v-container class="d-flex flex-row justify-center align-center pa-0">
        <MarkerActionDialog :marker="marker" />
        <MarkerActionRemove :marker="marker" />
    </v-container>
</template>

<script setup lang="ts">
import type { MapMarker } from '../../../../netlify/core/database/queries/map_markers.query';
import { computed, defineProps } from 'vue';
import MarkerActionDialog from './actions/MarkerActionDialog.vue';
import MarkerActionRemove from './actions/MarkerActionRemove.vue';

const props = defineProps<{
    marker: MapMarker;
}>();

const marker = computed<MapMarker>(() => props.marker);
</script>