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
                    <span v-if="!isEditing">{{ marker.label }}</span>
                    <v-text-field v-else v-model="marker.label" density="compact" label="Label" width="100%" />
                    <v-tooltip text="Close">
                        <template v-slot:activator="{ props }">
                            <v-container class="d-flex flex-row justify-end pa-0">
                                <v-btn v-if="!isEditing && userAuthorized" class="mr-1" icon="mdi-pencil"
                                    @click="handleEdit" density="comfortable" variant="tonal" size="small" />
                                <v-btn v-else-if="userAuthorized" class="mr-1" icon="mdi-check" @click="handleEdit"
                                    density="comfortable" variant="tonal" size="small" />
                                <v-btn v-bind="props" icon="mdi-close" @click="isActive.value = false"
                                    density="comfortable" variant="tonal" size="small" />
                            </v-container>
                        </template>
                    </v-tooltip>
                </v-card-title>

                <v-card-text>
                    <div v-if="!isEditing">{{ marker.description }}</div>
                    <v-textarea v-else v-model="marker.description" density="compact" label="Description"
                        width="100%" />
                </v-card-text>

                <v-card-actions>
                    <v-tooltip :text="'Created ' + marker.created_at">
                        <template v-slot:activator="{ props }">
                            <v-chip prepend-icon="mdi-calendar" variant="outlined" v-bind="props">
                                {{ formatHumanDate(marker.created_at) }}
                            </v-chip>
                        </template>
                    </v-tooltip>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script setup lang="ts">
import type { MapMarker } from '../../../../../netlify/core/database/types';
import { computed, defineProps, ref } from 'vue';
import { updateMapMarker } from '../../../../database/queries/map-markers.query';
import { formatHumanDate } from '../../../../utils/date';

const props = defineProps<{
    marker: MapMarker;
    userAuthorized: boolean;
}>();

const marker = computed<MapMarker>(() => props.marker);
const userAuthorized = computed<boolean>(() => props.userAuthorized);
const isEditing = ref<boolean>(false);
const emit = defineEmits<{
    'marker:updated': [marker: MapMarker];
}>();

async function handleEdit() {
    if (!userAuthorized.value) return;
    console.log('[MarkerActionDialog] Editing marker', marker.value);
    if (isEditing.value) {
        isEditing.value = false;
        await updateMapMarker(marker.value);
        emit('marker:updated', marker.value);
    } else {
        isEditing.value = true;
    }
}
</script>