# 🚀 Deploy Hotel PMS to Vercel

## Overview

Your Hotel PMS has two parts:
1. **Frontend (React)** - Deploy to Vercel
2. **Backend (Node.js/Express)** - Deploy to Vercel Serverless Functions

## Prerequisites

- GitHub account (to push your code)
- Vercel account (free tier is fine)
- PostgreSQL database (we'll use Supabase or Neon - both free)

## Architecture

```
Frontend (Vercel) → Backend API (Vercel) → PostgreSQL (Supabase/Neon)
```

## Step 1: Prepare Your Code for Vercel

### 1.1 Update Backend for Serverless

Your backend needs to be adapted for Vercel's serverless functions. I'll create the necessary files.

### 1.2 Environment Variables

You'll need to set these in Vercel:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Your JWT secret
- `NODE_ENV` - production

## Step 2: Setup PostgreSQL Database

### Option A: Supabase (Recommended - Free)

1. Go to https://supabase.com
2. Create account and new project
3. Wait for database to be ready
4. Go to Settings → Database
5. Copy connection string (URI format)
6. Run your SQL scripts in SQL Editor

### Option B: Neon (Alternative - Free)

1. Go to https://neon.tech
2. Create account and new project
3. Copy connection string
4. Use their SQL editor to run scripts

## Step 3: Push Code to GitHub

You need your code on GitHub first:

1. Install GitHub Desktop: https://desktop.github.com/
2. Add your project
3. Publish to: https://github.com/maga1234-0/zenith1

## Step 4: Deploy to Vercel

### 4.1 Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### 4.2 Import Project

1. Click "Add New" → "Project"
2. Import `zenith1` repository
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install`

### 4.3 Configure Environment Variables

In Vercel project settings, add:

```
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=production
PORT=5000
```

### 4.4 Deploy

Click "Deploy" and wait for deployment to complete.

## Step 5: Configure API Routes

Your frontend needs to know where the backend is. Update the API URL.

## Step 6: Setup Database

Run these SQL scripts in your database (Supabase/Neon):

1. `database/schema.sql`
2. `database/seed.sql`
3. `database/update-guests-phone-optional.sql`
4. `database/fix-room-status-constraint.sql`
5. `database/add-maintenance-fields.sql`
6. `database/update-notifications-table.sql`

## Step 7: Test Your Deployment

1. Visit your Vercel URL
2. Try logging in with:
   - Email: admin@hotel.com
   - Password: admin123

## Troubleshooting

### Issue: API calls fail
- Check environment variables in Vercel
- Verify database connection string
- Check Vercel function logs

### Issue: Database connection fails
- Verify DATABASE_URL is correct
- Check if database allows external connections
- Verify SSL settings

### Issue: Build fails
- Check build logs in Vercel
- Verify all dependencies are in package.json
- Check Node.js version compatibility

## Cost Estimate

- **Vercel**: Free tier (100GB bandwidth, unlimited projects)
- **Supabase**: Free tier (500MB database, 2GB bandwidth)
- **Total**: $0/month for small usage

## Production Checklist

- [ ] Code pushed to GitHub
- [ ] Database created and configured
- [ ] Environment variables set in Vercel
- [ ] Database schema and seed data loaded
- [ ] Frontend deployed successfully
- [ ] Backend API working
- [ ] Test all features
- [ ] Setup custom domain (optional)

## Next Steps

1. Setup custom domain
2. Configure CORS properly
3. Setup monitoring
4. Configure backups
5. Setup CI/CD pipeline

---

**Let's start! I'll create all necessary configuration files for you.**
