<template>
    <v-dialog width="500" @after-leave="isEditing = false">
        <template v-slot:activator="{ props }">
            <v-btn class="mr-2" variant="outlined" color="primary" density="comfortable" v-bind="props">
                <span>{{ t('map.marker.actions.more.button') }}</span>
                <v-icon end icon="mdi-arrow-expand-all"></v-icon>
            </v-btn>
        </template>
        <template v-slot:default="{ isActive }">
            <v-card>
                <v-card-title class="d-flex flex-row justify-space-between align-center">
                    <span v-if="!isEditing">{{ marker.label }}</span>
                    <v-text-field v-else v-model="editableMarker!.label" density="compact" :label="t('marker_dialog.label')" width="100%" />
                    <v-tooltip :text="t('map.marker.actions.more.close')">
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
                        density="compact" :label="t('marker_dialog.category')" width="100%" />
                </v-card-subtitle>

                <v-card-text>
                    <div v-if="!isEditing">{{ marker.description }}</div>
                    <v-textarea v-else v-model="editableMarker!.description" density="compact" :label="t('marker_dialog.description')"
                        width="100%" />
                </v-card-text>

                <v-card-actions>
                    <v-tooltip :text="t('map.marker.actions.more.created_at', { date: marker.created_at })">
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
import type { DatabaseMapMarker, DatabaseMarkerCategory } from '../../../../../netlify/core/types/database.types';
import { computed, defineProps, onMounted, ref, watch } from 'vue';
import { formatHumanDate } from '../../../../utils/date';
import { getMarkerCategories } from '../../../../database/queries/marker-categories.query';
import { useLogger } from 'vue-logger-plugin';
import { useI18n } from 'vue-i18n';
import { store } from '../../../../store/index.store';

const { t } = useI18n();

const logger = useLogger();

const props = defineProps<{
    marker: DatabaseMapMarker;
    userAuthorized: boolean;
}>();

const marker = computed<DatabaseMapMarker>(() => props.marker);
const userAuthorized = computed<boolean>(() => props.userAuthorized);
const isEditing = ref<boolean>(false);
const isSaving = ref<boolean>(false);
const editableMarker = ref<DatabaseMapMarker | null>(null);
const emit = defineEmits<{
    'marker:updated': [marker: DatabaseMapMarker];
}>();

const categories = ref<DatabaseMarkerCategory[]>([]);
const previousMarker = ref<DatabaseMapMarker | null>(null);

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
            emit('marker:updated', previousMarker.value as DatabaseMapMarker);
            editableMarker.value = null;
        }
    }
});

async function handleEdit() {
    if (!userAuthorized.value) return;
    
    if (isEditing.value) {
        // Currently editing, so save changes
        isSaving.value = true;
        await store.mapMarkers().update(editableMarker.value as DatabaseMapMarker);
        emit('marker:updated', editableMarker.value as DatabaseMapMarker);
        isSaving.value = false;
        isEditing.value = false;
    } else {
        // Not editing, so start editing
        isEditing.value = true;
    }
}
</script>