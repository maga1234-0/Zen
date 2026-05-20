# PowerShell Script to Fix Backend and Push to GitHub/Railway
Write-Host "🔧 Fixing Backend Server Issues" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Go to repository directory
Write-Host "📁 Step 1: Navigating to repository..." -ForegroundColor Yellow
Set-Location "zen_backend"

if (-not $?) {
    Write-Host "❌ Failed to navigate to zen_backend directory" -ForegroundColor Red
    exit 1
}

Write-Host "✅ In repository directory" -ForegroundColor Green
Write-Host ""

# Step 2: Copy fixed server.ts
Write-Host "📝 Step 2: Copying fixed server.ts..." -ForegroundColor Yellow
Copy-Item "..\server\src\server.ts" "src\server.ts" -Force
Write-Host "✅ Fixed server.ts copied" -ForegroundColor Green
Write-Host ""

# Step 3: Check git status
Write-Host "🔍 Step 3: Checking git status..." -ForegroundColor Yellow
git status
Write-Host ""

# Step 4: Add changes
Write-Host "📝 Step 4: Adding changes..." -ForegroundColor Yellow
git add src/server.ts

if (-not $?) {
    Write-Host "❌ Failed to add changes" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Changes staged for commit" -ForegroundColor Green
Write-Host ""

# Step 5: Commit changes
Write-Host "💾 Step 5: Committing changes..." -ForegroundColor Yellow
git commit -m "fix: add root endpoints and better error handling

- Add root '/' endpoint with API information
- Add '/api' endpoint listing available routes
- Add error handling for routes import
- Fix 'Cannot GET /' issue
- Improve error messages for debugging"

if (-not $?) {
    Write-Host "❌ Failed to commit changes" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Changes committed" -ForegroundColor Green
Write-Host ""

# Step 6: Push to GitHub
Write-Host "📤 Step 6: Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if (-not $?) {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host "💡 Try running: git push origin main" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host ""

# Step 7: Return to original directory
Write-Host "↩️ Step 7: Returning to original directory..." -ForegroundColor Yellow
Set-Location ".."

Write-Host ""
Write-Host "🎉 SUCCESS! Backend fixes pushed to GitHub!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 What was fixed:" -ForegroundColor White
Write-Host "• Added root '/' endpoint with API information" -ForegroundColor Gray
Write-Host "• Added '/api' endpoint listing available routes" -ForegroundColor Gray
Write-Host "• Added error handling for routes import" -ForegroundColor Gray
Write-Host "• Fixed 'Cannot GET /' issue" -ForegroundColor Gray
Write-Host "• Improved error messages for debugging" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Railway will auto-deploy the changes" -ForegroundColor Magenta
Write-Host "⏱️ Wait 2-3 minutes for deployment to complete" -ForegroundColor Gray
Write-Host ""
Write-Host "🔗 Test endpoints after deployment:" -ForegroundColor White
Write-Host "1. Root: https://hotel-pms-backend-production-2f06.up.railway.app/" -ForegroundColor Gray
Write-Host "2. API: https://hotel-pms-backend-production-2f06.up.railway.app/api" -ForegroundColor Gray
Write-Host "3. Health: https://hotel-pms-backend-production-2f06.up.railway.app/health" -ForegroundColor Gray
Write-Host "4. Add staff: https://hotel-pms-backend-production-2f06.up.railway.app/api/users (POST)" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Your repository: https://github.com/maga1234-0/zen_backend-" -ForegroundColor Yellow