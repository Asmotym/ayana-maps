# Troubleshooting: 404 on API Routes

## Issue: `/api/auth/discord/token` returns 404

### ✅ What's Working
- Function works when accessed directly: `/.netlify/functions/auth-discord-token`
- Function works locally with redirects
- Function code is correct (no axios import errors)

### ❌ What's Not Working
- Redirect from `/api/auth/discord/token` to `/.netlify/functions/auth-discord-token`

## 🔧 Solutions to Try

### Solution 1: Force Redeploy
Sometimes Netlify caches redirects. Try:
1. Push a small change to trigger redeploy
2. Wait 2-3 minutes for deployment to complete
3. Test again

### Solution 2: Check Netlify Dashboard
1. Go to your Netlify dashboard
2. Navigate to **Site settings > Redirects**
3. Verify the redirect rule exists:
   ```
   /api/auth/discord/token → /.netlify/functions/auth-discord-token
   ```

### Solution 3: Use _redirects File
The `public/_redirects` file should work as a backup. Check if it's deployed:
```bash
curl https://ayana-maps.netlify.app/_redirects
```

### Solution 4: Manual Redirect Test
Test if any redirects work:
```bash
# Test the test function redirect
curl https://ayana-maps.netlify.app/api/test

# Test direct function access
curl https://ayana-maps.netlify.app/.netlify/functions/test
```

### Solution 5: Clear Netlify Cache
1. Go to Netlify dashboard
2. Navigate to **Deploys**
3. Click **Trigger deploy** → **Clear cache and deploy site**

## 🚨 Emergency Workaround

If redirects still don't work, you can temporarily update your frontend to use the direct function URL:

```typescript
// In src/utils/urls.ts, temporarily change:
export const getApiUrl = (endpoint: string): string => {
  // Temporary workaround for redirect issues
  if (endpoint === '/auth/discord/token') {
    return `${getBaseUrl()}/.netlify/functions/auth-discord-token`
  }
  return `${getBackendUrl()}/api${endpoint}`
}
```

## 🔍 Debug Commands

```bash
# Test current status
curl -v https://ayana-maps.netlify.app/api/auth/discord/token

# Test direct function
curl -v https://ayana-maps.netlify.app/.netlify/functions/auth-discord-token

# Check if _redirects is deployed
curl https://ayana-maps.netlify.app/_redirects

# Test local redirects
curl http://localhost:8888/api/auth/discord/token
```

## 📋 Deployment Verification

After deploying, verify these files exist:
- ✅ `netlify.toml` (in root)
- ✅ `public/_redirects` (in public directory)
- ✅ `netlify/functions/auth-discord-token.js`
- ✅ Environment variables set in Netlify dashboard

## 🎯 Expected Behavior

**Working correctly:**
```bash
# Direct function access - should return 400 with error
curl -X POST https://ayana-maps.netlify.app/.netlify/functions/auth-discord-token \
  -H "Content-Type: application/json" \
  -d '{"code":"test"}'
# Response: {"error":"Failed to exchange code for token"}

# API redirect - should return same 400 error
curl -X POST https://ayana-maps.netlify.app/api/auth/discord/token \
  -H "Content-Type: application/json" \
  -d '{"code":"test"}'
# Response: {"error":"Failed to exchange code for token"}
```

**Not working:**
```bash
# API redirect returns 404
curl -X POST https://ayana-maps.netlify.app/api/auth/discord/token \
  -H "Content-Type: application/json" \
  -d '{"code":"test"}'
# Response: 404 Page not found
``` 