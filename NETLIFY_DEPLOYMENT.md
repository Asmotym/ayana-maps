# Netlify Deployment Guide

This guide will help you deploy your Atlas Maps application to Netlify with Discord OAuth integration.

## Prerequisites

1. A Netlify account
2. A Discord application with OAuth2 configured
3. Git repository with your code

## Environment Variables

Set these environment variables in your Netlify dashboard under **Site settings > Environment variables**:

### Required Variables

```
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_REDIRECT_URI=https://your-site.netlify.app/auth/callback
FRONTEND_URL=https://your-site.netlify.app
```

### Frontend Variables (VITE_*)

```
VITE_DISCORD_CLIENT_ID=your_discord_client_id
VITE_REDIRECT_URI=https://your-site.netlify.app/auth/callback
VITE_BACKEND_URL=https://your-site.netlify.app
```

## Discord OAuth Configuration

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to **OAuth2 > General**
4. Add your Netlify redirect URI: `https://your-site.netlify.app/auth/callback`
5. Save the changes

## Deployment Steps

### Option 1: Deploy via Git (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Netlify
3. Set the build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
4. Deploy

### Option 2: Deploy via Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize and deploy:
   ```bash
   netlify init
   netlify deploy --prod
   ```

## Local Development

To test the Netlify functions locally:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev:netlify
   ```

This will start both the Vite dev server and Netlify functions locally.

## File Structure

The application has been restructured for Netlify:

```
├── netlify/
│   ├── functions/
│   │   └── auth.js          # Discord OAuth serverless function
│   └── netlify.toml         # Netlify configuration
├── src/
│   ├── components/
│   │   └── DiscordAuth.vue  # Frontend OAuth component
│   └── utils/
│       └── urls.ts          # Dynamic URL utilities
└── server.js                # (Legacy Express server - can be removed)
```

## Troubleshooting

### CORS Issues
- Ensure `FRONTEND_URL` is set correctly in Netlify environment variables
- Check that the redirect URI matches exactly in Discord Developer Portal

### Function Not Found
- Verify the function is in the correct directory: `netlify/functions/`
- Check that the function name matches the file name (without extension)

### Build Errors
- Ensure all dependencies are in `package.json`
- Check that Node.js version is compatible (18+ recommended)

## Migration from Express Server

The Express server (`server.js`) has been converted to a Netlify serverless function (`netlify/functions/auth.js`). The functionality remains the same, but it's now serverless and optimized for Netlify's infrastructure.

You can remove the `server.js` file and the `express` and `cors` dependencies from `package.json` if you're no longer using them for local development. 