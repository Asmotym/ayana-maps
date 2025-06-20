<script setup lang="ts">
import HelloWorld from '../HelloWorld.vue'
import { DiscordService } from '../../services/discord.service';
import { computed } from 'vue';

const discordService = DiscordService.getInstance();
const userLoggedIn = computed(() => {
  return discordService.user.value !== null;
});

const notLoggedInTitle = "You are not logged in";
const notLoggedInMessage = "Please, login to Discord to use the app";
</script>

<template>
  <div v-if="userLoggedIn">
    <HelloWorld />
  </div>
  <div v-else class="d-flex justify-center align-center" style="height: 100vh">
    <v-card :title="notLoggedInTitle" :text="notLoggedInMessage"></v-card>
  </div>
</template>
