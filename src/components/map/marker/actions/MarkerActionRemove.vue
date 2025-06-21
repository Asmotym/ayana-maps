<template>
    <v-dialog width="500">
        <template v-slot:activator="{ props }">
            <v-btn variant="outlined" color="error" density="comfortable" icon="mdi-trash-can-outline" v-bind="props" />
        </template>
        <template v-slot:default="{ isActive }">
            <v-card>
                <v-card-title class="d-flex flex-row justify-space-between align-center">
                    <span>Removing marker "{{ marker.label }}"</span>
                    <v-tooltip text="Close">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon="mdi-close" @click="isActive.value = false" density="comfortable"
                                variant="tonal" size="small" />
                        </template>
                    </v-tooltip>
                </v-card-title>

                <v-card-text>
                    Are you sure you want to remove this marker?
                    <v-btn class="mt-4" variant="flat" color="error" density="comfortable" block @click="handleRemove">
                        Remove
                    </v-btn>
                </v-card-text>
            </v-card>
        </template>
    </v-dialog>
</template>

<script setup lang="ts">
import type { MapMarker } from '../../../../../netlify/core/database/types';
import { computed, defineProps } from 'vue';
import { deleteMapMarker } from '../../../../database/queries/map-markers.query';

const props = defineProps<{
    marker: MapMarker;
}>();

const marker = computed<MapMarker>(() => props.marker);
const emit = defineEmits<{
    'marker:removed': [marker: MapMarker];
}>();

async function handleRemove() {
    console.log('[MarkerActionRemove] Removing marker', marker.value);
    await deleteMapMarker(marker.value);
    emit('marker:removed', marker.value);
}
</script>