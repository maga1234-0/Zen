# PowerShell Script to Fix Port Issue and Deploy
Write-Host "🔧 Fixing Port Issue and Deploying" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Go to repository directory
Write-Host "📁 Step 1: Preparing files..." -ForegroundColor Yellow
Set-Location "zen_backend"

# Step 2: Copy updated server.js
Write-Host "📝 Step 2: Copying updated server.js..." -ForegroundColor Yellow
Copy-Item "..\server\server.js" "server.js" -Force
Write-Host "✅ Updated server.js copied" -ForegroundColor Green
Write-Host ""

# Step 3: Check git status
Write-Host "🔍 Step 3: Checking git status..." -ForegroundColor Yellow
git status
Write-Host ""

# Step 4: Add changes
Write-Host "📝 Step 4: Adding changes..." -ForegroundColor Yellow
git add server.js

if (-not $?) {
    Write-Host "❌ Failed to add changes" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Changes staged for commit" -ForegroundColor Green
Write-Host ""

# Step 5: Commit changes
Write-Host "💾 Step 5: Committing changes..." -ForegroundColor Yellow
git commit -m "fix: update server to use Railway PORT environment variable

- Use PORT from environment variable (default 10000 for Railway)
- Add better logging for debugging
- Add error handling for server startup
- Fix port mismatch issue"

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
Write-Host "🎉 SUCCESS! Server updated and deployed!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 What was fixed:" -ForegroundColor White
Write-Host "• Server now uses PORT from environment variable" -ForegroundColor Gray
Write-Host "• Default port is 10000 (Railway standard)" -ForegroundColor Gray
Write-Host "• Added better logging for debugging" -ForegroundColor Gray
Write-Host "• Added error handling for server startup" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Railway will auto-deploy the changes" -ForegroundColor Magenta
Write-Host "⏱️ Wait 2-3 minutes for deployment to complete" -ForegroundColor Gray
Write-Host ""
Write-Host "🔗 Test after deployment:" -ForegroundColor White
Write-Host "1. Health: https://hotel-pms-backend-production-2f06.up.railway.app/health" -ForegroundColor Gray
Write-Host "2. Login: https://hotel-pms-backend-production-2f06.up.railway.app/api/auth/login" -ForegroundColor Gray
Write-Host "3. Add staff: https://hotel-pms-backend-production-2f06.up.railway.app/api/users" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Your repository: https://github.com/maga1234-0/zen_backend-" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Check Railway logs if server doesn't start:" -ForegroundColor Magenta
Write-Host "1. Go to Railway dashboard" -ForegroundColor Gray
Write-Host "2. Select your service" -ForegroundColor Gray
Write-Host "3. Click 'Logs' tab" -ForegroundColor Gray
Write-Host "4. Look for error messages" -ForegroundColor Gray