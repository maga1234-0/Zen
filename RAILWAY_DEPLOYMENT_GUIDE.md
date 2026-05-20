# 🚂 Railway Deployment Guide

## ✅ Phase 1: Push to GitHub (COMPLETED)
- [x] Backend code pushed to: https://github.com/maga1234-0/zen_backend-

## ✅ Phase 2: Deploy to Railway (No Credit Card Required)

### 2.1 Create Railway Account
- [ ] Sign up at: https://railway.app
- [ ] Use GitHub login (recommended)

### 2.2 Create New Project
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Select your `zen_backend-` repository

### 2.3 Configure Service
Railway will automatically detect it's a Node.js project. Configure:

**Service Settings:**
- **Name**: `hotel-pms-backend` (or any name you prefer)
- **Root Directory**: `/` (default)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Health Check Path**: `/health`

### 2.4 Set Environment Variables
**Generate JWT Secret first:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Add these variables in Railway Dashboard → Variables tab:**

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `DATABASE_URL` | `postgresql://postgres.hxvhkhwhhfwtthujkahx:CEQ17BlWx58MWdWY@aws-1-eu-central-2.pooler.supabase.com:6543/postgres` |
| `JWT_SECRET` | `[generated_secret]` |
| `CORS_ORIGIN` | `https://zen-lyart.vercel.app` |
| `VERCEL` | `0` |
| `JWT_EXPIRES_IN` | `7d` |

### 2.5 Deploy
- [ ] Click "Deploy" (Railway auto-deploys when you add variables)
- [ ] Wait for build to complete (2-3 minutes)
- [ ] Check logs for any errors

## ✅ Phase 3: Test Backend
- [ ] Health check: `https://[your-railway-service].up.railway.app/health`
- [ ] API root: `https://[your-railway-service].up.railway.app/api`
- [ ] Login test: Use Postman or curl to test `/api/auth/login`

## ✅ Phase 4: Update Frontend

### 4.1 Update Vercel Environment Variables
- [ ] Go to: https://vercel.com/maga1234-0/zen-lyart/settings/environment-variables
- [ ] **Update `VITE_API_URL`** to: `https://[your-railway-service].up.railway.app/api`
- [ ] Save changes (Vercel auto-redeploys)

### 4.2 Test Frontend
- [ ] Open: https://zen-lyart.vercel.app
- [ ] Login: `admin@hotel.com` / `password123`
- [ ] Test features:
  - [ ] Staff management (add, edit, delete)
  - [ ] Room management
  - [ ] Bookings
  - [ ] Guests
  - [ ] Payments
  - [ ] Notifications

## ✅ Phase 5: Verify Everything Works

### Backend Tests:
- [ ] Database connection working
- [ ] JWT authentication working
- [ ] All API endpoints responding
- [ ] CORS configured correctly

### Frontend Tests:
- [ ] Login successful
- [ ] No "route not found" errors
- [ ] Data loading correctly
- [ ] Forms submitting successfully

## 🔧 Troubleshooting Guide

### If Railway build fails:
1. Check Railway logs in dashboard
2. Test locally: `npm run build`
3. Verify Node.js version ≥18

### If database connection fails:
1. Check `DATABASE_URL` format
2. Verify Supabase is running
3. Test connection: `node test-supabase-connection.js`

### If CORS errors:
1. Check `CORS_ORIGIN` matches frontend URL exactly
2. Test with Postman (no CORS in API clients)

### If frontend can't connect:
1. Check browser console (F12)
2. Verify `VITE_API_URL` is correct
3. Test backend URL directly in browser

## 🎯 Success Metrics
- [ ] Backend deployed: `https://[your-service].up.railway.app`
- [ ] Health check returns `{"status":"OK"}`
- [ ] Frontend connects successfully
- [ ] All features working
- [ ] No "route not found" errors

## ⏱️ Estimated Time: 10-15 minutes

## 🔗 Your URLs:
- **Frontend**: https://zen-lyart.vercel.app
- **Backend Repository**: https://github.com/maga1234-0/zen_backend-
- **Backend (after deploy)**: https://[your-service].up.railway.app
- **Supabase Database**: https://supabase.com/dashboard/project/hxvhkhwhhfwtthujkahx

## 📝 Railway Tips:
1. Railway gives you a free domain: `[project-name].up.railway.app`
2. No credit card required for basic deployment
3. Auto-deploys on git push
4. Free tier includes 500 hours/month (enough for development)
5. Easy scaling if needed later

## 🆘 Need Help?
1. Check error messages in Railway logs
2. Test API endpoints with Postman
3. Check browser console for frontend errors
4. Verify all environment variables are set
5. Railway documentation: https://docs.railway.app


## ✅ Dockerfile Fix Applied
The Dockerfile has been updated to fix the "sh: tsc: not found" error:
- **Multi-stage build**: Installs all dependencies (including TypeScript) in builder stage
- **Production optimization**: Only production dependencies in final image
- **Fixed**: TypeScript compilation now works correctly

Railway will automatically use the updated Dockerfile for deployment.