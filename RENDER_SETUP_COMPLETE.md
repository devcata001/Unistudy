# 🚀 UniStudy Backend Deployment on Render - Complete Setup Guide

## Your Secrets (Already Generated ✅)

```
JWT_SECRET = spBSvEOWhcQ9jb5PtZM4XGRfcph7u3wMYr+WMMk8kas=
JWT_REFRESH_SECRET = N60jhKlUmzMFhFLrUDfe/ES1HsuzJz4ldQoT0iZHuic=
```

**⚠️ IMPORTANT**: Keep these secret! Never commit to GitHub. Store in Render only.

---

## Step-by-Step Render Deployment

### **STEP 1: Create Render Account** (if you don't have one)

1. Go to https://render.com
2. Sign up with GitHub
3. Connect your GitHub account

### **STEP 2: Create Backend Service**

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect a repository"**
4. Search for and select **"Unistudy"** repo
5. Click **"Connect"**

### **STEP 3: Configure Service Settings**

**Basic Settings:**

- **Name**: `unistudy-api`
- **Environment**: `Node`
- **Region**: `Virginia` (or your preferred)
- **Branch**: `main`
- **Root Directory**: `apps/server` ← **CRITICAL**

**Build & Start:**

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`

### **STEP 4: Add Environment Variables**

Click **"Add Environment Variable"** for each of these:

```
DATABASE_URL = [REQUIRED - See Section Below]
JWT_SECRET = spBSvEOWhcQ9jb5PtZM4XGRfcph7u3wMYr+WMMk8kas=
JWT_REFRESH_SECRET = N60jhKlUmzMFhFLrUDfe/ES1HsuzJz4ldQoT0iZHuic=
GEMINI_API_KEY = [REQUIRED - Your Google Gemini API Key]
NODE_ENV = production
ALLOWED_ORIGINS = https://unistudynaija.vercel.app,https://www.unistudynaija.vercel.app
APP_URL = https://unistudynaija.vercel.app
ADMIN_EMAIL = [Your Admin Email]
ADMIN_PASSWORD = [Your Admin Password - Change from default!]
EMAIL_FROM = noreply@unistudy.ng
THROTTLE_TTL = 60000
THROTTLE_LIMIT = 100
JWT_EXPIRES_IN = 15m
JWT_REFRESH_EXPIRES_IN = 7d
```

### **STEP 5: Get Database Connection String**

You MUST have a PostgreSQL database. Choose one:

#### **Option A: Supabase (Easiest - Free tier available)**

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub
4. Create a new project
5. Go to **Project Settings** → **Database**
6. Copy the **"Connection string"** under **"Session Pooler"**
   - Format: `postgresql://postgres.xxxxx:password@aws-0-xxxxx.pooler.supabase.com:5432/postgres`
7. Paste as `DATABASE_URL` in Render

#### **Option B: Neon (Also free)**

1. Go to https://neon.tech
2. Sign up with GitHub
3. Create new project
4. Copy connection string from dashboard
5. Paste as `DATABASE_URL` in Render

#### **Option C: Railway PostgreSQL**

1. Go to https://railway.app
2. Create account with GitHub
3. Add PostgreSQL database
4. Copy connection string
5. Paste as `DATABASE_URL` in Render

### **STEP 6: Get Gemini API Key**

1. Go to https://makersuite.google.com/app/apikey
2. Click **"Create API Key"**
3. Copy the key
4. Paste as `GEMINI_API_KEY` in Render

### **STEP 7: Deploy**

1. Scroll down and click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Check the **"Events"** tab for build status
4. Look for: ✅ "Your service is live!"

### **STEP 8: Get Your Service URL**

Once deployed, you'll have a URL like:

```
https://unistudy-api.onrender.com
```

---

## 🧪 Test Your Backend

Once deployed, run these commands to verify everything works:

### **Test 1: Health Check (Most Important)**

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

### **Test 2: API Docs**

Visit in browser:

```
https://unistudy-api.onrender.com/api/docs
```

Should show all API endpoints.

### **Test 3: Admin Login**

```bash
curl -X POST https://unistudy-api.onrender.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR_ADMIN_PASSWORD"}'
```

### **Test 4: User Registration**

```bash
curl -X POST https://unistudy-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test@1234",
    "firstName":"Test",
    "lastName":"User",
    "department":"Computer Science",
    "faculty":"Science",
    "level":"100",
    "university":"University of Lagos"
  }'
```

---

## 🔗 Update Frontend on Vercel

After backend is deployed:

1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   ```
   NEXT_PUBLIC_API_URL = https://unistudy-api.onrender.com
   ```
5. Click **"Save"**
6. Go to **Deployments** → Click **"Redeploy"** on latest

---

## ✅ Verify Everything Works

### **Test Admin Dashboard**

1. Go to `https://unistudynaija.vercel.app/admin/login`
2. Login with:
   - Username: `admin`
   - Password: `YOUR_ADMIN_PASSWORD`
3. Should see admin dashboard with stats

### **Test User Registration**

1. Go to `https://unistudynaija.vercel.app/register`
2. Fill in the form
3. Should NOT show "Network Error"
4. Should receive verification email (or console log if EMAIL_PROVIDER=console)

### **Test User Login**

1. Go to `https://unistudynaija.vercel.app/login`
2. Login with your registered account
3. Should redirect to dashboard
4. Should see courses, materials, etc.

---

## ⚠️ Troubleshooting

### **Service Creation Failed: "Repository not found"**

- Make sure your GitHub repo is public
- Go to Render → GitHub Apps → Authorize Unistudy repo
- Try again

### **Build Failed: "Cannot find module '@prisma/client'"**

- Make sure `DATABASE_URL` is set BEFORE deploying
- If already deployed, add env var and redeploy with "Clear build cache"

### **Build Failed: "No such file or directory"**

- Verify `Root Directory` is set to `apps/server` (NOT root!)
- Redeploy

### **Health Check Returns 500: "Database error"**

- Verify `DATABASE_URL` is correct
- Check database is created and accessible
- Look at Render logs for exact error

### **Frontend Shows "Network Error"**

- Verify `NEXT_PUBLIC_API_URL` is set on Vercel
- Verify `ALLOWED_ORIGINS` includes your Vercel URL
- Check browser DevTools → Network tab for CORS errors

---

## 📊 Render Service Monitoring

After deployment, you can:

1. **View Logs**: Service → Logs tab
2. **Check Health**: Click the service → Status indicator
3. **View Metrics**: Service → Metrics tab (CPU, Memory, etc.)
4. **Scale**: Change plan from "Starter" to "Standard" for more power

---

## 🎯 Success Checklist

- [ ] Backend service created on Render
- [ ] All environment variables added
- [ ] Build completed successfully
- [ ] Service is "Live"
- [ ] Health endpoint returns 200 OK
- [ ] Database connected
- [ ] API docs load
- [ ] Admin login works
- [ ] User registration works
- [ ] Frontend environment variable updated
- [ ] Frontend redeployed
- [ ] Admin dashboard loads
- [ ] User dashboard loads
- [ ] No "Network Error" on frontend

---

## 🆘 Need Help?

If something isn't working:

1. **Check Render Logs**
   - Go to your service
   - Click "Logs" tab
   - Copy last 30 lines
   - Share with description of error

2. **Check Browser Console**
   - F12 → Console tab
   - Look for red errors
   - Share the error message

3. **Test Health Endpoint**
   ```bash
   curl -v https://unistudy-api.onrender.com/api/health
   ```

   - Share the full response

---

## 🚀 What's Next?

Once everything is deployed and working:

1. **Set Up Email**: Update EMAIL_PROVIDER to send real emails (Gmail, SendGrid, AWS SES)
2. **Enable Monitoring**: Set up Sentry for error tracking
3. **Add Custom Domain**: Use your own domain instead of onrender.com
4. **Set Up CI/CD**: Auto-deploy on every push to main
5. **Scale Infrastructure**: Upgrade to Standard plan for production

Good luck! 🎉
