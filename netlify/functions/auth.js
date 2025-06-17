import axios from 'axios'

export const handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { code } = JSON.parse(event.body)
    
    if (!code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Authorization code is required' })
      }
    }

    // Dynamic redirect URI
    const getRedirectUri = () => {
      if (process.env.DISCORD_REDIRECT_URI) {
        return process.env.DISCORD_REDIRECT_URI
      }
      // Fallback to localhost for development
      return 'http://localhost:5173/auth/callback'
    }

    const tokenResponse = await axios.post('https://discord.com/api/v10/oauth2/token', 
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: getRedirectUri(),
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    const { access_token } = tokenResponse.data

    // Get user info
    const userResponse = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    const userData = userResponse.data
    const user = {
      id: userData.id,
      username: userData.username,
      discriminator: userData.discriminator,
      avatar: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`,
      email: userData.email
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ user, access_token })
    }
  } catch (error) {
    console.error('Discord OAuth error:', error.response?.data || error.message)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to exchange code for token' })
    }
  }
} 