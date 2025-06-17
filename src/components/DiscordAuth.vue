<template>
  <div class="discord-auth">
    <div v-if="!user" class="login-section">
      <button @click="login" class="discord-btn" :disabled="loading">
        <svg class="discord-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
        {{ loading ? 'Processing...' : 'Continue with Discord' }}
      </button>
    </div>
    
    <div v-else class="user-section">
      <div class="user-info">
        <img :src="user.avatar" :alt="user.username" class="user-avatar" />
        <div class="user-details">
          <h4>{{ user.username }}</h4>
          <p class="user-discriminator">#{{ user.discriminator }}</p>
        </div>
      </div>
      <button @click="logout" class="logout-btn">Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRedirectUri, getApiUrl } from '../utils/urls'

interface DiscordUser {
  id: string
  username: string
  discriminator: string
  avatar: string
  email?: string
}

const user = ref<DiscordUser | null>(null)
const loading = ref(false)

// Discord OAuth configuration
const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID
const REDIRECT_URI = getRedirectUri()
const DISCORD_API_URL = 'https://discord.com/api/v10'

const login = () => {
  const state = generateRandomString(32)
  localStorage.setItem('discord_oauth_state', state)
  
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'identify email',
    state: state
  })
  
  window.location.href = `${DISCORD_API_URL}/oauth2/authorize?${params.toString()}`
}

const logout = () => {
  user.value = null
  localStorage.removeItem('discord_access_token')
  localStorage.removeItem('discord_user')
}

const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const exchangeCodeForToken = async (code: string): Promise<{ user: DiscordUser; access_token: string }> => {
  const response = await fetch(getApiUrl('/auth/discord/token'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  })

  if (!response.ok) {
    throw new Error('Failed to exchange code for token')
  }

  return await response.json()
}

const handleAuthCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const state = urlParams.get('state')
  const savedState = localStorage.getItem('discord_oauth_state')

  if (code && state && state === savedState) {
    try {
      loading.value = true
      const { user: userInfo, access_token } = await exchangeCodeForToken(code)
      
      localStorage.setItem('discord_access_token', access_token)
      localStorage.setItem('discord_user', JSON.stringify(userInfo))
      user.value = userInfo
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    } catch (error) {
      console.error('Auth error:', error)
    } finally {
      loading.value = false
    }
  }
}

onMounted(() => {
  // Check if user is already logged in
  const savedUser = localStorage.getItem('discord_user')
  if (savedUser) {
    user.value = JSON.parse(savedUser)
  }
  
  // Handle OAuth callback
  if (window.location.search.includes('code=')) {
    handleAuthCallback()
  }
})
</script>

<style scoped>
.discord-auth {
  padding: 20px;
  border-radius: 8px;
}

.login-section {
  text-align: center;
}

.discord-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #5865f2;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.discord-btn:hover:not(:disabled) {
  background: #4752c4;
}

.discord-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.discord-icon {
  width: 20px;
  height: 20px;
}

.user-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #e9ecef;
}

.user-details h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.user-discriminator {
  margin: 0;
  font-size: 14px;
  color: #6c757d;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background: #c82333;
}
</style> 