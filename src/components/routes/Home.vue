<script setup lang="ts">
import { DiscordService } from '../../services/discord.service';
import { computed } from 'vue';
import Map from '../Map.vue';

const discordService = DiscordService.getInstance();
const userLoggedIn = computed(() => {
  return discordService.user.value !== null;
});

const notLoggedInTitle = "You are not logged in";
const notLoggedInMessage = "Please, login to Discord to use the app";
</script>

<template>
  <v-container v-if="userLoggedIn" class="pa-0" fluid>
    <Map />
  </v-container>
  <v-container v-else class="d-flex justify-center align-center" style="height: 100vh">
    <v-card :title="notLoggedInTitle" :text="notLoggedInMessage"></v-card>
  </v-container>
</template>
