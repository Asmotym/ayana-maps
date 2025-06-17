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

    // Exchange code for token using fetch
    const tokenResponse = await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: getRedirectUri(),
      })
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Discord token exchange failed:', errorData)
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Failed to exchange code for token' })
      }
    }

    const tokenData = await tokenResponse.json()
    const { access_token } = tokenData

    // Get user info using fetch
    const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (!userResponse.ok) {
      console.error('Discord user info fetch failed:', await userResponse.text())
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Failed to get user info' })
      }
    }

    const userData = await userResponse.json()
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
    console.error('Discord OAuth error:', error.message)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to exchange code for token' })
    }
  }
} 