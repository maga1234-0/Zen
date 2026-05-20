# PowerShell Script to Setup Backend Repository
Write-Host "🚀 Hotel PMS Backend Repository Setup" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "server")) {
    Write-Host "❌ Error: 'server' directory not found!" -ForegroundColor Red
    Write-Host "   Run this script from the project root (where 'server' folder exists)" -ForegroundColor Yellow
    exit 1
}

# Get GitHub username
$githubUser = Read-Host "Enter your GitHub username (e.g., 'aubin')"

# Create new directory
$backendDir = "hotel-pms-backend"
if (Test-Path $backendDir) {
    $choice = Read-Host "Directory '$backendDir' already exists. Overwrite? (y/n)"
    if ($choice -ne 'y') {
        Write-Host "❌ Aborted" -ForegroundColor Red
        exit 1
    }
    Remove-Item -Recurse -Force $backendDir -ErrorAction SilentlyContinue
}

Write-Host "📦 Creating new backend directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path $backendDir | Out-Null

# Copy server files
Write-Host "📁 Copying server files..." -ForegroundColor Yellow
Copy-Item -Recurse -Path "server\*" -Destination $backendDir -Force

# Copy deployment files
Write-Host "🔧 Copying deployment configuration..." -ForegroundColor Yellow
Copy-Item -Path "server\render.yaml" -Destination $backendDir -Force -ErrorAction SilentlyContinue
Copy-Item -Path "server\.renderignore" -Destination $backendDir -Force -ErrorAction SilentlyContinue
Copy-Item -Path "server\Dockerfile" -Destination $backendDir -Force -ErrorAction SilentlyContinue
Copy-Item -Path "server\setup-render.sh" -Destination $backendDir -Force -ErrorAction SilentlyContinue

# Clean up
Write-Host "🧹 Cleaning up for production..." -ForegroundColor Yellow
$cleanupPaths = @(
    "$backendDir\node_modules",
    "$backendDir\dist",
    "$backendDir\.env"
)

foreach ($path in $cleanupPaths) {
    if (Test-Path $path) {
        Remove-Item -Recurse -Force $path -ErrorAction SilentlyContinue
        Write-Host "   Removed: $path" -ForegroundColor Gray
    }
}

# Show next steps
Write-Host ""
Write-Host "✅ Backend directory prepared: $backendDir" -ForegroundColor Green
Write-Host ""
Write-Host "📝 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Create GitHub repository:" -ForegroundColor White
Write-Host "   Go to: https://github.com/new" -ForegroundColor Gray
Write-Host "   Name: hotel-pms-backend" -ForegroundColor Gray
Write-Host "   DO NOT initialize with README, .gitignore, or license" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Initialize git in the new directory:" -ForegroundColor White
Write-Host "   cd $backendDir" -ForegroundColor Gray
Write-Host "   git init" -ForegroundColor Gray
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Initial commit'" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git remote add origin https://github.com/$githubUser/hotel-pms-backend.git" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Deploy to Render:" -ForegroundColor White
Write-Host "   Follow guide in DEPLOY_BACKEND_TO_RENDER.md" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Update frontend API URL:" -ForegroundColor White
Write-Host "   In Vercel, update VITE_API_URL to: https://[your-render-service].onrender.com/api" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Detailed instructions in: CREATE_BACKEND_REPO.md" -ForegroundColor Yellow