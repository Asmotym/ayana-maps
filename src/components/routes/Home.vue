<script setup lang="ts">
import { DiscordService } from '../../services/discord.service';
import { computed } from 'vue';
import Map from '../parts/Map.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const discordService = DiscordService.getInstance();
const userLoggedIn = computed(() => {
  return discordService.user.value !== null;
});
</script>

<template>
  <v-container v-if="userLoggedIn" class="pa-0" fluid>
    <Map />
  </v-container>
  <v-container v-else class="d-flex justify-center align-center" style="height: 100vh">
    <v-card :title="t('home.not_logged_in_title')" :text="t('home.not_logged_in_message')"></v-card>
  </v-container>
</template>
