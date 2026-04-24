# Deploy to Vercel - Complete Guide

## Overview

After uploading to GitHub, deploy to Vercel in 3 steps!

## Prerequisites

- ✅ Code on GitHub
- ✅ Vercel account (free)
- ✅ Database (Supabase or Neon - free)

## Part 1: Setup Database (15 minutes)

### Option A: Supabase (Recommended)

1. **Create Account**
   - Go to: https://supabase.com
   - Sign up (free)

2. **Create Project**
   - Click "New Project"
   - Name: `hotel-pms`
   - Database Password: (save this!)
   - Region: Choose closest to you
   - Click "Create new project"
   - Wait 2-3 minutes

3. **Get Connection String**
   - Go to Settings → Database
   - Find "Connection string" → "URI"
   - Copy it (looks like: `postgresql://postgres:password@host:5432/postgres`)

4. **Run SQL Scripts**
   - Go to SQL Editor
   - Click "New query"
   - Copy content from `database/schema.sql`
   - Click "Run"
   - Repeat for:
     - `database/seed.sql`
     - `database/update-guests-phone-optional.sql`
     - `database/fix-room-status-constraint.sql`
     - `database/add-maintenance-fields.sql`

## Part 2: Deploy to Vercel (10 minutes)

### Step 1: Create Vercel Account

1. Go to: https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel

### Step 2: Import Project

1. Click "Add New" → "Project"
2. Find `zenith1` repository
3. Click "Import"

### Step 3: Configure Build Settings

**Framework Preset**: Vite

**Root Directory**: `./` (leave as default)

**Build Command**:
```bash
cd client && npm install && npm run build
```

**Output Directory**:
```
client/dist
```

**Install Command**:
```bash
npm install
```

### Step 4: Add Environment Variables

Click "Environment Variables" and add:

```
DATABASE_URL=your-supabase-connection-string
JWT_SECRET=your-super-secret-key-min-32-chars
NODE_ENV=production
```

**Important**: Replace values with your actual data!

### Step 5: Deploy

1. Click "Deploy"
2. Wait 2-5 minutes
3. Done!

## Part 3: Configure Frontend API URL

### Step 1: Get Your Vercel URL

After deployment, you'll get a URL like:
```
https://zenith1-abc123.vercel.app
```

### Step 2: Update Environment Variable

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add new variable:
```
VITE_API_URL=https://zenith1-abc123.vercel.app/api
```

### Step 3: Redeploy

1. Go to Deployments
2. Click "..." on latest deployment
3. Click "Redeploy"

## Part 4: Test Your Deployment

1. Visit your Vercel URL
2. Try logging in:
   - Email: `admin@hotel.com`
   - Password: `admin123`
3. Test features:
   - View rooms
   - Create booking
   - Check notifications

## Troubleshooting

### Issue: "Build failed"

**Solution**: Check build logs
- Make sure all dependencies are in package.json
- Verify Node.js version compatibility

### Issue: "API calls fail"

**Solution**: Check environment variables
- Verify DATABASE_URL is correct
- Check JWT_SECRET is set
- Ensure VITE_API_URL points to your deployment

### Issue: "Database connection failed"

**Solution**: Check database
- Verify connection string
- Check if database allows external connections
- Verify SSL settings in Supabase

### Issue: "404 on API routes"

**Solution**: Check vercel.json
- Verify routes configuration
- Check API path matches

## Environment Variables Reference

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# JWT
JWT_SECRET=your-secret-key-minimum-32-characters-long

# Node
NODE_ENV=production

# Frontend API URL
VITE_API_URL=https://your-app.vercel.app/api
```

## Cost Breakdown

- **Vercel**: Free (Hobby plan)
  - 100GB bandwidth
  - Unlimited projects
  - Automatic HTTPS

- **Supabase**: Free
  - 500MB database
  - 2GB bandwidth
  - Unlimited API requests

**Total**: $0/month

## Next Steps

1. ✅ Setup custom domain (optional)
2. ✅ Configure CORS
3. ✅ Setup monitoring
4. ✅ Enable analytics
5. ✅ Setup backups

## Custom Domain (Optional)

1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Vercel: Settings → Domains
3. Add your domain
4. Update DNS records
5. Wait for verification

## Monitoring

Vercel provides:
- Real-time logs
- Performance metrics
- Error tracking
- Analytics

Access in: Dashboard → Your Project → Analytics

## Backup Strategy

### Database Backups

Supabase provides:
- Automatic daily backups
- Point-in-time recovery
- Manual backup option

### Code Backups

- Code is on GitHub (already backed up)
- Vercel keeps deployment history

## Security Checklist

- [ ] Environment variables set correctly
- [ ] .env files not in repository
- [ ] Database password is strong
- [ ] JWT secret is random and long
- [ ] CORS configured properly
- [ ] HTTPS enabled (automatic on Vercel)

## Performance Tips

1. **Enable caching**
   - Vercel automatically caches static assets

2. **Optimize images**
   - Use WebP format
   - Compress images

3. **Code splitting**
   - Already done with Vite

4. **Database indexing**
   - Already configured in schema.sql

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **GitHub Issues**: Create issue in your repository

---

## Quick Reference

### Vercel Dashboard
https://vercel.com/dashboard

### Supabase Dashboard
https://app.supabase.com

### Your Deployment
https://zenith1-[your-id].vercel.app

---

**Your Hotel PMS is now live! 🎉**
