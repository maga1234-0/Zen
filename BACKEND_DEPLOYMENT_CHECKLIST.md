# ✅ Backend Deployment Checklist

## Phase 1: Push to GitHub ✅
- [ ] Run: `.\push-to-backend-repo.ps1`
- [ ] Verify code is at: https://github.com/maga1234-0/zen_backend-

## Phase 2: Deploy to Render
### 2.1 Create Render Account (if needed)
- [ ] Sign up at: https://render.com
- [ ] Connect GitHub account

### 2.2 Create Web Service
- [ ] Click "New +" → "Web Service"
- [ ] Select "zen_backend-" repository
- [ ] Configure:
  - **Name**: `hotel-pms-backend`
  - **Environment**: `Node`
  - **Region**: `Oregon` (or closest)
  - **Branch**: `main`
  - **Build Command**: `npm install && npm run build`
  - **Start Command**: `npm start`
  - **Plan**: `Free`

### 2.3 Set Environment Variables
**Generate JWT Secret first:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Add these variables in Render:**
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `DATABASE_URL` = `postgresql://postgres.hxvhkhwhhfwtthujkahx:[PASSWORD]@aws-1-eu-central-2.pooler.supabase.com:6543/postgres`
- [ ] `JWT_SECRET` = `[generated_secret]`
- [ ] `CORS_ORIGIN` = `https://zen-lyart.vercel.app`
- [ ] `VERCEL` = `0`

### 2.4 Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Check logs for errors

## Phase 3: Test Backend
- [ ] Health check: `https://hotel-pms-backend.onrender.com/health`
- [ ] API root: `https://hotel-pms-backend.onrender.com/api`
- [ ] Login test: Use Postman or curl to test `/api/auth/login`

## Phase 4: Update Frontend
### 4.1 Update Vercel Environment Variables
- [ ] Go to: https://vercel.com/maga1234-0/zen-lyart/settings/environment-variables
- [ ] **Update `VITE_API_URL`** to: `https://hotel-pms-backend.onrender.com/api`
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

## Phase 5: Verify Everything Works
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

## Troubleshooting Guide

### If Render build fails:
1. Check Render logs
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

## Success Metrics
- [ ] Backend deployed: `https://hotel-pms-backend.onrender.com`
- [ ] Health check returns `{"status":"OK"}`
- [ ] Frontend connects successfully
- [ ] All features working
- [ ] No "route not found" errors

## Estimated Time: 15-25 minutes

## Need Help?
1. Check error messages in Render logs
2. Test API endpoints with Postman
3. Check browser console for frontend errors
4. Verify all environment variables are set

## Your URLs:
- **Frontend**: https://zen-lyart.vercel.app
- **Backend Repository**: https://github.com/maga1234-0/zen_backend-
- **Backend (after deploy)**: https://hotel-pms-backend.onrender.com
- **Supabase Database**: https://supabase.com/dashboard/project/hxvhkhwhhfwtthujkahx