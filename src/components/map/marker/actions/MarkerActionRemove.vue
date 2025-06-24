<template>
    <v-dialog width="500" v-if="userAuthorized">
        <template v-slot:activator="{ props }">
            <v-btn variant="outlined" color="error" density="comfortable" icon="mdi-trash-can-outline" v-bind="props" />
        </template>
        <template v-slot:default="{ isActive }">
            <v-card>
                <v-card-title class="d-flex flex-row justify-space-between align-center">
                    <span>{{ t('map.marker.actions.delete.title', { label: marker.label }) }}</span>
                    <v-tooltip :text="t('map.marker.actions.delete.close')">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon="mdi-close" @click="isActive.value = false" density="comfortable"
                                variant="tonal" size="small" />
                        </template>
                    </v-tooltip>
                </v-card-title>

                <v-card-text>
                    {{ t('map.marker.actions.delete.confirm') }}
                    <v-btn class="mt-4" variant="flat" color="error" density="comfortable" block @click="handleRemove">
                        {{ t('map.marker.actions.delete.button') }}
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
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
    marker: MapMarker;
    userAuthorized: boolean;
}>();

const marker = computed<MapMarker>(() => props.marker);
const userAuthorized = computed<boolean>(() => props.userAuthorized);
const emit = defineEmits<{
    'marker:removed': [marker: MapMarker];
}>();

async function handleRemove() {
    console.log('[MarkerActionRemove] Removing marker', marker.value);
    await deleteMapMarker(marker.value);
    emit('marker:removed', marker.value);
}
</script>