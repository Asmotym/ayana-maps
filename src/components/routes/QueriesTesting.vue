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
                <v-btn class="me-2" text="Get Users Rights" @click="performQuery('users_rights')" variant="outlined"
                    color="primary" :loading="loadingQuery === 'users_rights'"
                    :disabled="loadingQuery === 'users_rights'" />
                <v-btn class="me-2" text="Update Users Rights"
                    @click="performQuery('update_users_rights', { id: '1234567890', username: 'test', avatar: 'test' } as DiscordUser)"
                    variant="outlined" color="primary" :loading="loadingQuery === 'update_users_rights'"
                    :disabled="loadingQuery === 'update_users_rights'" />
                <v-btn class="me-2" text="Get Map Markers" @click="performQuery('map_markers')" variant="outlined"
                    color="primary" :loading="loadingQuery === 'map_markers'"
                    :disabled="loadingQuery === 'map_markers'" />
            </div>

            <h3 class="mt-4">Users Rights Queries</h3>
            <div class="queries-testing__content__buttons mt-2">
                <v-btn class="me-2" text="Get Users Rights" @click="performQuery('users_rights')" variant="outlined"
                    color="primary" :loading="loadingQuery === 'users_rights'"
                    :disabled="loadingQuery === 'users_rights'" />
                <v-btn class="me-2" text="Update Users Rights"
                    @click="performQuery('update_users_rights', { id: '1234567890', username: 'test', avatar: 'test' } as DiscordUser)"
                    variant="outlined" color="primary" :loading="loadingQuery === 'update_users_rights'"
                    :disabled="loadingQuery === 'update_users_rights'" />
            </div>

            <h3 class="mt-4">Map Markers Queries</h3>
            <div class="queries-testing__content__buttons mt-2">
                <v-btn class="me-2" text="Get Map Markers" @click="performQuery('map_markers')" variant="outlined"
                    color="primary" :loading="loadingQuery === 'map_markers'"
                    :disabled="loadingQuery === 'map_markers'" />
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
import { getUsersRights, updateUsersRights } from '../../database/queries/users-rights.query'
import { getMapMarkers } from '../../database/queries/map-markers.query'
import type { DiscordUser } from '../../../netlify/core/discord/client'

// Reactive data for database results
const dbData = ref<any>(null)
const loadingQuery = ref<string | null>(null)

// Function to query the database
async function performQuery(queryType: string, data?: object) {
    loadingQuery.value = queryType
    switch (queryType) {
        case 'version':
            dbData.value = await getDatabaseVersion()
            break
        case 'tables':
            dbData.value = await getTables()
            break
        case 'users_rights':
            dbData.value = await getUsersRights()
            break
        case 'update_users_rights':
            dbData.value = await updateUsersRights(data)
            break
        case 'map_markers':
            dbData.value = await getMapMarkers()
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