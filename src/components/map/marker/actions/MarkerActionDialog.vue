<template>
    <v-dialog width="500" @after-leave="isEditing = false">
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
                    <v-text-field v-else v-model="editableMarker!.label" density="compact" label="Label" width="100%" />
                    <v-tooltip text="Close">
                        <template v-slot:activator="{ props }">
                            <v-container class="d-flex flex-row justify-end pa-0">
                                <v-btn v-if="!isEditing && userAuthorized" class="mr-1" icon="mdi-pencil"
                                    @click="handleEdit" density="comfortable" variant="tonal" size="small" />
                                <v-btn v-else-if="userAuthorized" class="mr-1" icon="mdi-check" @click="handleEdit"
                                    density="comfortable" variant="tonal" size="small" :loading="isSaving" />
                                <v-btn v-bind="props" icon="mdi-close" @click="isActive.value = false"
                                    density="comfortable" variant="tonal" size="small" />
                            </v-container>
                        </template>
                    </v-tooltip>
                </v-card-title>
                
                <v-card-subtitle>
                    <span v-if="!isEditing" class="text-caption">{{ marker.category_name }}</span>
                    <v-select v-else v-model="editableMarker!.category_id" :items="categories" item-title="name" item-value="id"
                        density="compact" label="Category" width="100%" />
                </v-card-subtitle>

                <v-card-text>
                    <div v-if="!isEditing">{{ marker.description }}</div>
                    <v-textarea v-else v-model="editableMarker!.description" density="compact" label="Description"
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
import type { MapMarker, MarkerCategory } from '../../../../../netlify/core/database/types';
import { computed, defineProps, onMounted, ref, watch } from 'vue';
import { updateMapMarker } from '../../../../database/queries/map-markers.query';
import { formatHumanDate } from '../../../../utils/date';
import { getMarkerCategories } from '../../../../database/queries/marker-categories.query';
import { useLogger } from 'vue-logger-plugin';

const logger = useLogger();

const props = defineProps<{
    marker: MapMarker;
    userAuthorized: boolean;
}>();

const marker = computed<MapMarker>(() => props.marker);
const userAuthorized = computed<boolean>(() => props.userAuthorized);
const isEditing = ref<boolean>(false);
const isSaving = ref<boolean>(false);
const editableMarker = ref<MapMarker | null>(null);
const emit = defineEmits<{
    'marker:updated': [marker: MapMarker];
}>();

const categories = ref<MarkerCategory[]>([]);
const previousMarker = ref<MapMarker | null>(null);

onMounted(async () => {
    categories.value = await getMarkerCategories();
});

// Watch for changes in isEditing
watch(isEditing, async (newValue) => {
    if (newValue === true) {
        // Starting to edit - store the original state and create editable copy
        previousMarker.value = { ...marker.value };
        editableMarker.value = { ...marker.value };
        logger.info(`Started editing, stored previous state for marker ${marker.value.id || 'unknown'}`);
    } else {
        // Stopping editing
        if (isSaving.value) {
            // Changes were saved, clear the previous state
            logger.info(`Changes saved, clearing previous state for marker ${marker.value.id || 'unknown'}`);
            previousMarker.value = null;
            editableMarker.value = null;
        } else if (previousMarker.value) {
            // Changes were not saved, revert to previous state
            logger.info(`Reverting to previous state for marker ${previousMarker.value.id || 'unknown'}`);
            emit('marker:updated', previousMarker.value as MapMarker);
            editableMarker.value = null;
        }
    }
});

async function handleEdit() {
    if (!userAuthorized.value) return;
    
    if (isEditing.value) {
        // Currently editing, so save changes
        isSaving.value = true;
        await updateMapMarker(editableMarker.value as MapMarker);
        emit('marker:updated', editableMarker.value as MapMarker);
        isSaving.value = false;
        isEditing.value = false;
    } else {
        // Not editing, so start editing
        isEditing.value = true;
    }
}
</script>