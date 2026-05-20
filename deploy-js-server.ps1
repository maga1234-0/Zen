# PowerShell Script to Deploy JavaScript Server
Write-Host "🚀 Deploying JavaScript Server to Railway" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Go to repository directory
Write-Host "📁 Step 1: Preparing files..." -ForegroundColor Yellow
Set-Location "zen_backend"

# Step 2: Copy JavaScript server files
Write-Host "📝 Step 2: Copying JavaScript server files..." -ForegroundColor Yellow
Copy-Item "..\server\server.js" "server.js" -Force
Copy-Item "..\server\package.json" "package.json" -Force
Write-Host "✅ Files copied" -ForegroundColor Green
Write-Host ""

# Step 3: Check git status
Write-Host "🔍 Step 3: Checking git status..." -ForegroundColor Yellow
git status
Write-Host ""

# Step 4: Add changes
Write-Host "📝 Step 4: Adding changes..." -ForegroundColor Yellow
git add server.js package.json

if (-not $?) {
    Write-Host "❌ Failed to add changes" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Changes staged for commit" -ForegroundColor Green
Write-Host ""

# Step 5: Commit changes
Write-Host "💾 Step 5: Committing changes..." -ForegroundColor Yellow
git commit -m "feat: deploy JavaScript server for Railway

- Add server.js plain JavaScript server
- Update start command to use server.js
- No TypeScript compilation needed
- Includes all essential endpoints
- Fixes deployment and startup issues
- Better compatibility with Railway"

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
Write-Host "🎉 SUCCESS! JavaScript server deployed to Railway!" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 What was deployed:" -ForegroundColor White
Write-Host "• Plain JavaScript server (no TypeScript compilation)" -ForegroundColor Gray
Write-Host "• Root '/' endpoint with API information" -ForegroundColor Gray
Write-Host "• '/api' endpoint listing available routes" -ForegroundColor Gray
Write-Host "• '/api/auth/login' for authentication" -ForegroundColor Gray
Write-Host "• '/api/users' for staff management (GET/POST)" -ForegroundColor Gray
Write-Host "• '/api/rooms' and '/api/rooms/types' for room data" -ForegroundColor Gray
Write-Host "• Better error handling and logging" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Railway will auto-deploy the changes" -ForegroundColor Magenta
Write-Host "⏱️ Wait 2-3 minutes for deployment to complete" -ForegroundColor Gray
Write-Host ""
Write-Host "🔗 Test endpoints after deployment:" -ForegroundColor White
Write-Host "1. Root: https://hotel-pms-backend-production-2f06.up.railway.app/" -ForegroundColor Gray
Write-Host "2. API: https://hotel-pms-backend-production-2f06.up.railway.app/api" -ForegroundColor Gray
Write-Host "3. Health: https://hotel-pms-backend-production-2f06.up.railway.app/health" -ForegroundColor Gray
Write-Host "4. Login: https://hotel-pms-backend-production-2f06.up.railway.app/api/auth/login" -ForegroundColor Gray
Write-Host "5. Add staff: https://hotel-pms-backend-production-2f06.up.railway.app/api/users" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Your repository: https://github.com/maga1234-0/zen_backend-" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 IMPORTANT: After confirming backend works:" -ForegroundColor Magenta
Write-Host "1. Update VITE_API_URL in Vercel to: https://hotel-pms-backend-production-2f06.up.railway.app/api" -ForegroundColor Gray
Write-Host "2. Test login and staff management on frontend" -ForegroundColor Gray