# Deployment Checklist for Netlify

## ✅ Pre-Deployment Checklist

### 1. Environment Variables
Set these in your Netlify dashboard under **Site settings > Environment variables**:

```
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_REDIRECT_URI=https://your-site.netlify.app/auth/callback
FRONTEND_URL=https://your-site.netlify.app
```

### 2. Discord OAuth Configuration
- Go to [Discord Developer Portal](https://discord.com/developers/applications)
- Add redirect URI: `https://your-site.netlify.app/auth/callback`
- Save changes

### 3. File Structure Verification
Ensure these files exist:
```
netlify/
├── functions/
│   ├── auth-discord-token.js  ✅
│   └── test.js               ✅
└── netlify.toml              ✅
```

## 🔧 Troubleshooting 404 Error

### Step 1: Test Function Directly
Try accessing the function directly:
```
https://your-site.netlify.app/.netlify/functions/auth-discord-token
```

### Step 2: Test Redirect
Try accessing via the API route:
```
https://your-site.netlify.app/api/auth/discord/token
```

### Step 3: Check Netlify Function Logs
1. Go to your Netlify dashboard
2. Navigate to **Functions** tab
3. Check for any error logs

### Step 4: Verify Deployment
1. Check that the latest code is deployed
2. Verify `netlify.toml` is in the root directory
3. Ensure functions directory is correct

## 🚀 Deployment Steps

### Option 1: Git Deployment
1. Push all changes to your repository
2. Netlify will automatically redeploy
3. Check deployment logs for errors

### Option 2: Manual Deploy
```bash
# Install Netlify CLI if not already installed
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

## 🧪 Testing

### Test Function Locally
```bash
npm run dev:netlify
curl http://localhost:8888/api/test
curl http://localhost:8888/api/auth/discord/token
```

### Test Function on Netlify
```bash
# Test the test function
curl https://your-site.netlify.app/api/test

# Test the OAuth function (will return error with fake code)
curl -X POST https://your-site.netlify.app/api/auth/discord/token \
  -H "Content-Type: application/json" \
  -d '{"code":"test"}'
```

## 📝 Common Issues

### Issue: 404 on API routes
**Solution**: Check that `netlify.toml` redirects are correct and deployed

### Issue: Function not found
**Solution**: Verify function file exists in `netlify/functions/` directory

### Issue: Environment variables not working
**Solution**: Check Netlify dashboard environment variables are set correctly

### Issue: CORS errors
**Solution**: Ensure `FRONTEND_URL` environment variable is set correctly

## 🔍 Debug Commands

```bash
# Check if functions are working locally
curl http://localhost:8888/.netlify/functions/test

# Check redirects locally
curl http://localhost:8888/api/test

# Check function structure
ls -la netlify/functions/

# Check netlify.toml syntax
cat netlify.toml
``` 