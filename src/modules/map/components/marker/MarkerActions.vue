<template>
    <v-container class="d-flex flex-row justify-center align-center pa-0">
        <MarkerActionDialog :marker="marker" :user-authorized="userAuthorized" @marker:updated="handleMarkerUpdated" />
        <MarkerActionRemove :marker="marker" :user-authorized="userAuthorized" @marker:removed="handleMarkerRemoved" />
    </v-container>
</template>

<script setup lang="ts">
import type { DatabaseMapMarker } from '../../../../netlify/core/types/database.types';
import { computed, defineEmits, defineProps } from 'vue';
import MarkerActionDialog from './actions/MarkerActionDialog.vue';
import MarkerActionRemove from './actions/MarkerActionRemove.vue';

const props = defineProps<{
    marker: DatabaseMapMarker;
    userAuthorized: boolean;
}>();

const marker = computed<DatabaseMapMarker>(() => props.marker);
const emit = defineEmits<{
    'marker:removed': [marker: DatabaseMapMarker];
    'marker:updated': [marker: DatabaseMapMarker];
}>();

function handleMarkerRemoved(marker: DatabaseMapMarker) {
    emit('marker:removed', marker);
}

function handleMarkerUpdated(marker: DatabaseMapMarker) {
    emit('marker:updated', marker);
}
</script>