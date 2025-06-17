import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Dynamic CORS origin
const getCorsOrigin = () => {
  if (process.env.FRONTEND_URL) {
    return process.env.FRONTEND_URL
  }
}

app.use(cors({
  origin: getCorsOrigin(),
  credentials: true
}))

app.use(express.json())

// Discord OAuth token exchange endpoint
app.post('/api/auth/discord/token', async (req, res) => {
  try {
    const { code } = req.body
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' })
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

    res.json({ user, access_token })
  } catch (error) {
    console.error('Discord OAuth error:', error.response?.data || error.message)
    res.status(500).json({ error: 'Failed to exchange code for token' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`CORS origin: ${getCorsOrigin()}`)
  console.log(`Redirect URI: ${process.env.DISCORD_REDIRECT_URI}`)
}) 