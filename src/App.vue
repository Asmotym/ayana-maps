<template>
  <v-responsive>
    <v-app>
      <v-main class="app">
        <router-view />
      </v-main>
    </v-app>
  </v-responsive>
</template>


<style scoped>
.app {
  max-height: 100vh;
  overflow-y: hidden;
}
</style>