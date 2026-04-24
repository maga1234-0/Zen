@echo off
echo ========================================
echo Connect Project to GitHub Repository
echo ========================================
echo.
echo Repository: https://github.com/maga1234-0/zenith1.git
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo Git is installed. Proceeding...
echo.

REM Check if already initialized
if exist .git (
    echo Git repository already initialized.
    echo.
) else (
    echo Initializing git repository...
    git init
    echo.
)

REM Add all files
echo Adding all files...
git add .
echo.

REM Commit
echo Creating commit...
set /p commit_message="Enter commit message (or press Enter for default): "
if "%commit_message%"=="" set commit_message=Initial commit: Complete Hotel PMS

git commit -m "%commit_message%"
echo.

REM Check if remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo Adding remote repository...
    git remote add origin https://github.com/maga1234-0/zenith1.git
    echo.
) else (
    echo Remote repository already configured.
    echo.
)

REM Set main branch
echo Setting main branch...
git branch -M main
echo.

REM Push to GitHub
echo ========================================
echo Pushing to GitHub...
echo ========================================
echo.
echo You will be prompted for credentials:
echo - Username: Your GitHub username
echo - Password: Use Personal Access Token (NOT your password)
echo.
echo Get token from: https://github.com/settings/tokens
echo.
pause
echo.

git push -u origin main

if errorlevel 1 (
    echo.
    echo ========================================
    echo Push failed! Common solutions:
    echo ========================================
    echo.
    echo 1. Make sure you used Personal Access Token (not password)
    echo 2. Get token from: https://github.com/settings/tokens
    echo 3. If repository has files, try:
    echo    git pull origin main --allow-unrelated-histories
    echo    Then run this script again
    echo.
    echo 4. If remote exists error:
    echo    git remote remove origin
    echo    Then run this script again
    echo ========================================
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Code pushed to GitHub
echo ========================================
echo.
echo View your repository at:
echo https://github.com/maga1234-0/zenith1
echo.
echo Next steps:
echo 1. Verify files are on GitHub
echo 2. Deploy to Vercel (see VERCEL_STEP_BY_STEP.md)
echo.
pause
