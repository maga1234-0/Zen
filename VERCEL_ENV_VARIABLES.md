# Vercel Environment Variables

## Copy These to Vercel Dashboard

When deploying to Vercel, add these environment variables:

### DATABASE_URL
```
postgresql://postgres:[YOUR_DATABASE_PASSWORD]@db.hxvhkhwhhfwtthujkahx.supabase.co:5432/postgres
```
**Replace `[YOUR_DATABASE_PASSWORD]` with your actual Supabase database password**

### JWT_SECRET
```
your-super-secret-jwt-key-minimum-32-characters-long-change-this-to-something-random
```
**Generate a secure random string (see below)**

### NODE_ENV
```
production
```

### CORS_ORIGIN
```
https://your-app-name.vercel.app
```
(Replace `your-app-name` with your actual Vercel deployment URL)

### VITE_API_URL
```
https://your-app-name.vercel.app/api
```
(Replace `your-app-name` with your actual Vercel deployment URL after first deploy)

---

## How to Add in Vercel

1. Go to your Vercel project
2. Click "Settings"
3. Click "Environment Variables"
4. Add each variable:
   - Name: `DATABASE_URL`
   - Value: `postgresql://postgres:[YOUR_DATABASE_PASSWORD]@db.hxvhkhwhhfwtthujkahx.supabase.co:5432/postgres`
   - Environment: Production, Preview, Development (select all)
   - Click "Save"

5. Repeat for all variables above

---

## Important Notes

- ⚠️ Keep these credentials SECRET
- ⚠️ Never commit them to GitHub
- ⚠️ Only add them in Vercel dashboard
- ⚠️ Change JWT_SECRET to something random and secure
- ⚠️ Get your database password from Supabase dashboard (Settings → Database)

---

## Generate Secure JWT_SECRET

Use one of these methods:

### Method 1: Online Generator
Visit: https://generate-secret.vercel.app/32

### Method 2: Node.js
```javascript
require('crypto').randomBytes(32).toString('hex')
```

### Method 3: PowerShell
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## Your Supabase Info (NEW PROJECT)

- **URL**: https://hxvhkhwhhfwtthujkahx.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4dmhraHdoaGZ3dHRodWprYWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDU3MzUsImV4cCI6MjA5NDA4MTczNX0.yLZmEIRwy6Yej5zid-I71P-0vYbBc3oxuUufGqKRv78
- **Database Password**: Get from Supabase dashboard (Settings → Database)

**Connection String Format:**
```
postgresql://postgres:[PASSWORD]@db.hxvhkhwhhfwtthujkahx.supabase.co:5432/postgres
```

---

## Next Steps

1. ⏳ Get database password from Supabase dashboard
2. ⏳ Update DATABASE_URL with your password
3. ⏳ Run SQL scripts in Supabase SQL Editor
4. ⏳ Deploy to Vercel
5. ⏳ Add environment variables
6. ⏳ Test deployment
