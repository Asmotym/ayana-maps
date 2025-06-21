<template>
    <v-app-bar>
        <template v-slot:prepend>
            <v-app-bar-title>Ayana Maps</v-app-bar-title>
        </template>

        <v-btn variant="text" :to="{ name: Routes.Home }">
            <span>Home</span>
        </v-btn>

        <v-btn v-if="isUserLoggedIn && userHasTestingGroundRights" variant="text" :to="{ name: Routes.TestingGround }">
            <span>Testing Ground</span>
        </v-btn>

        <template v-slot:append>    
            <DiscordAuth />
        </template>
    </v-app-bar>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import DiscordAuth from './DiscordAuth.vue';
import { Routes } from '../router';
import type { DiscordUser } from '../../netlify/core/discord/client';
import { isUserAuthorized } from '../database/queries/users.query';
import { UserRights } from '../../netlify/core/database/types';
import { DiscordService } from '../services/discord.service';

interface HeaderProps {
    user: DiscordUser | null;
}

const props = defineProps<HeaderProps>();
const user = computed<DiscordUser | null>(() => props.user);
const isUserLoggedIn = computed(() => user.value !== null);
const userHasTestingGroundRights = ref(false);

onMounted(async () => {
    const user = DiscordService.getInstance().getUser();
    if (!user) return;
    userHasTestingGroundRights.value = await isUserAuthorized(user.id, UserRights.TESTING_GROUND);
});
</script>

<style scoped>
.header-title {
    font-size: 1.8rem;
    font-weight: bold;
    margin: 0;
}
</style>