<template>
    <v-container class="map-filters pa-0 ma-0">
        <v-speed-dial location="left top" transition="slide-x-reverse-transition">
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
                    <v-card-text>Nothing to see here...</v-card-text>
                </v-card>
            </v-container>
        </v-speed-dial>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const loading = ref<boolean>(false);
</script>