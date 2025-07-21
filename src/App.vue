<template>
  <v-responsive>
    <v-app>
      <v-main class="app">
        <Header />
        <router-view />
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script setup lang="ts">
import Header from './components/header/Header.vue';
</script>

<style scoped>
.app {
  max-height: 100vh;
  overflow-y: hidden;
}
</style>