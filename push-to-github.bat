@echo off
echo ========================================
echo Push Hotel PMS to GitHub
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    echo Then run this script again.
    pause
    exit /b 1
)

echo Git is installed. Proceeding...
echo.

REM Initialize git if not already initialized
if not exist .git (
    echo Initializing git repository...
    git init
    echo.
)

REM Add all files
echo Adding all files to git...
git add .
echo.

REM Commit
echo Creating commit...
set /p commit_message="Enter commit message (or press Enter for default): "
if "%commit_message%"=="" set commit_message=Update Hotel PMS code

git commit -m "%commit_message%"
echo.

REM Check if remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo Adding remote repository...
    git remote add origin https://github.com/maga1234-0/zenith1.git
    echo.
)

REM Set main branch
echo Setting main branch...
git branch -M main
echo.

REM Push to GitHub
echo Pushing to GitHub...
echo You will be prompted for your GitHub credentials.
echo Use your GitHub username and Personal Access Token (not password).
echo.
git push -u origin main

if errorlevel 1 (
    echo.
    echo ========================================
    echo Push failed! Common solutions:
    echo ========================================
    echo 1. Make sure you have access to the repository
    echo 2. Use Personal Access Token instead of password
    echo 3. Try: git pull origin main --allow-unrelated-histories
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
pause
