<template>
    <!-- Database Status Section -->
    <v-card class="queries-testing">
        <template #title>Queries Testing Ground</template>
        <!-- Query Controls -->
        <v-card-text class="queries-testing__contentbg-surface-light pa-4">
            <h3>Database Queries</h3>
            <div class="queries-testing__content__buttons mt-2">
                <v-btn class="me-2" text="Get Version" @click="performQuery('version')" variant="outlined"
                    color="primary" :loading="loadingQuery === 'version'" :disabled="loadingQuery === 'version'" />
                <v-btn class="me-2" text="List Tables" @click="performQuery('tables')" variant="outlined"
                    color="primary" :loading="loadingQuery === 'tables'" :disabled="loadingQuery === 'tables'" />
            </div>

            <h3 class="mt-4">Users Queries</h3>
            <div class="queries-testing__content__buttons mt-2">
                <v-btn class="me-2" text="Get Current User" @click="performQuery('get_current_user')" variant="outlined"
                    color="primary" :loading="loadingQuery === 'get_current_user'"
                    :disabled="loadingQuery === 'get_current_user'" />
            </div>

            <h3 class="mt-4">Map Markers Queries</h3>
            <div class="queries-testing__content__buttons mt-2">
                <v-btn class="me-2" text="Get Map Markers" @click="performQuery('map_markers')" variant="outlined"
                    color="primary" :loading="loadingQuery === 'map_markers'"
                    :disabled="loadingQuery === 'map_markers'" />
            </div>

            <h3 class="mt-4">Marker Categories Queries</h3>
            <div class="queries-testing__content__buttons mt-2">
                <v-btn class="me-2" text="Get Marker Categories" @click="performQuery('marker_categories')" variant="outlined"
                    color="primary" :loading="loadingQuery === 'marker_categories'"
                    :disabled="loadingQuery === 'marker_categories'" />
            </div>

            <!-- Results Display -->
            <div v-if="dbData" class="queries-testing__results mt-4">
                <h3 class="queries-testing__results__title">Query Results</h3>
                <pre class="queries-testing__results__display pa-4 mt-2 bg-surface-light">{{ JSON.stringify(dbData, null, 2) }}</pre>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDatabaseVersion, getTables } from '../../database/database'
import { getMapMarkers } from '../../database/queries/map-markers.query'
import { DiscordService } from '../../services/discord.service'
import { getUser } from '../../database/queries/users.query'
import { getMarkerCategories } from '../../database/queries/marker-categories.query'

// Reactive data for database results
const dbData = ref<any>(null)
const loadingQuery = ref<string | null>(null)

// Function to query the database
async function performQuery(queryType: string) {
    loadingQuery.value = queryType
    switch (queryType) {
        case 'version':
            dbData.value = await getDatabaseVersion()
            break
        case 'tables':
            dbData.value = await getTables()
            break
        case 'get_current_user':
            dbData.value = await getUser(DiscordService.getInstance().getUser()?.id as string)
            break
        case 'map_markers':
            dbData.value = await getMapMarkers()
            break
        case 'marker_categories':
            dbData.value = await getMarkerCategories()
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