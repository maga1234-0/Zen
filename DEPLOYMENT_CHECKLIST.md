# 🚀 Vercel Deployment Checklist

## ✅ Completed Steps

### 1. Code Preparation
- [x] Fixed language selection system (English/French/Spanish)
- [x] Updated Vercel configuration (`vercel.json`)
- [x] Updated build script (`build-vercel.sh`)
- [x] Set production API URL to `/api`
- [x] Added login page translations
- [x] Code pushed to GitHub: `https://github.com/maga1234-0/Zen.git`

### 2. Code Status
- **Repository**: `https://github.com/maga1234-0/Zen.git`
- **Branch**: `main`
- **Latest commit**: Includes all language fixes and Vercel configuration

## 📋 Next Steps for Deployment

### 1. Setup PostgreSQL Database (Supabase)
- [x] ✅ Supabase project created: `hxvhkhwhhfwtthujkahx.supabase.co`
- [x] ✅ Anon key obtained
- [ ] Get Database Password from Supabase dashboard (Settings → Database)
- [ ] Get Connection String from Settings → Database
- [ ] Run SQL scripts in SQL Editor (in order):
  1. `database/schema.sql`
  2. `database/seed.sql`
  3. `database/update-guests-phone-optional.sql`
  4. `database/fix-room-status-constraint.sql`
  5. `database/add-maintenance-fields.sql`
  6. `database/update-notifications-table.sql`
  7. `database/add-hotel-info-columns.sql`
  8. `database/add-signature-column.sql`

### 2. Deploy to Vercel
- [ ] Go to https://vercel.com
- [ ] Sign up/login with GitHub
- [ ] Click "Add New" → "Project"
- [ ] Import `Zen` repository
- [ ] Configure project:
  - **Framework Preset**: `Other`
  - **Root Directory**: `/` (default)
  - **Build Command**: `./build-vercel.sh`
  - **Output Directory**: `client/dist`
  - **Install Command**: `cd client && npm install && cd ../server && npm install`

### 3. Configure Environment Variables in Vercel
- [ ] Add these environment variables:
  ```
  DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.hxvhkhwhhfwtthujkahx.supabase.co:5432/postgres
  JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
  NODE_ENV=production
  PORT=5000
  CORS_ORIGIN=https://your-app-name.vercel.app
  ```
  **Replace `[YOUR_PASSWORD]` with your Supabase database password**

### 4. Deploy & Test
- [ ] Click "Deploy" in Vercel
- [ ] Wait for deployment to complete
- [ ] Visit your Vercel URL
- [ ] Test login with demo accounts:
  - Admin: `admin@hotel.com` / `password123`
  - Manager: `manager@hotel.com` / `password123`
  - Reception: `reception@hotel.com` / `password123`
- [ ] Test language selection (Settings → Language → French)
- [ ] Test all major features

## 🔧 Troubleshooting

### If build fails:
1. Check Vercel build logs
2. Verify all dependencies are in package.json files
3. Check Node.js version (server uses Node 18)

### If API calls fail:
1. Check environment variables in Vercel
2. Verify database connection string
3. Check CORS configuration

### If database connection fails:
1. Verify `DATABASE_URL` is correct
2. Check if database allows external connections
3. Ensure SSL is configured (Supabase requires SSL)

### If language doesn't persist:
1. Check browser console for errors
2. Verify localStorage is working
3. Check database `user_settings` table has `language` column

## 🌐 Multi-Language Support

The system now supports:
- **English** (default)
- **French** (Français) - Complete translations
- **Spanish** (Español) - Complete translations

**To set system to French:**
1. Login to the system
2. Go to Settings page
3. Select "French" from Language dropdown
4. Click "Save Changes"
5. Refresh page to verify language persists

## 📞 Support

- **GitHub Issues**: https://github.com/maga1234-0/Zen/issues
- **Email**: aubinmaga@gmail.com

## 🎯 Success Criteria

- [ ] Application deployed to Vercel
- [ ] Database connected and migrations run
- [ ] Users can login with demo accounts
- [ ] Language selection works (English/French/Spanish)
- [ ] All major features functional
- [ ] System accessible via public URL

---

**Ready to deploy!** Your code is on GitHub and configured for Vercel. Follow the steps above to complete deployment.