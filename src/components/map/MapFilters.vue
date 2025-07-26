<template>
    <v-container class="map-filters pa-0 ma-0">
        <v-speed-dial v-model="isOpen" location="left top" transition="slide-x-reverse-transition" :close-on-content-click="false">
            <template v-slot:activator="{ props: activatorProps }">
                <v-fab v-bind="activatorProps" location="top right" size="large" icon="mdi-filter-variant" />
            </template>
    
            <v-skeleton-loader v-if="loading" type="paragraph" />
            <v-container v-else class="map-filters__filters pa-0">
                <v-card>
                    <v-card-title>
                        <v-container class="pa-0 ma-0">
                            <span>Filters</span>
                        </v-container>
                    </v-card-title>

                    <v-expansion-panels variant="accordion">
                        <v-expansion-panel
                            v-for="section in mapFiltersStore.filters"
                            :title="section.title"
                        >
                            <v-expansion-panel-text>
                                <div v-for="items in section.items">
                                    <v-checkbox v-if="items.type === 'checkbox'" v-for="category in items.data" v-model="category.active" :label="category.name" density="compact" />
                                </div>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>

                    <!-- <div v-for="section in mapFiltersStore.filters">
                        <h4>{{ section.title }}</h4>
                        
                    </div> -->

                    <!-- <v-checkbox v-for="category in mapFiltersStore?.filters.categories" v-model="category.active" :label="category.name" density="compact" /> -->
                </v-card>
            </v-container>
        </v-speed-dial>
    </v-container>
</template>

<script setup lang="ts">
import { ref, defineExpose, onMounted } from 'vue';
import { store } from '../../store/index.store';
import type { MapFiltersStore } from '../../store/stores/map-filters.store';

// Component state
const loading = ref<boolean>(true);
const isOpen = ref<boolean>(false);
const mapFiltersStore: MapFiltersStore = store.mapFilters();

defineExpose({
    isOpen,
});

onMounted(async () => {
    await mapFiltersStore.initialize();

    if (mapFiltersStore.initialized) {
        loading.value = false;
    }
})
</script>