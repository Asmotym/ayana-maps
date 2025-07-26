<template>
    <!-- Database Status Section -->
    <v-card class="queries-testing">
        <template #title>{{ t('testing_ground.title') }}</template>
        <!-- Query Controls -->
        <v-card-text class="queries-testing__contentbg-surface-light pa-4">
            <h3 class="mt-4">{{ t('testing_ground.users_queries.title') }}</h3>
            <div class="queries-testing__content__buttons mt-2">
                <v-btn class="me-2" :text="t('testing_ground.users_queries.get_current_user')"
                    @click="performQuery('get_current_user')" variant="outlined" color="primary"
                    :loading="loadingQuery === 'get_current_user'" :disabled="loadingQuery === 'get_current_user'" />
            </div>

            <h3 class="mt-4">{{ t('testing_ground.map_markers_queries.title') }}</h3>
            <div class="queries-testing__content__buttons mt-2">
                <v-btn class="me-2" :text="t('testing_ground.map_markers_queries.get_map_markers')"
                    @click="performQuery('map_markers')" variant="outlined" color="primary"
                    :loading="loadingQuery === 'map_markers'" :disabled="loadingQuery === 'map_markers'" />
            </div>

            <h3 class="mt-4">{{ t('testing_ground.marker_categories_queries.title') }}</h3>
            <div class="queries-testing__content__buttons mt-2">
                <v-btn class="me-2" :text="t('testing_ground.marker_categories_queries.get_marker_categories')"
                    @click="performQuery('marker_categories')" variant="outlined" color="primary"
                    :loading="loadingQuery === 'marker_categories'" :disabled="loadingQuery === 'marker_categories'" />
            </div>

            <!-- Results Display -->
            <div v-if="dbData" class="queries-testing__results mt-4">
                <h3 class="queries-testing__results__title">{{ t('testing_ground.query_results') }}</h3>
                <pre class="queries-testing__results__display pa-4 mt-2 bg-surface-light">{{ JSON.stringify(dbData, null, 2) }}</pre>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DiscordService } from '../../services/discord.service'
import { useI18n } from 'vue-i18n'
import { store } from '../../store/index.store'

const { t } = useI18n()

// Reactive data for database results
const dbData = ref<any>(null)
const loadingQuery = ref<string | null>(null)

// Function to query the database
async function performQuery(queryType: string) {
    loadingQuery.value = queryType
    switch (queryType) {
        case 'get_current_user':
            dbData.value = await store.user().getUser(DiscordService.getInstance().getUser()?.id as string)
            break
        case 'map_markers':
            dbData.value = await store.mapMarkers().getAll()
            break
        case 'marker_categories':
            dbData.value = await store.markerCategories().getAll()
            break
    }
    loadingQuery.value = null
}
// Query database when component mounts
onMounted(() => {
    performQuery('version')
})
</script>

<style scoped>
.queries-testing {
    margin: 20px;
}
</style>