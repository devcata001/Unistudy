# 🚨 URGENT: Backend Not Running on Render - Fix Checklist

## The Problem

- ❌ Backend not responding (Network Error)
- ❌ Admin dashboard showing errors
- ❌ Frontend can't connect to API

## Root Cause: Service Not Starting Properly

This usually happens when:

1. Wrong **root directory** (must be `apps/server`)
2. Wrong **build command**
3. Wrong **start command**
4. Missing **environment variables**
5. Database connection fails silently

---

## 🔧 IMMEDIATE FIXES (Do These Now)

### Step 1: Fix Render Service Settings

Go to **Render Dashboard** → Your Backend Service → **Settings**

#### ✅ General

- **Name**: unistudy-api
- **Environment**: Node
- **Plan**: Starter (or higher)
- **Region**: Oregon (or your preferred)

#### ✅ Build & Deploy

- **Root Directory**: `apps/server` ← **CRITICAL**
- **Build Command**: `npm install && npm run build` ← **MUST BE EXACT**
- **Start Command**: `npm run start:prod` ← **NOT `npm start`**
- **Auto Deploy**: On (checked)
- **Branch**: main

#### ✅ Health Check

- **Path**: `/api/health`
- **Enabled**: Yes

### Step 2: Add ALL Environment Variables

Go to **Render Dashboard** → Your Backend Service → **Environment**

**Add these (REQUIRED - app won't start without them):**

```
DATABASE_URL = postgresql://user:pass@host:port/db
JWT_SECRET = (generate: openssl rand -base64 32)
JWT_REFRESH_SECRET = (generate: openssl rand -base64 32, DIFFERENT from above)
GEMINI_API_KEY = AIza... (from Google AI Studio)
NODE_ENV = production
ALLOWED_ORIGINS = https://unistudynaija.vercel.app,https://www.unistudynaija.vercel.app
APP_URL = https://unistudynaija.vercel.app
ADMIN_EMAIL = admin@yourdomain.com
ADMIN_PASSWORD = Your_Secure_Password_123
EMAIL_FROM = noreply@unistudy.ng
THROTTLE_TTL = 60000
THROTTLE_LIMIT = 100
```

**Optional (but recommended):**

```
ADMIN_USERNAME = admin (default is fine)
EMAIL_PROVIDER = console (or smtp for real emails)
```

### Step 3: Deploy with Cache Clear

1. Click **"Manual Deploy"** button
2. Check **"Clear build cache"** ← THIS IS IMPORTANT
3. Click **"Deploy"**
4. Wait 3-5 minutes

### Step 4: Check Build Logs

1. Click **"Events"** tab
2. Click your latest deployment
3. Look for these SUCCESS messages:

   ```
   ==> Running 'npm install && npm run build'
   ==> npm run build succeeded
   ==> Deploying...
   ```

4. Look for these ERROR messages (if present, let me know):
   ```
   Cannot find module '@prisma/client'
   Error: ENOENT (file not found)
   error TS2307 (TypeScript error)
   prisma generate failed
   ```

### Step 5: Check Runtime Logs

1. Click **"Logs"** tab
2. Should see:

   ```
   🚀 Server running on http://0.0.0.0:10000
   📚 API Documentation: http://0.0.0.0:10000/api/docs
   🔒 Security: Helmet enabled, CORS configured
   ⚡ Environment: production
   ✅ Database connected successfully
   ```

3. If you see errors, paste them here for exact fix.

---

## 🧪 Test Each Endpoint

After deployment, run these commands:

### Test 1: Health Check (MOST IMPORTANT)

```bash
curl https://unistudy-api.onrender.com/api/health
```

**Expected response:**

```json
{
  "status": "ok",
  "uptime": 1234,
  "database": {
    "status": "connected",
    "responseTime": "25ms"
  },
  "memory": {
    "used": "128MB",
    "total": "512MB",
    "percentage": "25%"
  }
}
```

**If 404**: Service is running but build didn't complete. Check Build logs.
**If timeout**: Service crashed. Check Runtime logs.
**If 500**: Database connection failed. Check DATABASE_URL.

### Test 2: API Docs (Verify all endpoints)

Visit: `https://unistudy-api.onrender.com/api/docs`

Should show all endpoints (auth, courses, materials, etc.)

### Test 3: Admin Login API

```bash
curl -X POST https://unistudy-api.onrender.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password_here"}'
```

**Expected response:**

```json
{
  "access_token": "eyJhbGc...",
  "admin": { "id": "...", "username": "admin" }
}
```

### Test 4: Frontend Connection

1. Go to `https://unistudynaija.vercel.app`
2. Open **DevTools** (F12)
3. Go to **Network** tab
4. Try to register or login
5. Click any failed request
6. Look at **Response** tab for error details

---

## 🆘 If Still Not Working

### Symptom 1: Build Failed

**Check**: "Cannot find module '@prisma/client'"

**Fix**: The DATABASE_URL must be set DURING BUILD. Add to Render:

1. Environment Variables
2. Under the DATABASE_URL entry, check if there's a "Build-time" toggle
3. Make sure it's enabled

### Symptom 2: Service Crashes on Boot

**Check Logs for**:

```
Error: ECONNREFUSED (database)
UnhandledPromiseRejectionWarning
Cannot read property 'get' of undefined
```

**Fix**:

- Verify DATABASE_URL is correct format
- Use Supabase Session Pooler URL (ends with `.pooler.supabase.com`)
- NOT the direct connection URL

### Symptom 3: CORS Errors in Frontend

**Browser DevTools → Console shows**:

```
Access to XMLHttpRequest blocked by CORS policy
```

**Fix**: Update ALLOWED_ORIGINS to include:

- https://unistudynaija.vercel.app
- https://www.unistudynaija.vercel.app

Then redeploy with cache clear.

### Symptom 4: Admin Dashboard Shows "Loading..." Forever

**Check**:

1. Is backend health check working? → Test with curl above
2. Is NEXT_PUBLIC_API_URL set on Vercel? → Add it if missing
3. Are ALLOWED_ORIGINS correct? → Include frontend URL

**Frontend .env (Vercel environment variables)**:

```
NEXT_PUBLIC_API_URL = https://unistudy-api.onrender.com
```

---

## 📞 Need Help?

Provide EXACTLY THESE 3 THINGS:

1. **Build Log** (last 30 lines from Events tab)
   - Copy from: Render → Events → Latest Deploy → View Logs

2. **Runtime Log** (last 30 lines from Logs tab)
   - Copy from: Render → Logs tab → Last lines

3. **Environment Variables List** (names only, NOT values!)
   - Example format:
     ```
     DATABASE_URL ✅
     JWT_SECRET ✅
     ALLOWED_ORIGINS ❌ MISSING
     ```

Then I'll give you the EXACT fix!

---

## ✅ Success Indicators

When everything is fixed:

- ✅ Health endpoint returns 200 OK + database connected
- ✅ API Docs page loads
- ✅ Frontend /admin/login page loads
- ✅ Admin login with username/password works
- ✅ Admin dashboard shows stats
- ✅ User registration/login works
- ✅ No CORS errors in browser console
- ✅ No "Network Error" on frontend

---

## Quick Reference: All Commands

```bash
# Test backend
curl https://unistudy-api.onrender.com/api/health

# Test admin login
curl -X POST https://unistudy-api.onrender.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR_PASSWORD"}'

# Check Render logs
# Go to: Render → Service → Logs tab

# Redeploy
# Go to: Render → Manual Deploy → "Clear build cache & deploy"
```
