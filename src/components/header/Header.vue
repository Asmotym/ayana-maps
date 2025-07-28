<template>
    <v-app-bar>
        <template v-slot:prepend>
            <v-app-bar-title class="ml-2">{{ t('common.title') }}</v-app-bar-title>
        </template>

        <v-container class="d-flex justify-center align-center">
            <v-btn variant="text" :to="{ name: Routes.Home }">
                <span>{{ t('navigation.home') }}</span>
            </v-btn>
    
            <v-btn v-if="isUserLoggedIn && userHasTestingGroundRights" variant="text" :to="{ name: Routes.TestingGround }">
                <span>{{ t('navigation.testing_ground') }}</span>
            </v-btn>
        </v-container>

        <template v-slot:append>    
            <LanguageSwitcher />
            <DiscordAuth />
        </template>
    </v-app-bar>
</template>

<script setup lang="ts">
import type { DiscordUser } from '../../../netlify/core/types/discord.types';
import { UserRights } from '../../../netlify/core/types/enum.types';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import DiscordAuth from './DiscordAuth.vue';
import LanguageSwitcher from '../header/LanguageSwitcher.vue';
import { Routes } from '../../router';
import { DiscordService } from '../../services/discord.service';
import { store } from '../../store/index.store'

const { t } = useI18n();
const discordService = DiscordService.getInstance();
const user = computed<DiscordUser | null>(() => {
  return discordService.user.value;
});
const isUserLoggedIn = computed(() => user.value !== null);
const userHasTestingGroundRights = ref(false);

onMounted(async () => {
    const user = DiscordService.getInstance().getUser();
    if (!user) return;
    userHasTestingGroundRights.value = await store.user().isUserAuthorized(user.id, UserRights.TESTING_GROUND);
});
</script>

<style scoped>
.header-title {
    font-size: 1.8rem;
    font-weight: bold;
    margin: 0;
}
</style>