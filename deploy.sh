#!/bin/bash

echo "🚀 Deploying to Netlify..."

# Build the project
echo "📦 Building project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Check if netlify.toml exists
if [ ! -f "netlify.toml" ]; then
    echo "❌ netlify.toml not found!"
    exit 1
fi

# Check if functions exist
if [ ! -f "netlify/functions/auth-discord-token.js" ]; then
    echo "❌ Function auth-discord-token.js not found!"
    exit 1
fi

# Check if _redirects exists
if [ ! -f "public/_redirects" ]; then
    echo "❌ _redirects file not found!"
    exit 1
fi

echo "✅ All files present and build successful!"
echo ""
echo "📋 Deployment checklist:"
echo "1. Push changes to your Git repository"
echo "2. Netlify will automatically deploy"
echo "3. Check Netlify dashboard for deployment status"
echo "4. Verify environment variables are set:"
echo "   - DISCORD_CLIENT_ID"
echo "   - DISCORD_CLIENT_SECRET"
echo "   - DISCORD_REDIRECT_URI"
echo "   - FRONTEND_URL"
echo ""
echo "🧪 Test after deployment:"
echo "curl -X POST https://ayana-maps.netlify.app/api/auth/discord/token \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"code\":\"test\"}'"
echo ""
echo "🔍 Debug if issues persist:"
echo "1. Check Netlify function logs"
echo "2. Verify redirects in Netlify dashboard"
echo "3. Test function directly: /.netlify/functions/auth-discord-token" 