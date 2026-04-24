# Hotel PMS Deployment Guide

## Prerequisites
- Supabase account with database set up
- Vercel account (for frontend)
- Railway/Render account (for backend)

## 1. Deploy Database (Supabase)

Already done! Your Supabase project: `bdahordvjnspfszwexnb`

**Setup:**
1. Go to SQL Editor in Supabase
2. Run `database/schema.sql`
3. Run `database/seed.sql`
4. Note your database credentials

## 2. Deploy Backend (Railway or Render)

### Option A: Railway (Recommended)

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Set root directory to `/server`
5. Add environment variables:
   ```
   DB_HOST=db.bdahordvjnspfszwexnb.supabase.co
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=[your-supabase-password]
   JWT_SECRET=[generate-random-string]
   PORT=3001
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```
6. Deploy!

### Option B: Render

1. Go to https://render.com
2. New → Web Service
3. Connect your repository
4. Root directory: `server`
5. Build command: `npm install && npm run build`
6. Start command: `npm start`
7. Add same environment variables as above

## 3. Deploy Frontend (Vercel)

1. Go to https://vercel.com
2. Import your repository
3. Root directory: `client`
4. Framework: Vite
5. Build command: `npm run build`
6. Output directory: `dist`
7. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```
8. Deploy!

## 4. Update API URL in Frontend

Update `client/src/services/api.ts`:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

## 5. Test Deployment

1. Visit your Vercel URL
2. Login with: admin@hotel.com / password123
3. Test creating bookings, payments, etc.

## Troubleshooting

**Database connection fails:**
- Check Supabase is allowing connections
- Verify password is correct
- Try connection pooler URL instead

**CORS errors:**
- Update CORS_ORIGIN in backend to match frontend URL
- Restart backend after changing

**Build fails:**
- Check all dependencies are in package.json
- Verify TypeScript compiles locally first

## Free Tier Limits

- **Supabase**: 500MB database, 2GB bandwidth
- **Railway**: 500 hours/month, $5 credit
- **Vercel**: Unlimited deployments, 100GB bandwidth
- **Render**: 750 hours/month free

## Cost: $0/month for small usage!
