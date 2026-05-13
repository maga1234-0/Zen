# 🚀 Deploy to Render.com - Complete Guide

## ✅ What You Already Have
- ✅ Code on GitHub: https://github.com/maga1234-0/zenith1
- ✅ Supabase database with all data
- ✅ Database credentials ready

## 📋 Deployment Steps (15 minutes)

### Step 1: Sign Up for Render (2 minutes)

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended) or email
4. Authorize Render to access your GitHub repositories

### Step 2: Create Backend Service (5 minutes)

1. **Click "New +" → "Web Service"**

2. **Connect Repository:**
   - Find and select `zenith1` from your repositories
   - Click "Connect"

3. **Configure Service:**
   - **Name:** `hotel-pms-api`
   - **Region:** Oregon (US West) - or closest to you
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"

   Add these 4 variables:

   **DATABASE_URL:**
   ```
   postgresql://postgres.hxvhkhwhhfwtthujkahx:[YOUR-PASSWORD]@aws-1-eu-central-2.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

   **JWT_SECRET:**
   ```
   your-super-secret-jwt-key-minimum-32-characters-long-please-change-this
   ```

   **NODE_ENV:**
   ```
   production
   ```

   **CORS_ORIGIN:**
   ```
   *
   ```
   (We'll update this after frontend deployment)

5. **Click "Create Web Service"**
   - Wait 5-10 minutes for deployment
   - You'll get a URL like: `https://hotel-pms-api.onrender.com`
   - **SAVE THIS URL!** You'll need it for the frontend

### Step 3: Create Frontend Service (5 minutes)

1. **Click "New +" → "Static Site"**

2. **Connect Repository:**
   - Select `zenith1` again
   - Click "Connect"

3. **Configure Static Site:**
   - **Name:** `hotel-pms-frontend`
   - **Branch:** `main`
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. **Add Environment Variable:**
   Click "Advanced" → "Add Environment Variable"

   **VITE_API_URL:**
   ```
   https://hotel-pms-api.onrender.com/api
   ```
   (Use the URL from Step 2, add `/api` at the end)

5. **Click "Create Static Site"**
   - Wait 3-5 minutes for deployment
   - You'll get a URL like: `https://hotel-pms-frontend.onrender.com`

### Step 4: Update CORS (2 minutes)

1. Go back to your **Backend Service** (`hotel-pms-api`)
2. Click "Environment" in the left sidebar
3. Find `CORS_ORIGIN` variable
4. Update its value to your frontend URL:
   ```
   https://hotel-pms-frontend.onrender.com
   ```
5. Click "Save Changes"
6. Service will automatically redeploy (1-2 minutes)

### Step 5: Test Your App! (1 minute)

1. Visit your frontend URL: `https://hotel-pms-frontend.onrender.com`
2. Login with:
   - Email: `admin@hotel.com`
   - Password: `admin123`
3. Test the features!

## 🎉 Success!

Your hotel management system is now live and accessible worldwide!

## 📝 Your Deployment URLs

- **Frontend:** https://hotel-pms-frontend.onrender.com (your actual URL)
- **Backend API:** https://hotel-pms-api.onrender.com (your actual URL)
- **Database:** Supabase (already configured)

## ⚠️ Important Notes

### Free Tier Limitations:
- Services spin down after 15 minutes of inactivity
- First request after inactivity takes 30-60 seconds to wake up
- 750 hours/month free (enough for one service 24/7)

### To Upgrade (Optional):
- $7/month per service for always-on
- No spin-down delays
- Better performance

## 🔧 Troubleshooting

### Backend won't start:
1. Check Environment Variables are correct
2. Check build logs for errors
3. Verify DATABASE_URL is correct

### Frontend shows errors:
1. Verify VITE_API_URL points to backend URL + `/api`
2. Check backend is running (visit backend URL/health)
3. Clear browser cache

### Login fails:
1. Check backend logs for database connection errors
2. Verify Supabase database is accessible
3. Check CORS_ORIGIN matches frontend URL

## 💰 Cost Breakdown

**Current Setup (FREE):**
- Render Backend: Free tier
- Render Frontend: Free tier
- Supabase Database: Free tier (500MB)
- GitHub: Free
- **Total: $0/month**

**Upgrade Option:**
- Render Backend: $7/month (always-on)
- Render Frontend: Free (static sites are always free)
- Supabase: Free tier sufficient
- **Total: $7/month**

## 🔄 Future Updates

To update your app:
1. Make changes locally
2. Push to GitHub: `git push origin main`
3. Render automatically detects and redeploys
4. Wait 3-5 minutes for deployment

## 📞 Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Your GitHub: https://github.com/maga1234-0/zenith1

---

**Ready to deploy? Start with Step 1!** 🚀
