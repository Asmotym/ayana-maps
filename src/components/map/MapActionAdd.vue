<template>
    <v-dialog width="500" v-model="dialogActive" v-if="userAuthorized" @update:model-value="resetForm">
        <v-card>
            <v-card-title class="d-flex flex-row justify-space-between align-center">
                <span>Add new marker</span>
                <v-tooltip text="Close">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-close" @click="dialogActive = false" density="comfortable"
                            variant="tonal" color="red" size="small" />
                    </template>
                </v-tooltip>
            </v-card-title>

            <v-card-text>
                <v-form v-model="valid">
                    <v-text-field counter="255" label="Label" v-model="label" :rules="labelRules" />
                    <v-select label="Category" v-model="category" :items="categories" item-title="name" item-value="id"
                        :rules="categoryRules" />
                    <v-textarea label="Description" v-model="description" :rules="descriptionRules" />
                    <v-btn class="mt-4" variant="outlined" color="primary" density="comfortable" :disabled="!valid"
                        block @click="handleSubmit">
                        Submit
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, onMounted, ref } from 'vue';
import type * as L from 'leaflet';
import type { MapMarker } from '../../../netlify/core/database/types';
import { insertMapMarker } from '../../database/queries/map-markers.query';
import { useLogger } from 'vue-logger-plugin';
import type { MarkerCategory } from '../../../netlify/core/database/types';
import { getMarkerCategories } from '../../database/queries/marker-categories.query';

const logger = useLogger();

const props = defineProps<{
    active: boolean;
    position: L.LatLng | null;
    userAuthorized: boolean;
}>();

const emit = defineEmits<{
    'update:active': [value: boolean];
    'marker:added': [marker: MapMarker];
}>();

const userAuthorized = computed<boolean>(() => props.userAuthorized);
const dialogActive = computed({
    get: () => props.active,
    set: (value: boolean) => emit('update:active', value)
});

const label = ref<string>('');
const description = ref<string>('');
const valid = ref<boolean>(false);
const labelRules = ref<((value: string) => string | boolean)[]>([
    (value: string) => {
        if (value) return true;

        return 'Label is required';
    },
    (value: string) => {
        if (value.length <= 255) return true;

        return 'Label must be less than 255 characters';
    }
]);
const categoryRules = ref<((value: string) => string | boolean)[]>([
    (value: string) => {
        if (value) return true;

        return 'Category is required';
    }
]);
const descriptionRules = ref<((value: string) => string | boolean)[]>([
    (value: string) => {
        if (value) return true;

        return 'Description is required';
    }
]);
const categories = ref<MarkerCategory[]>([]);
const category = ref<number | null>(null);

onMounted(async () => {
    categories.value = await getMarkerCategories();
});

function resetForm() {
    label.value = '';
    description.value = '';
    valid.value = false;
    category.value = null;
}

async function handleSubmit() {
    const marker: MapMarker = {
        label: label.value,
        description: description.value,
        created_at: new Date(),
        x: props.position?.lat || 0,
        y: props.position?.lng || 0,
        category_id: category.value || null,
    } as MapMarker;

    logger.info('Adding new marker', { marker, category: category.value });
    await insertMapMarker(marker);
    dialogActive.value = false;
    emit('marker:added', marker);
    resetForm();
}
</script>