# 🚀 Hotel PMS - Complete Setup Guide

## Step-by-Step Installation

### Step 1: Install PostgreSQL

#### Windows
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer
3. Remember your postgres password
4. Default port: 5432

#### macOS
```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create Database

```bash
# Access PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE hotel_pms;

# Exit psql
\q
```

### Step 3: Setup Database Schema

```bash
# Navigate to project root
cd hotel-pms

# Run schema
psql -U postgres -d hotel_pms -f database/schema.sql

# Seed sample data
psql -U postgres -d hotel_pms -f database/seed.sql
```

### Step 4: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` file:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=hotel_pms
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173
```

```bash
# Start backend server
npm run dev
```

Backend should be running on http://localhost:5000

### Step 5: Frontend Setup

Open a new terminal:

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend should be running on http://localhost:5173

### Step 6: Access the Application

1. Open browser and go to http://localhost:5173
2. Use demo credentials:
   - Email: `admin@hotel.com`
   - Password: `password123`

## 🔧 Troubleshooting

### Database Connection Issues

**Error: "password authentication failed"**
```bash
# Reset postgres password
sudo -u postgres psql
ALTER USER postgres PASSWORD 'newpassword';
```

**Error: "database does not exist"**
```bash
createdb -U postgres hotel_pms
```

### Port Already in Use

**Backend (Port 5000)**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

**Frontend (Port 5173)**
```bash
# Change port in client/vite.config.ts
server: {
  port: 3000, // Change to any available port
}
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Rebuild TypeScript
npm run build
```

## 📦 Production Build

### Backend
```bash
cd server
npm run build
npm start
```

### Frontend
```bash
cd client
npm run build
# Serve the dist folder with any static server
```

## 🔐 Security Checklist for Production

- [ ] Change JWT_SECRET to a strong random string
- [ ] Update CORS_ORIGIN to your production domain
- [ ] Use environment variables for all sensitive data
- [ ] Enable SSL/TLS for database connections
- [ ] Set up proper firewall rules
- [ ] Use a reverse proxy (nginx/Apache)
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular database backups
- [ ] Update all dependencies

## 🌐 Deployment Options

### Backend
- Heroku
- AWS EC2
- DigitalOcean
- Railway
- Render

### Frontend
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

### Database
- AWS RDS
- Heroku Postgres
- DigitalOcean Managed Database
- Supabase

## 📊 Database Backup

```bash
# Backup
pg_dump -U postgres hotel_pms > backup.sql

# Restore
psql -U postgres hotel_pms < backup.sql
```

## 🎯 Next Steps

1. Customize the color scheme in `client/tailwind.config.js`
2. Add your hotel logo
3. Configure email notifications
4. Set up payment gateway integration
5. Add more room types
6. Customize reports
7. Add multi-language support

## 📞 Need Help?

- Check the README.md for API documentation
- Review the code comments
- Open an issue on GitHub
- Contact support

Happy coding! 🎉
