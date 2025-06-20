<template>
  <v-responsive>
    <v-app class="app">
      <v-main>
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