# PowerShell Script to Deploy Simple Server
Write-Host "🚀 Deploying Simple Server to Railway" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Go to repository directory
Write-Host "📁 Step 1: Preparing files..." -ForegroundColor Yellow
Set-Location "zen_backend"

# Step 2: Copy simple server files
Write-Host "📝 Step 2: Copying simple server files..." -ForegroundColor Yellow
Copy-Item "..\server\src\server-simple.ts" "src\server-simple.ts" -Force
Copy-Item "..\server\package.json" "package.json" -Force
Write-Host "✅ Files copied" -ForegroundColor Green
Write-Host ""

# Step 3: Update start command in package.json
Write-Host "🔧 Step 3: Updating start command..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
$packageJson.scripts.start = "node -r ts-node/register src/server-simple.ts"
$packageJson | ConvertTo-Json -Depth 10 | Out-File "package.json" -Encoding UTF8
Write-Host "✅ Start command updated to use simple server" -ForegroundColor Green
Write-Host ""

# Step 4: Check git status
Write-Host "🔍 Step 4: Checking git status..." -ForegroundColor Yellow
git status
Write-Host ""

# Step 5: Add changes
Write-Host "📝 Step 5: Adding changes..." -ForegroundColor Yellow
git add src/server-simple.ts package.json

if (-not $?) {
    Write-Host "❌ Failed to add changes" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Changes staged for commit" -ForegroundColor Green
Write-Host ""

# Step 6: Commit changes
Write-Host "💾 Step 6: Committing changes..." -ForegroundColor Yellow
git commit -m "feat: deploy simple server with basic endpoints

- Add server-simple.ts with essential endpoints
- Update start command to use simple server
- Includes: /, /health, /api, /api/auth/login, /api/users, /api/rooms
- Fixes 'Cannot GET /' and 'route not found' issues
- Better error handling and logging"

if (-not $?) {
    Write-Host "❌ Failed to commit changes" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Changes committed" -ForegroundColor Green
Write-Host ""

# Step 7: Push to GitHub
Write-Host "📤 Step 7: Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if (-not $?) {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host "💡 Try running: git push origin main" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host ""

# Step 8: Return to original directory
Write-Host "↩️ Step 8: Returning to original directory..." -ForegroundColor Yellow
Set-Location ".."

Write-Host ""
Write-Host "🎉 SUCCESS! Simple server deployed to Railway!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 What was deployed:" -ForegroundColor White
Write-Host "• Simple server with essential endpoints" -ForegroundColor Gray
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
Write-Host "💡 After confirming the backend works, update frontend:" -ForegroundColor Magenta
Write-Host "1. Update VITE_API_URL in Vercel to point to Railway" -ForegroundColor Gray
Write-Host "2. Test login and staff management" -ForegroundColor Gray