# 🚀 Deploy Hotel PMS Backend to Render

This guide will help you deploy the Express backend server to Render (free tier available).

## Prerequisites

1. **GitHub account** (your code is already on GitHub)
2. **Render account** (sign up at https://render.com)
3. **Supabase database** (already set up)

## Step 1: Prepare Your Backend Code

Your backend is in the `server/` directory. It's already configured for production with:
- TypeScript build configuration
- Production start script (`npm start`)
- Environment variable support

## Step 2: Create a New GitHub Repository for Backend

Since your current repository has both frontend and backend, it's better to create a separate repository for the backend:

### Option A: Create New Repository (Recommended)
1. Go to https://github.com/new
2. Create a new repository named `hotel-pms-backend`
3. Clone your current repository locally
4. Copy only the `server/` directory to the new repository
5. Push to the new repository

### Option B: Use Subdirectory (Advanced)
Render can deploy from a subdirectory, but it's simpler to have a separate repository.

## Step 3: Deploy to Render

### 3.1 Create New Web Service
1. Log in to Render dashboard: https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub account if not already connected
4. Select your `hotel-pms-backend` repository

### 3.2 Configure Service
- **Name**: `hotel-pms-backend`
- **Environment**: `Node`
- **Region**: Choose closest to you (Oregon, Frankfurt, Singapore)
- **Branch**: `main`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: `Free`

### 3.3 Set Environment Variables
Click "Advanced" → "Add Environment Variable":

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | |
| `PORT` | `10000` | Render provides this |
| `DATABASE_URL` | Your Supabase URL | From Vercel env vars |
| `JWT_SECRET` | Generate a secure random string | Use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `CORS_ORIGIN` | `https://zen-lyart.vercel.app` | Your frontend URL |
| `VERCEL` | `0` | Disable Vercel mode |

**DATABASE_URL format:**
```
postgresql://postgres.hxvhkhwhhfwtthujkahx:[PASSWORD]@aws-1-eu-central-2.pooler.supabase.com:6543/postgres
```

### 3.4 Create Database (Optional)
If you want a separate database for production:
1. Click "New +" → "PostgreSQL"
2. Name: `hotel-pms-db`
3. Plan: `Free`
4. Connect to your web service

### 3.5 Deploy
Click "Create Web Service" → Render will:
1. Clone your repository
2. Install dependencies
3. Build TypeScript
4. Start the server

## Step 4: Update Frontend Configuration

Once your backend is deployed (e.g., to `https://hotel-pms-backend.onrender.com`):

### 4.1 Update Vercel Environment Variables
Go to Vercel dashboard → Project → Settings → Environment Variables:

1. **Update `VITE_API_URL`** to your Render backend URL:
   ```
   https://hotel-pms-backend.onrender.com/api
   ```

2. **Add/Update `CORS_ORIGIN`** in Render backend to match your frontend:
   ```
   https://zen-lyart.vercel.app
   ```

### 4.2 Redeploy Frontend
Vercel will automatically redeploy when you update environment variables.

## Step 5: Test Deployment

### 5.1 Test Backend
Open in browser:
- `https://hotel-pms-backend.onrender.com/health` - Should return `{"status":"OK"}`
- `https://hotel-pms-backend.onrender.com/api` - Should return API info

### 5.2 Test Frontend
1. Open `https://zen-lyart.vercel.app`
2. Login with `admin@hotel.com` / `password123`
3. Test features:
   - Staff management (add, edit, delete)
   - Room management
   - Bookings
   - etc.

## Step 6: Database Migration

Your Supabase database already has data from local development. To ensure it has all tables:

### Option A: Run SQL in Supabase
1. Go to Supabase dashboard → SQL Editor
2. Run the SQL from `database/schema.sql`
3. Run the SQL from `database/seed.sql` (optional)

### Option B: Use Migration Scripts
The server has migration scripts in `scripts/` directory.

## Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check `DATABASE_URL` format
   - Verify Supabase is running
   - Check if password is correct

2. **CORS Errors**
   - Ensure `CORS_ORIGIN` is set correctly
   - Should match your frontend URL exactly

3. **Build Failed**
   - Check Render logs
   - Verify TypeScript compiles locally: `npm run build`

4. **Application Crashes**
   - Check Render logs
   - Verify environment variables are set
   - Test locally with same env vars

### Checking Logs:
1. Render dashboard → Your service → "Logs"
2. Look for errors or warnings

## Monitoring

### Render Dashboard:
- Uptime monitoring
- Logs
- Metrics (CPU, memory, requests)

### Health Checks:
Render automatically checks `/health` endpoint

## Cost

- **Free tier**: 750 hours/month (enough for 24/7 on one service)
- **Database**: 1GB free on Supabase
- **No credit card required** for free tier

## Next Steps

1. **Set up custom domain** (optional)
2. **Enable auto-deploy** from GitHub
3. **Set up monitoring alerts**
4. **Backup database** regularly

## Support

- Render documentation: https://render.com/docs
- Render community: https://community.render.com
- Supabase documentation: https://supabase.com/docs


## Alternative: Deploy from Main Repository (Subdirectory)

If you don't want to create a separate repository, Render can deploy from a subdirectory:

### 1. Update render.yaml
```yaml
services:
  - type: web
    name: hotel-pms-backend
    env: node
    region: oregon
    plan: free
    rootDir: server  # <-- Add this line
    buildCommand: cd server && npm install && npm run build
    startCommand: cd server && npm start
    envVars:
      # ... same as before
```

### 2. Deploy from Main Repository
1. In Render, select your main repository (`kiro1` or whatever it's called)
2. Set "Root Directory" to `server`
3. Update build command: `cd server && npm install && npm run build`
4. Update start command: `cd server && npm start`

### 3. Push render.yaml to Main Repository
Add the `render.yaml` file to your main repository (in `server/` directory or root).

## Quick Start Commands

### Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Test Database Connection:
```bash
# In server directory
node test-supabase-connection.js
```

### Test Build Locally:
```bash
cd server
npm run build
npm start
# Server should start on http://localhost:5000
```