# UniStudy Deployment Guide - Step by Step

## Prerequisites

- GitHub account ✅ (Already done)
- Vercel account (free): https://vercel.com/signup
- Get a Google Gemini API key: https://makersuite.google.com/app/apikey

---

## STEP 1: Setup Database (Free PostgreSQL)

### Option A: Supabase (Recommended - Easy & Free)

1. Go to https://supabase.com
2. Sign up with GitHub
3. Click "New Project"
4. Fill in:
   - Name: `unistudy-db`
   - Database Password: (create a strong password - save it!)
   - Region: Choose closest to you
5. Wait 2 minutes for project to setup
6. Go to **Settings** → **Database**
7. Scroll down to **Connection String** → Select **URI** (not Session)
8. Copy the connection string that looks like:
   ```
   postgresql://postgres.xxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
9. Replace `[YOUR-PASSWORD]` in the string with your actual password
10. Keep this safe - you'll need it!

### Option B: Railway (Alternative - Also Free)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Provision PostgreSQL"
4. Click on the PostgreSQL service
5. Go to **Connect** tab
6. Copy the **Postgres Connection URL**
7. Keep this safe!

### Option C: Vercel Postgres (Integrated)

1. Go to https://vercel.com/dashboard
2. Click "Storage" → "Create Database"
3. Select "Postgres"
4. Name: `unistudy-db`
5. Region: Choose closest to you
6. After creation, copy the connection string from **.env.local** tab
7. Keep this safe!

**Note:** If none work due to network issues, you can use a local PostgreSQL database temporarily and switch later.

---

## STEP 2: Deploy Backend to Vercel

### A. Prepare Backend

1. Go to your Vercel dashboard: https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repo: `devcata001/Unistudy`
4. **Important:** Set Root Directory to `apps/server`

### B. Configure Build Settings

- Framework Preset: `Other`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### C. Add Environment Variables

Click "Environment Variables" and add these:

```env
# PostgreSQL connection string format (replace placeholders):
# postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:5432/<DB_NAME>
# If you're using Supabase/Neon, use the project's connection string or the Session Pooler
# (required on some hosting platforms that only support IPv4).
DATABASE_URL=postgresql://<db_user>:<db_password>@<db_host>:5432/<db_name>

# JWT secrets - generate strong random values and keep them private
JWT_SECRET=<generate_a_random_32+_char_secret>
JWT_REFRESH_SECRET=<generate_a_random_32+_char_secret_different_from_JWT_SECRET>

# Google Gemini (AI) key
GEMINI_API_KEY=<your_google_gemini_api_key>

# Environment
NODE_ENV=production
```

Generate secure secrets locally and copy them into the deployment UI or .env:

```bash
# Generate a 32-byte (base64) secret (Linux / macOS)
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### D. Deploy Backend

1. Click "Deploy"
2. Wait 2-3 minutes
3. Copy your backend URL (e.g., `https://unistudy-api.vercel.app`)
4. Keep this URL - you need it for frontend!

### E. Run Database Migrations

After backend deployment, run migrations in terminal:

```bash
cd apps/server
DATABASE_URL="your-neon-connection-string" npx prisma migrate deploy
DATABASE_URL="your-neon-connection-string" npx prisma db seed
```

---

## STEP 3: Deploy Frontend to Vercel

### A. Prepare Frontend

1. Go to Vercel dashboard: https://vercel.com/new
2. Click "Import Project"
3. Select `devcata001/Unistudy` again
4. **Important:** Set Root Directory to `apps/web`

### B. Configure Build Settings

- Framework Preset: `Next.js` (auto-detected)
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

### C. Add Environment Variables

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
```

(Replace with YOUR backend URL from Step 2D)

### D. Deploy Frontend

1. Click "Deploy"
2. Wait 2-3 minutes
3. Your app is LIVE! 🎉

---

## STEP 4: Configure CORS (Important!)

After both deployments, update CORS in backend:

1. Go to your backend project in Vercel
2. Go to Settings → Environment Variables
3. Add your frontend URL to allowed origins in `apps/server/src/main.ts`:

```typescript
app.enableCors({
  origin: [
    "http://localhost:3000",
    "https://your-frontend-url.vercel.app", // Add this
  ],
  credentials: true,
});
```

4. Redeploy backend (click "Redeploy" in Vercel)

---

## STEP 5: Test Your Deployment

### Test these features:

1. ✅ Open your frontend URL
2. ✅ Register a new account
3. ✅ Login
4. ✅ Create a course
5. ✅ Generate a quiz
6. ✅ Upload materials
7. ✅ Access admin panel: `your-url.vercel.app/admin/login`
   - Username: `cyb3rcatalyst`
   - Password: `UTMEscore@336`

---

## STEP 6: Custom Domain (Optional)

### Add your own domain:

1. Go to your frontend Vercel project
2. Settings → Domains
3. Add your domain (e.g., `unistudy.com`)
4. Update your DNS records as shown by Vercel
5. Done! Your app is on your domain

---

## Troubleshooting

### Can't access database provider websites:

If you can't reach Neon, Supabase, Railway, or other sites:

**Solution 1: Use Vercel Postgres (Most Reliable)**

- Built into Vercel, no external site needed
- Go to Vercel Dashboard → Storage → Create Database
- Select Postgres and it will integrate automatically

**Solution 2: Use Local PostgreSQL Temporarily**

```bash
# Install PostgreSQL locally
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb unistudy

# Get connection string (use this in Vercel)
postgresql://postgres:postgres@localhost:5432/unistudy
```

Then deploy and switch to cloud database later when network is stable.

**Solution 3: Try Different Network**

- Use mobile hotspot
- Try different WiFi
- Use VPN if available

### Backend issues:

```bash
# Check Vercel logs
vercel logs <your-backend-url>

# Test database connection
DATABASE_URL="your-connection-string" npx prisma db push
```

### Frontend issues:

- Check browser console for API errors
- Verify `NEXT_PUBLIC_API_URL` is correct
- Make sure backend is deployed first

### Database issues:

```bash
# Reset and reseed database
DATABASE_URL="your-connection-string" npx prisma migrate reset
DATABASE_URL="your-connection-string" npx prisma db seed
```

### Admin login not working:

- Clear browser cache/cookies
- Try incognito/private mode
- Check backend logs for authentication errors

---

## Important URLs After Deployment

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-api.vercel.app`
- **Admin Panel**: `https://your-app.vercel.app/admin/login`
- **Database Dashboard**:
  - Supabase: https://supabase.com/dashboard
  - Railway: https://railway.app/dashboard
  - Vercel: https://vercel.com/dashboard/stores

---

## Environment Variables Quick Reference

### Backend (.env):

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
GEMINI_API_KEY=...
NODE_ENV=production
```

### Frontend (.env.production):

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
```

---

## Cost Summary (Free Tier)

- ✅ **Vercel Hobby**: **FREE**
  - Frontend hosting
  - Backend hosting
  - Automatic deployments

- ✅ **Database Options** (All FREE):
  - **Supabase**: 500 MB storage, unlimited API requests
  - **Railway**: 500 MB storage, 5GB bandwidth/month
  - **Vercel Postgres**: 256 MB storage (Beta)
  - **Neon**: 0.5 GB storage (if accessible)

- ✅ **Google Gemini API**: **FREE**
  - 15 requests/minute
  - 1500 requests/day

**Total Cost: $0/month** for hobby projects! 🎉

---

## Quick Deploy Commands

```bash
# If you need to deploy manually:

# Backend
cd apps/server
vercel --prod

# Frontend
cd apps/web
vercel --prod
```

---

## Support & Help

- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Prisma Docs: https://www.prisma.io/docs
- Next.js Docs: https://nextjs.org/docs

---

**🎉 That's it! Your UniStudy platform is live and ready to use!**

Access admin panel at: `/admin/login`

- Username: `cyb3rcatalyst`
- Password: `UTMEscore@336`

Happy deploying! 🚀
