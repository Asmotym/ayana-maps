# Discord OAuth Setup Guide

## Prerequisites

1. A Discord application (create one at https://discord.com/developers/applications)
2. Node.js and npm installed

## Setup Steps

### 1. Create a Discord Application

1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Give your application a name (e.g., "Atlas Maps")
4. Go to the "OAuth2" section in the left sidebar
5. Copy your "Client ID" and "Client Secret"

### 2. Configure OAuth2 Redirect

1. In the OAuth2 section, add the following redirect URI:
   ```
   http://localhost:5173/auth/callback
   ```
   **Note**: For production, update this to your production domain
2. Save the changes

### 3. Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Required Discord OAuth credentials
VITE_DISCORD_CLIENT_ID=your_discord_client_id_here

# Backend environment variables
DISCORD_CLIENT_ID=your_discord_client_id_here
DISCORD_CLIENT_SECRET=your_discord_client_secret_here
PORT=3001

# Optional: Override dynamic URLs (only needed for custom configurations)
# VITE_BACKEND_URL=https://your-backend-domain.com
# VITE_REDIRECT_URI=https://your-frontend-domain.com/auth/callback
# VITE_BACKEND_PORT=3001
# FRONTEND_URL=https://your-frontend-domain.com
# DISCORD_REDIRECT_URI=https://your-frontend-domain.com/auth/callback
```

Replace `your_discord_client_id_here` and `your_discord_client_secret_here` with the actual values from your Discord application.

### 4. Install Dependencies

```bash
npm install
```

### 5. Start the Backend Server

In one terminal:
```bash
npm run server
```

### 6. Start the Frontend Development Server

In another terminal:
```bash
npm run dev
```

### 7. Start Both Servers Together (Recommended)

```bash
npm run dev:full
```

## Features

- **Dynamic URL Generation**: Automatically adapts to different environments and domains
- **Secure OAuth Flow**: Token exchange happens on the backend server, keeping your client secret secure
- **Login with Discord**: Users can authenticate using their Discord account
- **User Profile Display**: Shows user avatar, username, and discriminator
- **State Validation**: Implements proper state validation to prevent CSRF attacks
- **Persistent Login**: User session persists across browser refreshes
- **Logout Functionality**: Users can log out and clear their session
- **Loading States**: Visual feedback during authentication process

## Dynamic URL Configuration

The application now uses dynamic URL generation that automatically adapts to different environments:

### Frontend URLs
- **Base URL**: Automatically detected from `window.location.origin`
- **Redirect URI**: `${baseUrl}/auth/callback`
- **Backend URL**: Automatically detected from current hostname with configurable port

### Environment Variables Priority
1. **Explicit Environment Variables**: If set, these take precedence
2. **Dynamic Detection**: Automatically detected from current environment
3. **Development Fallbacks**: Localhost URLs for development

### URL Utility Functions
- `getBaseUrl()`: Returns the current base URL
- `getBackendUrl()`: Returns the backend server URL
- `getRedirectUri()`: Returns the OAuth redirect URI
- `getApiUrl(endpoint)`: Returns full API endpoint URL

## Security Features

- **Backend Token Exchange**: Client secret is never exposed to the frontend
- **CORS Protection**: Backend server configured with proper CORS settings
- **State Validation**: OAuth state parameter prevents CSRF attacks
- **Environment Variables**: Sensitive data stored in environment variables
- **Error Handling**: Proper error handling and logging

## File Structure

```
atlas-maps/
├── src/
│   ├── components/
│   │   └── DiscordAuth.vue      # Discord OAuth component
│   ├── utils/
│   │   └── urls.ts              # Dynamic URL utilities
│   ├── router/
│   │   └── index.ts             # Vue Router configuration
│   ├── App.vue                  # Main app component
│   └── main.ts                  # App entry point
├── server.js                    # Backend server for OAuth
├── package.json                 # Dependencies
└── DISCORD_OAUTH_SETUP.md       # This setup guide
```

## Production Deployment

For production deployment:

1. **Update Discord Application**:
   - Change the redirect URI in your Discord application to match your production domain
   - Update environment variables with production URLs

2. **Backend Server**:
   - Deploy the `server.js` to a secure server (Heroku, Vercel, etc.)
   - Set production environment variables:
     ```env
     DISCORD_CLIENT_ID=your_production_client_id
     DISCORD_CLIENT_SECRET=your_production_client_secret
     DISCORD_REDIRECT_URI=https://your-domain.com/auth/callback
     FRONTEND_URL=https://your-domain.com
     PORT=3001
     ```
   - Use HTTPS in production

3. **Frontend**:
   - Set production environment variables:
     ```env
     VITE_DISCORD_CLIENT_ID=your_production_client_id
     VITE_BACKEND_URL=https://your-backend-domain.com
     VITE_REDIRECT_URI=https://your-domain.com/auth/callback
     ```
   - Build and deploy the frontend

4. **Security Considerations**:
   - Use environment variables for all sensitive data
   - Implement rate limiting on the backend
   - Use HTTPS in production
   - Consider implementing session management with secure cookies
   - Add proper logging and monitoring

## Environment-Specific Configuration

### Development
```env
# No additional configuration needed - uses dynamic detection
VITE_DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
```

### Staging
```env
VITE_DISCORD_CLIENT_ID=your_client_id
VITE_BACKEND_URL=https://staging-api.yourdomain.com
VITE_REDIRECT_URI=https://staging.yourdomain.com/auth/callback
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_REDIRECT_URI=https://staging.yourdomain.com/auth/callback
FRONTEND_URL=https://staging.yourdomain.com
```

### Production
```env
VITE_DISCORD_CLIENT_ID=your_client_id
VITE_BACKEND_URL=https://api.yourdomain.com
VITE_REDIRECT_URI=https://yourdomain.com/auth/callback
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_REDIRECT_URI=https://yourdomain.com/auth/callback
FRONTEND_URL=https://yourdomain.com
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the backend server is running and CORS is properly configured
2. **Invalid Redirect URI**: Ensure the redirect URI in Discord matches exactly what you've configured
3. **Missing Environment Variables**: Check that all required environment variables are set
4. **State Mismatch**: Clear browser storage if you encounter state validation errors
5. **Dynamic URL Issues**: Check the browser console for URL generation logs

### Debug Mode

To enable debug logging, add this to your backend environment:
```env
DEBUG=true
```

The server will log the detected URLs on startup:
```
Server running on port 3001
CORS origin: http://localhost:5173
Redirect URI: http://localhost:5173/auth/callback
```

## API Endpoints

### POST /api/auth/discord/token

Exchanges Discord authorization code for access token and user info.

**Request Body:**
```json
{
  "code": "discord_authorization_code"
}
```

**Response:**
```json
{
  "user": {
    "id": "discord_user_id",
    "username": "username",
    "discriminator": "1234",
    "avatar": "https://cdn.discordapp.com/avatars/...",
    "email": "user@example.com"
  },
  "access_token": "discord_access_token"
}
``` 