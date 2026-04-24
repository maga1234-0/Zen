# 🚀 Hotel PMS - Quick Reference Card

## 📦 Installation Commands

```bash
# Install all dependencies
npm run install:all

# Or manually:
cd server && npm install
cd ../client && npm install
```

## 🗄️ Database Setup

```bash
# Create database
createdb hotel_pms

# Run schema
psql -d hotel_pms -f database/schema.sql

# Seed data
psql -d hotel_pms -f database/seed.sql
```

## 🏃 Running the Application

```bash
# Terminal 1 - Backend
cd server
npm run dev
# Runs on http://localhost:5000

# Terminal 2 - Frontend
cd client
npm run dev
# Runs on http://localhost:5173
```

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hotel.com | password123 |
| Manager | manager@hotel.com | password123 |
| Receptionist | reception@hotel.com | password123 |

## 🎨 Color Palette

```css
/* Seafoam Teal - Primary */
#20B2AA

/* Grey Brown - Secondary */
#8B7D6B

/* Yellow Gold - Accent */
#FFD700

/* Mint Light - Background */
#F0FFF4
```

## 📁 Key Files

### Backend
- `server/src/server.ts` - Main server file
- `server/src/routes/` - API routes
- `server/src/controllers/` - Business logic
- `server/src/middleware/auth.ts` - Authentication
- `server/.env` - Environment variables

### Frontend
- `client/src/App.tsx` - Main app component
- `client/src/pages/Dashboard.tsx` - Dashboard page
- `client/src/components/` - Reusable components
- `client/src/store/authStore.ts` - Auth state
- `client/tailwind.config.js` - Tailwind config

### Database
- `database/schema.sql` - Database schema
- `database/seed.sql` - Sample data

## 🛠️ Common Tasks

### Add New API Endpoint
1. Create controller in `server/src/controllers/`
2. Create route in `server/src/routes/`
3. Add route to `server/src/routes/index.ts`

### Add New Page
1. Create page in `client/src/pages/`
2. Add route in `client/src/App.tsx`
3. Add menu item in `client/src/components/layout/Sidebar.tsx`

### Add New Component
1. Create in `client/src/components/`
2. Export from component file
3. Import where needed

## 📊 Database Tables

| Table | Purpose |
|-------|---------|
| users | Staff accounts |
| hotels | Hotel information |
| rooms | Room inventory |
| room_types | Room categories |
| guests | Guest information |
| bookings | Reservations |
| payments | Payment records |
| invoices | Billing documents |
| notifications | User alerts |
| audit_logs | Activity tracking |

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hotel_pms
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

## 🧪 Testing API with cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hotel.com","password":"password123"}'

# Get stats (replace TOKEN)
curl http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer TOKEN"
```

## 📱 Tech Stack Quick Reference

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- React Query
- Zustand
- React Router

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- JWT
- Bcrypt

## 🐛 Troubleshooting

### Port in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Database connection error
```bash
# Check PostgreSQL is running
pg_isready

# Restart PostgreSQL
brew services restart postgresql@14  # macOS
sudo systemctl restart postgresql    # Linux
```

### Module not found
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation Files

- `README.md` - Main documentation
- `SETUP_GUIDE.md` - Detailed setup instructions
- `API_DOCUMENTATION.md` - API reference
- `ARCHITECTURE.md` - System architecture
- `QUICK_REFERENCE.md` - This file

## 🎯 Next Steps After Setup

1. ✅ Verify database connection
2. ✅ Test login with demo credentials
3. ✅ Explore dashboard
4. ✅ Customize colors in `tailwind.config.js`
5. ✅ Add your hotel logo
6. ✅ Configure environment variables
7. ✅ Review API documentation
8. ✅ Start building additional features

## 💡 Pro Tips

- Use React Query DevTools for debugging
- Check browser console for errors
- Monitor server logs for API issues
- Use PostgreSQL GUI (pgAdmin, TablePlus)
- Enable dark mode in the UI
- Test with different user roles

## 🔗 Useful Links

- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- PostgreSQL: https://postgresql.org
- Express: https://expressjs.com
- Recharts: https://recharts.org

---

**Need Help?** Check the full documentation in README.md or SETUP_GUIDE.md
