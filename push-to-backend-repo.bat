@echo off
echo 🚀 Pushing Hotel PMS Backend to GitHub Repository
echo =================================================
echo.

echo 📦 Repository URL: https://github.com/maga1234-0/zen_backend-.git
echo.

REM Step 1: Clean up server directory
echo 🧹 Step 1: Cleaning up server directory...
if exist "server\node_modules" (
    echo   Removing node_modules...
    rmdir /s /q "server\node_modules"
)

if exist "server\dist" (
    echo   Removing dist folder...
    rmdir /s /q "server\dist"
)

if exist "server\.env" (
    echo   Removing .env file (contains secrets)...
    del /q "server\.env"
)

echo ✅ Cleanup complete!
echo.

REM Step 2: Clone the empty repository
echo 📥 Step 2: Cloning your backend repository...
if exist "zen_backend" (
    echo   Removing existing zen_backend directory...
    rmdir /s /q "zen_backend"
)

git clone https://github.com/maga1234-0/zen_backend-.git zen_backend
if errorlevel 1 (
    echo ❌ Failed to clone repository!
    pause
    exit /b 1
)

echo ✅ Repository cloned!
echo.

REM Step 3: Copy server files to repository
echo 📁 Step 3: Copying server files...
xcopy "server\*" "zen_backend\" /E /I /H /Y

echo ✅ Files copied!
echo.

REM Step 4: Navigate to repository and initialize git
echo 🔧 Step 4: Setting up git...
cd zen_backend

REM Remove any existing git history (since it's empty)
if exist ".git" (
    rmdir /s /q ".git"
)

REM Initialize fresh git repository
git init
git add .
git commit -m "Initial commit: Hotel PMS Backend API"
git branch -M main
git remote add origin https://github.com/maga1234-0/zen_backend-.git

echo ✅ Git initialized!
echo.

REM Step 5: Push to GitHub
echo 📤 Step 5: Pushing to GitHub...
git push -u origin main --force
if errorlevel 1 (
    echo ❌ Failed to push to GitHub!
    echo.
    echo 🔧 Troubleshooting:
    echo   1. Check your internet connection
    echo   2. Verify GitHub credentials
    echo   3. Try: git push -u origin main --force
    pause
    exit /b 1
)

echo.
echo 🎉 SUCCESS! Backend pushed to GitHub!
echo.
echo 📋 Next steps:
echo   1. Deploy to Render: https://dashboard.render.com
echo   2. Set environment variables (see .env.render.example)
echo   3. Update frontend VITE_API_URL in Vercel
echo.
echo 🌐 Your repository: https://github.com/maga1234-0/zen_backend-
echo 📚 Deployment guide: DEPLOY_BACKEND_TO_RENDER.md
echo.
pause