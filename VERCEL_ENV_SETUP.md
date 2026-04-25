# 🔐 Vercel Environment Variables - Copy & Paste

## Required Environment Variables

Add these in Vercel Dashboard → Your Project → Settings → Environment Variables

---

### 1. DATABASE_URL
```
postgresql://postgres:QRHxAWQ3YOBeYmCW@db.sikmnuxzpozgljbndapt.supabase.co:5432/postgres
```

---

### 2. JWT_SECRET
```
your-super-secret-jwt-key-minimum-32-characters-long-please-change-this
```

---

### 3. NODE_ENV
```
production
```

---

### 4. CORS_ORIGIN
```
*
```
(Change to your Vercel URL after deployment for better security)

---

### 5. VITE_API_URL
```
/api
```

---

## ✅ Checklist

- [ ] DATABASE_URL added
- [ ] JWT_SECRET added
- [ ] NODE_ENV added
- [ ] CORS_ORIGIN added
- [ ] VITE_API_URL added
- [ ] All variables set to "Production, Preview, and Development"
- [ ] Clicked "Save"

## 🎯 Quick Deploy Steps

1. **Push to GitHub** (Already done ✅)
2. **Go to Vercel:** https://vercel.com
3. **Import Project:** Select `zenith1` repository
4. **Add Environment Variables:** Copy from above
5. **Deploy:** Click "Deploy" button
6. **Test:** Login with admin@hotel.com / admin123

---

**Need help?** Check `VERCEL_DEPLOYMENT_COMPLETE.md` for detailed instructions.
