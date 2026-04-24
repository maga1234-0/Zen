# Vercel Deployment - Quick Start

## 3 Simple Steps

### 1️⃣ Setup Database (5 minutes)
- Go to https://supabase.com
- Create project
- Run SQL scripts from `database/` folder
- Copy connection string

### 2️⃣ Push to GitHub (2 minutes)
- Use GitHub Desktop: https://desktop.github.com/
- Add repository
- Publish to GitHub

### 3️⃣ Deploy to Vercel (5 minutes)
- Go to https://vercel.com
- Import from GitHub
- Add environment variables:
  - `DATABASE_URL` (from Supabase)
  - `JWT_SECRET` (random string)
  - `VITE_API_URL` (your Vercel URL + /api)
- Click Deploy

## Environment Variables

```
DATABASE_URL=postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres
JWT_SECRET=your-secret-key-min-32-chars
NODE_ENV=production
PORT=5000
VITE_API_URL=https://your-app.vercel.app/api
```

## Test Login

- URL: https://your-app.vercel.app
- Email: admin@hotel.com
- Password: admin123

## Files Needed

✅ `vercel.json` - Already created
✅ `client/.env.production` - Already created
✅ Database scripts - In `database/` folder

## Total Time: ~15 minutes

## Cost: $0 (Free tier)

---

**Read `VERCEL_STEP_BY_STEP.md` for detailed instructions**
