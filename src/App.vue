<template>
  <v-responsive>
    <v-app>
      <v-main class="app">
        <Header :user="user" />
        <router-view />
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script setup lang="ts">
import Header from './components/Header.vue';
import { DiscordService } from './services/discord.service';
import { computed, ref } from 'vue';
import type { DiscordUser } from '../netlify/core/discord/client';

const discordService = DiscordService.getInstance();
const user = computed<DiscordUser | null>(() => {
  return discordService.user.value;
});
</script>

<style scoped>
.app {
  max-height: 100vh;
  overflow-y: hidden;
}
</style>