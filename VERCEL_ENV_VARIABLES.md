# Vercel Environment Variables

## Copy These to Vercel Dashboard

When deploying to Vercel, add these environment variables:

### DATABASE_URL
```
postgresql://postgres:QRHxAWQ3YOBeYmCW@db.sikmnuxzpozgljbndapt.supabase.co:5432/postgres
```

### JWT_SECRET
```
your-super-secret-jwt-key-minimum-32-characters-long-change-this-to-something-random
```

### NODE_ENV
```
production
```

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
   - Value: `postgresql://postgres:QRHxAWQ3YOBeYmCW@db.sikmnuxzpozgljbndapt.supabase.co:5432/postgres`
   - Environment: Production, Preview, Development (select all)
   - Click "Save"

5. Repeat for all variables above

---

## Important Notes

- ⚠️ Keep these credentials SECRET
- ⚠️ Never commit them to GitHub
- ⚠️ Only add them in Vercel dashboard
- ⚠️ Change JWT_SECRET to something random and secure

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

## Your Supabase Info

- **URL**: https://sikmnuxzpozgljbndapt.supabase.co
- **Database Password**: QRHxAWQ3YOBeYmCW
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpa21udXh6cG96Z2xqYm5kYXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5OTU4NjEsImV4cCI6MjA5MjU3MTg2MX0.IvVRVFbiI43t5_kZe6KT5xjbw0PDNaOvEQ4xl0jcsPQ

---

## Next Steps

1. ✅ Database created (Done!)
2. ⏳ Run SQL scripts in Supabase
3. ⏳ Deploy to Vercel
4. ⏳ Add environment variables
5. ⏳ Test deployment
