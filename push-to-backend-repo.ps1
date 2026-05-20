# PowerShell Script to Push Backend to GitHub
Write-Host "🚀 Pushing Hotel PMS Backend to GitHub" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Repository: https://github.com/maga1234-0/zen_backend-.git" -ForegroundColor Yellow
Write-Host ""

# Step 1: Clean up server directory
Write-Host "🧹 Step 1: Cleaning up server directory..." -ForegroundColor Yellow

$cleanupPaths = @(
    "server\node_modules",
    "server\dist",
    "server\.env"
)

foreach ($path in $cleanupPaths) {
    if (Test-Path $path) {
        Remove-Item -Recurse -Force $path -ErrorAction SilentlyContinue
        Write-Host "  Removed: $(Split-Path $path -Leaf)" -ForegroundColor Gray
    }
}

Write-Host "✅ Cleanup complete!" -ForegroundColor Green
Write-Host ""

# Step 2: Clone the repository
Write-Host "📥 Step 2: Cloning your backend repository..." -ForegroundColor Yellow

$repoDir = "zen_backend"
if (Test-Path $repoDir) {
    Write-Host "  Removing existing directory..." -ForegroundColor Gray
    Remove-Item -Recurse -Force $repoDir -ErrorAction SilentlyContinue
}

try {
    git clone https://github.com/maga1234-0/zen_backend-.git $repoDir
    Write-Host "✅ Repository cloned!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to clone repository: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Copy server files
Write-Host "📁 Step 3: Copying server files..." -ForegroundColor Yellow
Copy-Item -Recurse -Path "server\*" -Destination $repoDir -Force
Write-Host "✅ Files copied!" -ForegroundColor Green
Write-Host ""

# Step 4: Set up git
Write-Host "🔧 Step 4: Setting up git..." -ForegroundColor Yellow
Set-Location $repoDir

# Remove existing .git if any
if (Test-Path ".git") {
    Remove-Item -Recurse -Force ".git" -ErrorAction SilentlyContinue
}

# Initialize fresh git repository
git init
git add .
git commit -m "Initial commit: Hotel PMS Backend API"
git branch -M main
git remote add origin https://github.com/maga1234-0/zen_backend-.git

Write-Host "✅ Git initialized!" -ForegroundColor Green
Write-Host ""

# Step 5: Push to GitHub
Write-Host "📤 Step 5: Pushing to GitHub..." -ForegroundColor Yellow
try {
    git push -u origin main --force
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to push: $_" -ForegroundColor Red
    Write-Host "💡 Try running: git push -u origin main --force" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🎉 SUCCESS! Backend code is now on GitHub!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor White
Write-Host "1. Deploy to Render:" -ForegroundColor Cyan
Write-Host "   Go to: https://dashboard.render.com" -ForegroundColor Gray
Write-Host "   Click 'New +' → 'Web Service'" -ForegroundColor Gray
Write-Host "   Connect GitHub → Select 'zen_backend-' repository" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Configure Render service:" -ForegroundColor Cyan
Write-Host "   Name: hotel-pms-backend" -ForegroundColor Gray
Write-Host "   Environment: Node" -ForegroundColor Gray
Write-Host "   Build Command: npm install && npm run build" -ForegroundColor Gray
Write-Host "   Start Command: npm start" -ForegroundColor Gray
Write-Host "   Plan: Free" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Set environment variables in Render:" -ForegroundColor Cyan
Write-Host "   NODE_ENV=production" -ForegroundColor Gray
Write-Host "   PORT=10000" -ForegroundColor Gray
Write-Host "   DATABASE_URL=your_supabase_url" -ForegroundColor Gray
Write-Host "   JWT_SECRET=generate_with: node -e `"console.log(require('crypto').randomBytes(32).toString('hex'))`"" -ForegroundColor Gray
Write-Host "   CORS_ORIGIN=https://zen-lyart.vercel.app" -ForegroundColor Gray
Write-Host "   VERCEL=0" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Update frontend:" -ForegroundColor Cyan
Write-Host "   Vercel dashboard → Settings → Environment Variables" -ForegroundColor Gray
Write-Host "   Update VITE_API_URL to: https://[your-render-service].onrender.com/api" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Your repository: https://github.com/maga1234-0/zen_backend-" -ForegroundColor Yellow
Write-Host "📚 Detailed guide: DEPLOY_BACKEND_TO_RENDER.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "⏱️ Estimated time: 10-15 minutes" -ForegroundColor Magenta