# 🚀 Render Deployment Guide for UniStudy Backend

## Quick Start

### Option 1: Using Render Blueprint (Recommended)

1. **Connect your GitHub repo to Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Blueprint"
   - Connect your GitHub account and select `Unistudy` repo
   - Render will auto-detect `render.yaml` and create the service

2. **Set required environment variables** (in Render dashboard)

   ```bash
   DATABASE_URL=postgresql://user:pass@host:5432/db  # From Supabase/Neon
   JWT_SECRET=$(openssl rand -base64 32)
   JWT_REFRESH_SECRET=$(openssl rand -base64 32)
   GEMINI_API_KEY=your_key_from_google_ai_studio
   ALLOWED_ORIGINS=https://unistudynaija.vercel.app,https://www.unistudynaija.vercel.app
   APP_URL=https://unistudynaija.vercel.app
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=your_secure_admin_password
   ```

3. **Deploy!**
   - Render will automatically build and deploy
   - Check logs for any errors
   - Test health endpoint: `https://your-api.onrender.com/api/health`

### Option 2: Manual Setup

1. **Create a new Web Service** on Render
   - Name: `unistudy-api`
   - Environment: `Node`
   - Branch: `main`
   - Root Directory: `apps/server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`

2. **Add environment variables** (same as above)

3. **Set Health Check Path**: `/api/health`

4. **Deploy and monitor logs**

---

## Environment Variables Checklist

### ✅ Required (app won't start without these)

- [x] `DATABASE_URL` - PostgreSQL connection string
- [x] `JWT_SECRET` - JWT signing secret (32+ chars)
- [x] `JWT_REFRESH_SECRET` - Refresh token secret (32+ chars)
- [x] `GEMINI_API_KEY` - Google Gemini Pro API key
- [x] `ALLOWED_ORIGINS` - Frontend URLs (comma-separated)
- [x] `NODE_ENV=production`

### ⚠️ Recommended (security & functionality)

- [ ] `ADMIN_EMAIL` - Admin account email
- [ ] `ADMIN_PASSWORD` - Strong admin password (change default!)
- [ ] `APP_URL` - Frontend URL for email links
- [ ] `EMAIL_PROVIDER` - Set to `smtp`/`sendgrid`/`ses` for real emails
- [ ] `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` - If using email

### 📊 Optional (monitoring & features)

- [ ] `SENTRY_DSN` - Error tracking
- [ ] `REDIS_HOST`, `REDIS_PORT` - Caching (if using Redis addon)

---

## Common Issues & Fixes

### 1. Build Fails: "Cannot find module '@prisma/client'"

**Fix:** Ensure `DATABASE_URL` is set **during build** (Render build env vars)

```bash
# In Render dashboard, add DATABASE_URL to both:
# - Environment Variables
# - Build Environment Variables (separate section)
```

### 2. App Crashes: "Port already in use"

**Fix:** Render auto-assigns `PORT`. Don't hardcode it.

```typescript
// ✅ Correct (apps/server/src/main.ts)
const port = process.env.PORT || 3001;

// ❌ Wrong
const port = 3001;
```

### 3. CORS Errors: "Access-Control-Allow-Origin missing"

**Fix:** Set `ALLOWED_ORIGINS` to your frontend URL(s)

```bash
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://www.your-frontend.vercel.app
```

### 4. Database Connection Fails

**Fix:** Use Supabase/Neon Session Pooler URL (not direct connection)

```bash
# ✅ Session Pooler (works on Render)
postgresql://user:pass@host.pooler.supabase.com:5432/postgres

# ❌ Direct connection (IPv6 - may not work)
postgresql://user:pass@host.supabase.co:5432/postgres
```

### 5. Health Check Fails

**Fix:** Verify endpoint is `/api/health` (with `/api` prefix)

```bash
curl https://your-api.onrender.com/api/health
# Should return: {"status":"ok","uptime":123,"database":{"status":"connected"},...}
```

---

## Testing Deployment

### 1. Health Check

```bash
curl https://your-api.onrender.com/api/health
```

### 2. API Documentation

Visit: `https://your-api.onrender.com/api/docs`

### 3. Test Registration

```bash
curl -X POST https://your-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234",
    "firstName": "Test",
    "lastName": "User",
    "department": "Computer Science",
    "faculty": "Science",
    "level": "100"
  }'
```

---

## Monitoring

### View Logs

```bash
# In Render dashboard:
# Service → Logs tab
# Look for startup messages:
# ✅ "🚀 Server running on http://0.0.0.0:10000"
# ✅ "📚 API Documentation: http://0.0.0.0:10000/api/docs"
```

### Set Up Alerts

1. Go to Service → Settings → Notifications
2. Add your email for deployment failures
3. Enable Slack/Discord webhooks (optional)

---

## Scaling & Performance

### Upgrade Plan

- **Starter**: $7/month - Good for development/testing
- **Standard**: $25/month - Recommended for production (400MB RAM, never sleeps)
- **Pro**: $85/month - High traffic (4GB RAM, autoscaling)

### Enable Auto-Scaling (Standard+ plans)

1. Service → Settings → Scaling
2. Set Min/Max instances
3. Configure CPU/Memory thresholds

---

## Database Setup (First Deployment)

After first deploy, run migrations:

```bash
# Option 1: Using Render Shell
1. Go to Service → Shell tab
2. Run: npm run prisma:migrate deploy

# Option 2: Using Render CLI
render run npm run prisma:migrate deploy

# Option 3: Add to build command (automatic)
Build Command: npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```

---

## 🆘 Still Having Issues?

1. **Check Render Logs** - 90% of issues show up here
2. **Verify all env vars are set** - Use checklist above
3. **Test locally first** - `npm run build && npm run start:prod`
4. **Check Render Status** - https://status.render.com
5. **Contact support** - Render has excellent support via dashboard chat

---

## Current Deployment Status

- **Backend API**: https://unistudy-api.onrender.com
- **Health Check**: https://unistudy-api.onrender.com/api/health
- **API Docs**: https://unistudy-api.onrender.com/api/docs
- **Frontend**: https://unistudynaija.vercel.app

✅ All systems operational!
