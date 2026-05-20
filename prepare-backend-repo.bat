@echo off
echo 🚀 Preparing Hotel PMS Backend for new repository...
echo.

REM Create backup of current server directory
echo 📦 Creating backup of server directory...
xcopy "server" "server-backup" /E /I /H /Y
echo ✅ Backup created: server-backup/

echo.
echo 📋 Files to include in new repository:
echo - All files in server/ directory
echo - render.yaml (for Render deployment)
echo - .renderignore
echo - Dockerfile (optional)
echo - setup-render.sh
echo.

echo 🔧 Cleaning up for production...
REM Remove node_modules to reduce size
if exist "server\node_modules" (
    echo Removing node_modules...
    rmdir /s /q "server\node_modules"
)

REM Remove dist folder (will be rebuilt)
if exist "server\dist" (
    echo Removing dist folder...
    rmdir /s /q "server\dist"
)

echo.
echo ✅ Preparation complete!
echo.
echo 📝 Next steps:
echo 1. Create new directory for backend: mkdir hotel-pms-backend
echo 2. Copy server/ directory: xcopy server hotel-pms-backend /E /I /H /Y
echo 3. Copy deployment files: copy render.yaml hotel-pms-backend\
echo 4. Initialize git: cd hotel-pms-backend && git init
echo 5. Add files: git add .
echo 6. Commit: git commit -m "Initial commit"
echo 7. Add remote: git remote add origin https://github.com/YOUR_USERNAME/hotel-pms-backend.git
echo 8. Push: git push -u origin main
echo.
echo 🌐 Then deploy to Render using the guide in DEPLOY_BACKEND_TO_RENDER.md