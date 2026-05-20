# 📁 Create New Backend Repository - Step by Step

## Prerequisites
- Git installed on your computer
- GitHub account
- Current project at: `c:\Users\aubin\Downloads\kiro1`

## Step 1: Create New GitHub Repository

1. Open browser: https://github.com/new
2. Fill in:
   - **Owner**: Your username
   - **Repository name**: `hotel-pms-backend`
   - **Description**: `Hotel Property Management System - Backend API`
   - **Public** ✓ (or Private if preferred)
   - **Initialize this repository with**: ❌ UNCHECK ALL (no README, .gitignore, license)
3. Click **Create repository**
4. Copy the repository URL (you'll need it later):
   ```
   https://github.com/YOUR_USERNAME/hotel-pms-backend.git
   ```

## Step 2: Prepare Backend Directory Locally

Open **Command Prompt** or **PowerShell** as Administrator:

```cmd
REM Navigate to your project
cd c:\Users\aubin\Downloads\kiro1

REM Create new directory for backend
mkdir hotel-pms-backend

REM Copy server files
xcopy server hotel-pms-backend /E /I /H /Y

REM Copy deployment files
copy render.yaml hotel-pms-backend\
copy .renderignore hotel-pms-backend\
copy Dockerfile hotel-pms-backend\
copy setup-render.sh hotel-pms-backend\

REM Navigate to new directory
cd hotel-pms-backend
```

## Step 3: Clean Up for Production

```cmd
REM Remove development files to reduce size
rmdir /s /q node_modules
rmdir /s /q dist

REM Remove unnecessary files (optional)
del /q *.log 2>nul
del /q .env 2>nul
```

## Step 4: Initialize Git Repository

```cmd
REM Initialize git
git init

REM Add all files
git add .

REM Create initial commit
git commit -m "Initial commit: Hotel PMS Backend API"

REM Rename branch to main
git branch -M main

REM Add remote repository (use YOUR URL from Step 1)
git remote add origin https://github.com/YOUR_USERNAME/hotel-pms-backend.git

REM Push to GitHub
git push -u origin main
```

## Step 5: Verify Repository

1. Go to your GitHub: https://github.com/YOUR_USERNAME/hotel-pms-backend
2. Verify files are uploaded:
   - `package.json`
   - `src/` directory
   - `render.yaml`
   - etc.

## Step 6: Prepare for Render Deployment

### 6.1 Generate JWT Secret
```cmd
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
**Save this output** - you'll need it for Render environment variables.

### 6.2 Get Database URL
From your Vercel environment variables or Supabase dashboard:
```
postgresql://postgres.hxvhkhwhhfwtthujkahx:[PASSWORD]@aws-1-eu-central-2.pooler.supabase.com:6543/postgres
```

### 6.3 Prepare Environment Variables Table

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | |
| `PORT` | `10000` | Render provides this |
| `DATABASE_URL` | Your Supabase URL | From above |
| `JWT_SECRET` | Generated secret | From Step 6.1 |
| `CORS_ORIGIN` | `https://zen-lyart.vercel.app` | Your frontend |
| `VERCEL` | `0` | Disable Vercel mode |

## Step 7: Deploy to Render

Follow the guide in `DEPLOY_BACKEND_TO_RENDER.md` or:

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect GitHub account
4. Select `hotel-pms-backend` repository
5. Configure:
   - **Name**: `hotel-pms-backend`
   - **Environment**: `Node`
   - **Region**: `Oregon` (or closest to you)
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
6. Add environment variables (from Step 6.3)
7. Click "Create Web Service"

## Step 8: Update Frontend

Once backend is deployed (e.g., to `https://hotel-pms-backend.onrender.com`):

1. Go to Vercel dashboard: https://vercel.com
2. Select your `zen-lyart` project
3. Go to Settings → Environment Variables
4. **Update `VITE_API_URL`** to:
   ```
   https://hotel-pms-backend.onrender.com/api
   ```
5. Save - Vercel will auto-redeploy

## Step 9: Test Everything

### Test Backend:
```
https://hotel-pms-backend.onrender.com/health
https://hotel-pms-backend.onrender.com/api
```

### Test Frontend:
1. Open: https://zen-lyart.vercel.app
2. Login: `admin@hotel.com` / `password123`
3. Test features:
   - Staff management
   - Room management
   - Bookings
   - etc.

## Troubleshooting

### If Git push fails:
```cmd
REM Force push (if first time)
git push -u origin main --force

REM Or if remote exists
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/hotel-pms-backend.git
git push -u origin main
```

### If files are too large:
```cmd
REM Remove large unnecessary files
del /q package-lock.json 2>nul
rmdir /s /q .git 2>nul

REM Reinitialize
git init
git add .
git commit -m "Clean initial commit"
```

### If Render build fails:
1. Check Render logs
2. Test locally: `npm run build`
3. Verify Node.js version: `node --version` (should be ≥18)

## Success Checklist

- [ ] GitHub repository created
- [ ] Backend code pushed to GitHub
- [ ] Render web service created
- [ ] Environment variables set
- [ ] Backend deployed successfully
- [ ] Frontend updated with new API URL
- [ ] Login works on production
- [ ] All features tested

## Need Help?

1. Check error messages in Render logs
2. Verify environment variables are correct
3. Test API endpoints directly
4. Check browser console (F12) for frontend errors

## Estimated Time: 20-30 minutes

Your backend is production-ready. The main work is copying files and setting up Render.