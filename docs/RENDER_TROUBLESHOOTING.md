# 🔧 Render Troubleshooting Checklist

## Step 1: Check Render Service Settings

Go to your Render dashboard → `unistudy-api` service → Settings

### Build & Deploy

- [ ] **Root Directory**: Should be `apps/server` (not root!)
- [ ] **Build Command**: `npm install && npm run build`
- [ ] **Start Command**: `npm run start:prod` (NOT `npm start`)

### Environment Variables (click "Environment" tab)

Copy this list and verify each one is set:

```bash
# Core (REQUIRED - app won't boot without these)
DATABASE_URL=postgresql://...             # ✅ Set?
JWT_SECRET=<32_char_random_string>        # ✅ Set?
JWT_REFRESH_SECRET=<different_random>     # ✅ Set?
GEMINI_API_KEY=AIza...                    # ✅ Set?
NODE_ENV=production                        # ✅ Set?

# CORS (REQUIRED - frontend will get network errors)
ALLOWED_ORIGINS=https://unistudynaija.vercel.app,https://www.unistudynaija.vercel.app
APP_URL=https://unistudynaija.vercel.app

# Admin (REQUIRED for admin login)
ADMIN_EMAIL=admin@yourdomain.com          # ✅ Set?
ADMIN_PASSWORD=<strong_password>          # ✅ Set? (NOT default!)

# Email (optional but recommended)
EMAIL_PROVIDER=console                     # or smtp/sendgrid
EMAIL_FROM=noreply@unistudy.ng

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

### Health Check Path

- [ ] Set to: `/api/health`

---

## Step 2: Check Build Logs

1. Go to Render → Your Service → "Events" tab
2. Click the latest deployment
3. Look for these in build logs:

**✅ Good signs:**

```
==> Running 'npm install && npm run build'
==> Prisma generated successfully
==> Build successful
```

**❌ Red flags:**

```
Error: Cannot find module '@prisma/client'
  → Fix: Add DATABASE_URL to build environment variables

Error: Command "build" not found
  → Fix: Wrong root directory (should be apps/server)

ENOENT: no such file or directory
  → Fix: Check Root Directory is apps/server
```

---

## Step 3: Check Runtime Logs

Go to Render → Your Service → "Logs" tab

**✅ App is running:**

```
🚀 Server running on http://0.0.0.0:10000
📚 API Documentation: http://0.0.0.0:10000/api/docs
🔒 Security: Helmet enabled, CORS configured
⚡ Environment: production
```

**❌ App crashed:**

```
Error: Cannot find module './health/health.service'
  → Fix: Build didn't complete. Check build command.

Error connecting to database
  → Fix: Check DATABASE_URL is correct

UnhandledPromiseRejectionWarning
  → Fix: Missing environment variable (check logs for which one)
```

---

## Step 4: Test API Directly

### Test 1: Health Check

```bash
curl https://unistudy-api.onrender.com/api/health
```

**Expected response:**

```json
{
  "status": "ok",
  "uptime": 12345,
  "database": {
    "status": "connected",
    "responseTime": "15ms"
  },
  "memory": {
    "used": "120MB",
    "total": "512MB",
    "percentage": "23.4%"
  }
}
```

**If it fails:**

- 404 → Service is running but `/api/health` endpoint not found (check build)
- 503 → Service crashed (check runtime logs)
- Timeout → Service not responding (check if service is sleeping on free tier)

### Test 2: Registration Endpoint

```bash
curl -X POST https://unistudy-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234",
    "firstName": "Test",
    "lastName": "User",
    "department": "Computer Science",
    "faculty": "Science",
    "level": "100",
    "university": "University of Lagos"
  }'
```

**Expected response:** 201 Created with user data

**Common errors:**

- CORS error → Set ALLOWED_ORIGINS
- 400 Bad Request → Missing required field
- 409 Conflict → Email already exists
- 500 Server Error → Check runtime logs

---

## Step 5: Fix CORS Issues (Most Common!)

If frontend shows "Network Error" but API is running:

### Check CORS in browser DevTools

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try registration again
4. Click the failed request
5. Look for error message:

**❌ CORS blocked:**

```
Access to XMLHttpRequest at 'https://unistudy-api.onrender.com/api/auth/register'
from origin 'https://unistudynaija.vercel.app' has been blocked by CORS policy
```

**✅ Fix:** Add to Render environment variables:

```bash
ALLOWED_ORIGINS=https://unistudynaija.vercel.app,https://www.unistudynaija.vercel.app
```

Then redeploy (Render → Service → Manual Deploy → "Clear build cache & deploy")

---

## Step 6: Database Connection Issues

### Symptom: App crashes with database errors

**Check logs for:**

```
Error: P1001: Can't reach database server
Error: ENOTFOUND
Error: Connection terminated unexpectedly
```

**Fix:**

1. Verify DATABASE_URL format:

   ```bash
   # ✅ Correct (Session Pooler - IPv4)
   postgresql://user:pass@aws-0-region.pooler.supabase.com:5432/postgres

   # ❌ Wrong (Direct connection - IPv6, doesn't work on Render)
   postgresql://user:pass@db.xxxxx.supabase.co:5432/postgres
   ```

2. Test connection from Render Shell:
   ```bash
   # Go to Render → Service → Shell
   node -e "const { PrismaClient } = require('@prisma/client'); const p = new PrismaClient(); p.$connect().then(() => console.log('✅ Connected')).catch(e => console.error('❌', e))"
   ```

---

## Step 7: Common Quick Fixes

### Fix 1: Service is sleeping (free tier)

**Symptom:** First request takes 30-60 seconds, then works

**Solution:** Upgrade to Starter ($7/mo) or add a cron job to ping every 10 minutes:

```bash
# Use UptimeRobot or similar to ping:
https://unistudy-api.onrender.com/api/health
```

### Fix 2: Build cache issues

**Symptom:** Changes deployed but app still has old behavior

**Solution:** Manual deploy with cache clear:

1. Render → Service → Manual Deploy
2. Check "Clear build cache"
3. Click "Deploy"

### Fix 3: Missing Prisma client

**Symptom:** `Cannot find module '@prisma/client'`

**Solution:** Add to build command:

```bash
npm install && npx prisma generate && npm run build
```

### Fix 4: Port issues

**Symptom:** App logs show "Port 3001 already in use"

**Solution:** Verify `main.ts` reads PORT from env:

```typescript
const port = process.env.PORT || 3001; // ✅ Correct
```

---

## 📞 Get Help

If none of these work, provide these 3 things:

1. **Build log** (last 50 lines from Events → Latest Deploy)
2. **Runtime log** (last 50 lines from Logs tab)
3. **Environment variables** (list names only, not values!)

Example:

```
Build log:
==> Running 'npm install && npm run build'
... [paste here]

Runtime log:
🚀 Server running on...
... [paste here]

Env vars set:
- DATABASE_URL ✅
- JWT_SECRET ✅
- GEMINI_API_KEY ❌ (missing!)
```

---

## ✅ Success Checklist

When everything is working:

- [ ] Health check returns 200 OK
- [ ] API docs load at /api/docs
- [ ] Registration works from frontend
- [ ] Login works from frontend
- [ ] No CORS errors in browser console
- [ ] Response time < 500ms
- [ ] Database queries work
- [ ] Email service logs properly (or sends emails)

🎉 **Your app is production-ready!**
