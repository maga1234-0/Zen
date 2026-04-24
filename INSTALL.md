# 🚀 Hotel PMS - Installation Scripts

## Quick Install (All Platforms)

### Prerequisites Check
```bash
# Check Node.js (need v18+)
node --version

# Check npm
npm --version

# Check PostgreSQL (need v14+)
psql --version
```

If any are missing, follow the platform-specific installation below.

---

## 🪟 Windows Installation

### 1. Install Node.js
```powershell
# Download from https://nodejs.org/
# Or use Chocolatey
choco install nodejs-lts
```

### 2. Install PostgreSQL
```powershell
# Download from https://www.postgresql.org/download/windows/
# Or use Chocolatey
choco install postgresql14

# Start PostgreSQL service
net start postgresql-x64-14
```

### 3. Setup Database
```powershell
# Open PowerShell as Administrator
cd hotel-pms

# Create database
& "C:\Program Files\PostgreSQL\14\bin\createdb.exe" -U postgres hotel_pms

# Run schema
& "C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres -d hotel_pms -f database\schema.sql

# Seed data
& "C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres -d hotel_pms -f database\seed.sql
```

### 4. Install Dependencies
```powershell
# Install all dependencies
npm run install:all

# Or manually
cd server
npm install
cd ..\client
npm install
cd ..
```

### 5. Configure Environment
```powershell
cd server
copy .env.example .env
# Edit .env with your database password
notepad .env
```

### 6. Run Application
```powershell
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend (new PowerShell window)
cd client
npm run dev
```

---

## 🍎 macOS Installation

### 1. Install Homebrew (if not installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Node.js
```bash
brew install node@18
```

### 3. Install PostgreSQL
```bash
# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Or start manually
pg_ctl -D /usr/local/var/postgres start
```

### 4. Setup Database
```bash
cd hotel-pms

# Create database
createdb hotel_pms

# Run schema
psql -d hotel_pms -f database/schema.sql

# Seed data
psql -d hotel_pms -f database/seed.sql
```

### 5. Install Dependencies
```bash
# Install all dependencies
npm run install:all

# Or manually
cd server && npm install
cd ../client && npm install
```

### 6. Configure Environment
```bash
cd server
cp .env.example .env
# Edit .env with your settings
nano .env
# or
code .env
```

### 7. Run Application
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend (new terminal tab)
cd client
npm run dev
```

---

## 🐧 Linux (Ubuntu/Debian) Installation

### 1. Update System
```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Install Node.js
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### 3. Install PostgreSQL
```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Set password for postgres user
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'your_password';"
```

### 4. Setup Database
```bash
cd hotel-pms

# Create database
sudo -u postgres createdb hotel_pms

# Run schema
sudo -u postgres psql -d hotel_pms -f database/schema.sql

# Seed data
sudo -u postgres psql -d hotel_pms -f database/seed.sql
```

### 5. Install Dependencies
```bash
# Install all dependencies
npm run install:all

# Or manually
cd server && npm install
cd ../client && npm install
```

### 6. Configure Environment
```bash
cd server
cp .env.example .env
# Edit .env
nano .env
```

### 7. Run Application
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend (new terminal)
cd client
npm run dev
```

---

## 🐳 Docker Installation (Optional)

### Create Dockerfile for Backend
```dockerfile
# server/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Create Dockerfile for Frontend
```dockerfile
# client/Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Create docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: hotel_pms
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/1-schema.sql
      - ./database/seed.sql:/docker-entrypoint-initdb.d/2-seed.sql

  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: hotel_pms
      DB_USER: postgres
      DB_PASSWORD: postgres
      JWT_SECRET: your_secret_key
    depends_on:
      - postgres

  frontend:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Run with Docker
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🔧 Troubleshooting

### PostgreSQL Connection Issues

**Windows:**
```powershell
# Check if PostgreSQL is running
Get-Service postgresql*

# Start service
net start postgresql-x64-14
```

**macOS:**
```bash
# Check status
brew services list

# Restart
brew services restart postgresql@14
```

**Linux:**
```bash
# Check status
sudo systemctl status postgresql

# Restart
sudo systemctl restart postgresql
```

### Port Already in Use

**Kill process on port 5000 (Backend):**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

**Kill process on port 5173 (Frontend):**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5173 | xargs kill -9
```

### Database Permission Issues

```bash
# Grant all privileges
sudo -u postgres psql
GRANT ALL PRIVILEGES ON DATABASE hotel_pms TO postgres;
\q
```

### Node Modules Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## ✅ Verification Steps

### 1. Check Database
```bash
psql -d hotel_pms -c "SELECT COUNT(*) FROM users;"
# Should return 3 users
```

### 2. Check Backend
```bash
curl http://localhost:5000/health
# Should return: {"status":"OK","timestamp":"..."}
```

### 3. Check Frontend
Open browser: http://localhost:5173
- Should see login page
- Try logging in with: admin@hotel.com / password123

### 4. Check API
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hotel.com","password":"password123"}'

# Should return token and user info
```

---

## 🎯 Post-Installation

### 1. Change Default Passwords
```bash
# Update .env file
JWT_SECRET=your_new_secret_key_here

# Update database passwords
psql -d hotel_pms
UPDATE users SET password_hash = '$2b$10$...' WHERE email = 'admin@hotel.com';
```

### 2. Configure for Production
- Set NODE_ENV=production
- Use strong JWT secret
- Enable SSL for database
- Set up reverse proxy (nginx)
- Configure firewall rules

### 3. Backup Database
```bash
# Create backup
pg_dump -U postgres hotel_pms > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U postgres hotel_pms < backup_20260413.sql
```

---

## 📚 Next Steps

1. ✅ Verify installation
2. ✅ Login to dashboard
3. ✅ Explore features
4. ✅ Read API documentation
5. ✅ Customize colors
6. ✅ Add your data
7. ✅ Deploy to production

---

## 🆘 Need Help?

- Check SETUP_GUIDE.md for detailed instructions
- Review QUICK_REFERENCE.md for common commands
- Check logs in terminal for errors
- Verify all prerequisites are installed
- Ensure ports 5000 and 5173 are available

---

**Installation complete! 🎉**

Access your Hotel PMS at: http://localhost:5173
