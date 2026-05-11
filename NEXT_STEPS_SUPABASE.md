# Next Steps for Supabase & Vercel Deployment

## ✅ What's Been Done

### 1. TypeScript Issues Fixed
- **`@vercel/node` module not found**: Installed `@vercel/node` in server dependencies
- **`rootDir` issue**: Updated `api/tsconfig.json` to properly include server files
- **API handler**: Simplified to use `any` types (works with Express app)

### 2. Database Configuration Updated
- **`database.ts`**: Now supports both `DATABASE_URL` and individual connection parameters
- **SSL handling**: Automatically enabled for Supabase connections
- **Vercel ready**: Can use `DATABASE_URL` environment variable

### 3. Documentation Updated
- **`SUPABASE_NEW_PROJECT.md`**: Guide for your new Supabase project
- **`VERCEL_ENV_VARIABLES.md`**: Updated with your Supabase URL
- **`DEPLOYMENT_CHECKLIST.md`**: Updated with your Supabase project info

## 📋 What You Need to Do

### Step 1: Get Supabase Database Password
1. Go to https://app.supabase.com
2. Select your project: `hxvhkhwhhfwtthujkahx`
3. Go to **Settings → Database**
4. Find your **Database Password** (if not set, reset it)
5. Get the **Connection String** (format: `postgresql://postgres:[PASSWORD]@db.hxvhkhwhhfwtthujkahx.supabase.co:5432/postgres`)

### Step 2: Run SQL Scripts in Supabase
1. In Supabase, go to **SQL Editor**
2. Run these scripts in order:
   - `database/schema.sql`
   - `database/seed.sql`
   - `database/update-guests-phone-optional.sql`
   - `database/fix-room-status-constraint.sql`
   - `database/add-maintenance-fields.sql`
   - `database/update-notifications-table.sql`
   - `database/add-hotel-info-columns.sql`
   - `database/add-signature-column.sql`

### Step 3: Deploy to Vercel
1. Go to https://vercel.com
2. Sign in with GitHub
3. Import repository: `https://github.com/maga1234-0/Zen.git`
4. Configure project:
   - **Framework Preset**: `Other`
   - **Build Command**: `./build-vercel.sh`
   - **Output Directory**: `client/dist`
   - **Install Command**: `cd client && npm install && cd ../server && npm install`

### Step 4: Add Environment Variables in Vercel
Add these in Vercel dashboard (Settings → Environment Variables):

1. **DATABASE_URL**:
   ```
   postgresql://postgres:[YOUR_PASSWORD]@db.hxvhkhwhhfwtthujkahx.supabase.co:5432/postgres
   ```
   Replace `[YOUR_PASSWORD]` with your Supabase database password

2. **JWT_SECRET** (generate a secure random string):
   ```
   your-super-secret-jwt-key-minimum-32-characters-long
   ```

3. **NODE_ENV**:
   ```
   production
   ```

4. **VITE_API_URL** (after first deploy):
   ```
   https://your-app-name.vercel.app/api
   ```

### Step 5: Test Deployment
1. Visit your Vercel URL after deployment
2. Test login with:
   - Admin: `admin@hotel.com` / `password123`
   - Manager: `manager@hotel.com` / `password123`
   - Reception: `reception@hotel.com` / `password123`
3. Test language selection (Settings → French)

## 🔧 Important Notes

### For Local Development
- Current `.env` file uses local PostgreSQL (`localhost`)
- To test with Supabase, update `server/.env` with your Supabase credentials
- Or use `DATABASE_URL` environment variable

### For Production (Vercel)
- Uses `DATABASE_URL` environment variable
- SSL is automatically configured for Supabase
- CORS is configured for your Vercel domain

### Database Connection
- **Local**: Uses individual connection parameters from `.env`
- **Vercel**: Uses `DATABASE_URL` environment variable
- **Both work**: The updated `database.ts` handles both formats

## 🚀 Ready for Deployment

Your system is now:
- ✅ TypeScript compilation fixed
- ✅ Database configuration updated for Vercel
- ✅ Supabase credentials documented
- ✅ Build script ready
- ✅ API routes configured for serverless functions
- ✅ Multi-language support working

## 📞 Need Help?

If you encounter issues:
1. Check Vercel build logs
2. Verify database password is correct
3. Ensure SQL scripts ran successfully
4. Test database connection locally first

**Next**: Get your Supabase database password and deploy to Vercel!