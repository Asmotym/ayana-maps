<template>
    <v-dialog width="500">
        <template v-slot:activator="{ props }">
            <v-btn class="mr-2" variant="outlined" color="primary" density="comfortable" v-bind="props">
                <span>MORE</span>
                <v-icon end icon="mdi-arrow-expand-all"></v-icon>
            </v-btn>
        </template>
        <template v-slot:default="{ isActive }">
            <v-card>
                <v-card-title class="d-flex flex-row justify-space-between align-center">
                    <span>{{ marker.label }}</span>
                    <v-tooltip text="Close">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon="mdi-close" @click="isActive.value = false" density="comfortable"
                                variant="tonal" color="red" size="small" />
                        </template>
                    </v-tooltip>
                </v-card-title>

                <v-card-text>
                    {{ marker.description }}
                </v-card-text>
            </v-card>
        </template>
    </v-dialog>
</template>

<script setup lang="ts">
import type { MapMarker } from '../../../../../netlify/core/database/queries/map_markers.query';
import { computed, defineProps } from 'vue';

const props = defineProps<{
    marker: MapMarker;
}>();

const marker = computed<MapMarker>(() => props.marker);
</script>