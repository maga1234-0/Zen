# PowerShell Script to Update Dockerfile and Push to GitHub
Write-Host "🔧 Updating Dockerfile and Pushing to GitHub" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Repository: https://github.com/maga1234-0/zen_backend-.git" -ForegroundColor Yellow
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

# Step 2: Check git status
Write-Host "🔍 Step 2: Checking git status..." -ForegroundColor Yellow
git status
Write-Host ""

# Step 3: Add updated Dockerfile
Write-Host "📝 Step 3: Adding updated Dockerfile..." -ForegroundColor Yellow
git add Dockerfile

if (-not $?) {
    Write-Host "❌ Failed to add Dockerfile" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dockerfile staged for commit" -ForegroundColor Green
Write-Host ""

# Step 4: Commit changes
Write-Host "💾 Step 4: Committing changes..." -ForegroundColor Yellow
git commit -m "fix: update Dockerfile to install all dependencies before building

- Use multi-stage build to install devDependencies for TypeScript compilation
- Fixes 'sh: tsc: not found' error during build
- Builder stage installs all dependencies and compiles TypeScript
- Production stage only installs production dependencies for smaller image"

if (-not $?) {
    Write-Host "❌ Failed to commit changes" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Changes committed" -ForegroundColor Green
Write-Host ""

# Step 5: Push to GitHub
Write-Host "📤 Step 5: Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if (-not $?) {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host "💡 Try running: git push origin main" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host ""

# Step 6: Return to original directory
Write-Host "↩️ Step 6: Returning to original directory..." -ForegroundColor Yellow
Set-Location ".."

Write-Host ""
Write-Host "🎉 SUCCESS! Dockerfile updated and pushed to GitHub!" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 What was fixed:" -ForegroundColor White
Write-Host "• Dockerfile now uses multi-stage build" -ForegroundColor Gray
Write-Host "• Builder stage installs ALL dependencies (including TypeScript)" -ForegroundColor Gray
Write-Host "• Production stage only installs production dependencies" -ForegroundColor Gray
Write-Host "• Fixes 'sh: tsc: not found' error during Railway/Render build" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Your repository: https://github.com/maga1234-0/zen_backend-" -ForegroundColor Yellow
Write-Host "📦 Dockerfile is now ready for Railway/Render deployment" -ForegroundColor Yellow
Write-Host ""
Write-Host "⏱️ Next: Deploy to Railway using the updated Dockerfile" -ForegroundColor Magenta