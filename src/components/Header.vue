<template>
    <v-app-bar>
        <v-app-bar-title>Ayana Maps</v-app-bar-title>
        <v-spacer></v-spacer>
        <DiscordAuth />
    </v-app-bar>
</template>

<script setup lang="ts">
import DiscordAuth from './DiscordAuth.vue';
import { VAppBar, VAppBarTitle, VSpacer } from 'vuetify/components';
</script>

<style scoped>
.header-title {
    font-size: 1.8rem;
    font-weight: bold;
    margin: 0;
}
</style>