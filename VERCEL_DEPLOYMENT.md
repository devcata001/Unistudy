# UniStudy - Vercel Deployment Guide

This guide will help you deploy UniStudy to Vercel with proper configuration for both frontend and backend.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- PostgreSQL database (we'll use Neon or Supabase)
- Google Gemini API key

## Step 1: Prepare Your Repository

1. **Push to GitHub**:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## Step 2: Set Up Database (Neon - Free)

1. Go to https://neon.tech
2. Sign up and create a new project
3. Create a database named `unistudy`
4. Copy the connection string (it looks like: `postgresql://user:password@host/database?sslmode=require`)
5. Keep this handy for later

## Step 3: Deploy Backend (NestJS) to Vercel

### Create `vercel.json` in `apps/server/`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/main.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/main.ts",
      "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Deploy Backend:

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select `apps/server` as the root directory
4. Set the following environment variables:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `JWT_SECRET`: A random secret (generate with: `openssl rand -base64 32`)
   - `JWT_REFRESH_SECRET`: Another random secret
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `NODE_ENV`: `production`
   - `PORT`: `3000`
5. Click "Deploy"
6. Copy your backend URL (e.g., `https://your-backend.vercel.app`)

### Run Database Migrations:

After backend deployment, run migrations:

```bash
cd apps/server
DATABASE_URL="your-neon-connection-string" npx prisma migrate deploy
DATABASE_URL="your-neon-connection-string" npx prisma db seed
```

## Step 4: Deploy Frontend (Next.js) to Vercel

### Update API URL:

1. Create `apps/web/.env.production`:

```env
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

### Deploy Frontend:

1. Go to https://vercel.com/new
2. Import your GitHub repository again
3. Select `apps/web` as the root directory
4. Vercel will auto-detect Next.js
5. Set the following environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL from Step 3
6. Click "Deploy"
7. Your app will be live at `https://your-app.vercel.app`

## Step 5: Configure CORS

Update `apps/server/src/main.ts` to allow your frontend domain:

```typescript
app.enableCors({
  origin: [
    "http://localhost:3000",
    "https://your-app.vercel.app", // Add your Vercel frontend URL
  ],
  credentials: true,
});
```

Redeploy backend after this change.

## Step 6: Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to update DNS records

## Environment Variables Summary

### Backend (`apps/server`):

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-random-secret
JWT_REFRESH_SECRET=your-random-refresh-secret
GEMINI_API_KEY=your-gemini-api-key
NODE_ENV=production
PORT=3000
```

### Frontend (`apps/web`):

```
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

## Troubleshooting

### Backend Issues:

- Check Vercel logs in the dashboard
- Ensure DATABASE_URL is correctly formatted
- Verify all environment variables are set

### Frontend Issues:

- Check browser console for API errors
- Verify NEXT_PUBLIC_API_URL is correct
- Ensure CORS is configured properly

### Database Issues:

- Run migrations: `npx prisma migrate deploy`
- Check Neon dashboard for connection status
- Verify connection string includes `?sslmode=require`

## Continuous Deployment

Once set up, every push to your main branch will automatically deploy:

- Frontend updates → Automatic deployment
- Backend updates → Automatic deployment

## Post-Deployment Checklist

- [ ] Frontend loads successfully
- [ ] Can register new account
- [ ] Can login
- [ ] Can create courses
- [ ] Can generate quizzes with AI
- [ ] Can generate study manuals
- [ ] Can upload materials
- [ ] Profile updates work

## Cost Estimation

- **Vercel**: Free tier (Hobby plan)
  - Frontend: Free
  - Backend: Free with limits
- **Neon Database**: Free tier
  - 0.5 GB storage
  - Unlimited queries
- **Total**: $0/month for hobby projects

## Scaling (When Needed)

When you outgrow free tier:

- **Vercel Pro**: $20/month
- **Neon Scale**: Starts at $19/month
- Consider separating backend to Railway or Render for better backend hosting

## Support

- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- NestJS Docs: https://docs.nestjs.com
- Next.js Docs: https://nextjs.org/docs

## Quick Deploy Commands

```bash
# Backend
cd apps/server
vercel --prod

# Frontend
cd apps/web
vercel --prod
```

---

**Note**: Make sure to keep your environment variables secure and never commit them to GitHub!
