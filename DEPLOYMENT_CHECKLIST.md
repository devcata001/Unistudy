# 📋 Render Deployment Checklist - Copy & Paste Your Values

## Your Secrets (Save These Securely)

```
JWT_SECRET = spBSvEOWhcQ9jb5PtZM4XGRfcph7u3wMYr+WMMk8kas=
JWT_REFRESH_SECRET = N60jhKlUmzMFhFLrUDfe/ES1HsuzJz4ldQoT0iZHuic=
```

## Environment Variables to Add to Render

(Copy all of these and paste into Render dashboard)

```
DATABASE_URL =
JWT_SECRET = spBSvEOWhcQ9jb5PtZM4XGRfcph7u3wMYr+WMMk8kas=
JWT_REFRESH_SECRET = N60jhKlUmzMFhFLrUDfe/ES1HsuzJz4ldQoT0iZHuic=
GEMINI_API_KEY =
NODE_ENV = production
ALLOWED_ORIGINS = https://unistudynaija.vercel.app,https://www.unistudynaija.vercel.app
APP_URL = https://unistudynaija.vercel.app
ADMIN_EMAIL =
ADMIN_PASSWORD =
EMAIL_FROM = noreply@unistudy.ng
THROTTLE_TTL = 60000
THROTTLE_LIMIT = 100
JWT_EXPIRES_IN = 15m
JWT_REFRESH_EXPIRES_IN = 7d
```

## Service Configuration

```
Name: unistudy-api
Environment: Node
Region: Virginia
Branch: main
Root Directory: apps/server
Build Command: npm install && npm run build
Start Command: npm run start:prod
Health Check Path: /api/health
```

## Database Setup Steps

### Get DATABASE_URL from Supabase:

1. Go to https://supabase.com
2. Sign up with GitHub
3. Create new project
4. Settings → Database
5. Copy "Session Pooler" connection string
6. Example: postgresql://postgres.xxxxx:password@aws-0-xxxxx.pooler.supabase.com:5432/postgres

### Get GEMINI_API_KEY:

1. Go to https://makersuite.google.com/app/apikey
2. Create API Key
3. Copy and paste

## Quick Links

- Render Dashboard: https://dashboard.render.com
- GitHub Repo: https://github.com/devcata001/Unistudy
- Vercel Dashboard: https://vercel.com/dashboard
- Supabase: https://supabase.com
- Google AI Studio: https://makersuite.google.com/app/apikey

## Fill In Your Values

- [ ] DATABASE_URL from Supabase
- [ ] GEMINI_API_KEY from Google AI Studio
- [ ] ADMIN_EMAIL (your email)
- [ ] ADMIN_PASSWORD (secure password, don't use default)
- [ ] ALLOWED_ORIGINS (your Vercel frontend URL)
- [ ] APP_URL (your Vercel frontend URL)

## After Render Deployment

- [ ] Test: curl https://unistudy-api.onrender.com/api/health
- [ ] Update Vercel NEXT_PUBLIC_API_URL
- [ ] Redeploy Vercel
- [ ] Test admin login
- [ ] Test user registration
