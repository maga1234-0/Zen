# Vercel Environment Variables Setup

## Login Fix - Required Environment Variables

Go to your Vercel project: **https://vercel.com/dashboard** → Select your project → **Settings** → **Environment Variables**

### Required Variables (Copy these exactly):

```
DB_HOST=aws-0-eu-west-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.bdahordvjnspfszwexnb
DB_PASSWORD=LqDPYFn5FIUhEcN0

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRES_IN=7d

NODE_ENV=production
CORS_ORIGIN=https://zen-lyart.vercel.app
```

### Alternative (using DATABASE_URL):

If you prefer, you can use a single connection string:

```
DATABASE_URL=postgresql://postgres.bdahordvjnspfszwexnb:LqDPYFn5FIUhEcN0@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require
```

## Steps to Fix:

1. **Add all environment variables** in Vercel dashboard
2. **Redeploy** your project (Settings → Deployments → Click "..." on latest → Redeploy)

## Changes Made to Fix the API:

1. **api/index.ts** - Now imports the full Express backend with all routes
2. **vercel.json** - Fixed routing to use `/api/index.ts`
3. **package.json** - Added all backend dependencies at root level

## Test After Deploying:

1. Go to https://zen-lyart.vercel.app/
2. Try logging in with your credentials
3. Check browser console for any errors
