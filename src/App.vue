<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import DiscordAuth from './components/DiscordAuth.vue'
import { getDatabaseVersion, getTables } from './database/database'
import { getUsersRights, updateUsersRights } from './database/queries/users-rights.query'
import type { DiscordUser } from '../netlify/core/discord/client'

// Reactive data for database results
const dbData = ref<any>(null)

// Function to query the database
async function performQuery(queryType: string, data?: object) {
  switch (queryType) {
    case 'version':
      dbData.value = await getDatabaseVersion()
      break
    case 'tables':
      dbData.value = await getTables()
      break
    case 'users_rights':
      dbData.value = await getUsersRights()
      break
    case 'update_users_rights':
      dbData.value = await updateUsersRights(data)
      break
  }
}

// Query database when component mounts
onMounted(() => {
  performQuery('version')
})
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Ayana Maps</h1>
      <DiscordAuth />
    </header>
    
    <main class="main-content">
      <!-- Database Status Section -->
      <div class="db-status">
        <!-- Query Controls -->
        <div class="query-controls">
          <h3>Database Queries</h3>
          <div class="query-buttons">
            <button @click="performQuery('version')" class="query-btn">
              Get Version
            </button>
            <button @click="performQuery('tables')" class="query-btn">
              List Tables
            </button>
          </div>
          <h3>Users Rights Queries</h3>
          <div class="query-buttons">
            <button @click="performQuery('users_rights')" class="query-btn">
              Get Users Rights
            </button>
            <button @click="performQuery('update_users_rights', { id: '1234567890', username: 'test', avatar: 'test' } as DiscordUser)" class="query-btn">
              Update Users Rights
            </button>
          </div>
        </div>

        <!-- Results Display -->
        <div v-if="dbData" class="results">
          <h3>Query Results</h3>
          <pre class="results-display">{{ JSON.stringify(dbData, null, 2) }}</pre>
        </div>
      </div>

      <div>
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank">
          <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
      </div>
      <HelloWorld msg="Vite + Vue" />
    </main>
    
    <router-view />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.header h1 {
  margin: 0;
  color: #333;
}

.main-content {
  flex: 1;
  padding: 2rem;
  text-align: center;
}

.db-status {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
}

.db-status h2 {
  margin-top: 0;
  color: #333;
  text-align: center;
}

.db-status h3 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: #495057;
}

.db-status h4 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #6c757d;
}

.loading {
  color: #007bff;
  font-weight: 500;
  text-align: center;
}

.success {
  color: #28a745;
  font-weight: 500;
  text-align: center;
}

.error {
  color: #dc3545;
  font-weight: 500;
  text-align: center;
}

.error-details {
  font-size: 0.9em;
  color: #6c757d;
  margin-top: 0.5rem;
  text-align: center;
}

.query-controls {
  margin-top: 1.5rem;
}

.query-buttons {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.query-btn {
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.query-btn:hover:not(:disabled) {
  background: #0056b3;
}

.query-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.setup-btn {
  background: #28a745;
}

.setup-btn:hover:not(:disabled) {
  background: #1e7e34;
}

.query-examples {
  margin: 0.5rem 0;
}

.query-examples p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #6c757d;
}

.example-btn {
  padding: 0.25rem 0.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  margin-bottom: 0.25rem;
  transition: background-color 0.2s;
}

.example-btn:hover {
  background: #545b62;
}

.custom-query {
  margin-top: 1rem;
}

.query-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  resize: vertical;
  margin-bottom: 0.5rem;
}

.query-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.results {
  margin-top: 1.5rem;
  padding: 1rem;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.results-display {
  background: #f8f9fa;
  color:rgba(0, 0, 0, 1);
  padding: 1rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 300px;
  overflow-y: auto;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
