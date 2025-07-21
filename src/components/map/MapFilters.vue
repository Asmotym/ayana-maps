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
                    <v-card-text>Nothing to see here...</v-card-text>
                    <v-checkbox label="Test A" />
                    <v-checkbox label="Test B" />
                    <v-checkbox label="Test C" />
                    <v-checkbox label="Test D" />
                </v-card>
            </v-container>
        </v-speed-dial>
    </v-container>
</template>

<script setup lang="ts">
import { ref, defineExpose } from 'vue';

const loading = ref<boolean>(false);
const isOpen = ref<boolean>(false);

defineExpose({
    isOpen,
})
</script>