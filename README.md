# Atlas Maps

A Vue 3 + TypeScript application for interactive mapping with Discord OAuth integration, deployed on Netlify.

## Features

- Interactive maps using Leaflet
- Discord OAuth authentication
- Serverless backend using Netlify Functions
- Modern Vue 3 composition API
- TypeScript support

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Discord application with OAuth2 configured

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (create a `.env` file):
   ```
   VITE_DISCORD_CLIENT_ID=your_discord_client_id
   VITE_REDIRECT_URI=http://localhost:5173/auth/callback
   VITE_BACKEND_URL=http://localhost:8888
   ```

3. Start the development server:
   ```bash
   npm run dev:netlify
   ```

This will start both the Vite dev server and Netlify functions locally.

## Deployment

This application is configured for deployment on Netlify. See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

1. Push your code to a Git repository
2. Connect to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy!

## Project Structure

```
├── netlify/
│   ├── functions/
│   │   └── auth.js          # Discord OAuth serverless function
│   └── netlify.toml         # Netlify configuration
├── src/
│   ├── components/
│   │   ├── DiscordAuth.vue  # Discord OAuth component
│   │   ├── HelloWorld.vue   # Example component
│   │   └── Map.vue          # Interactive map component
│   ├── router/
│   │   └── index.ts         # Vue Router configuration
│   └── utils/
│       └── urls.ts          # Dynamic URL utilities
└── server.js                # Legacy Express server (can be removed)
```

## Technologies Used

- **Frontend**: Vue 3, TypeScript, Vite
- **Maps**: Leaflet, Vue Leaflet
- **Authentication**: Discord OAuth2
- **Backend**: Netlify Functions
- **Deployment**: Netlify

## Learn More

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Guide](https://vuejs.org/guide/typescript/overview.html)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Discord OAuth2](https://discord.com/developers/docs/topics/oauth2)
