# Cleanup script for backend repository
Write-Host "🧹 Cleaning up server directory..." -ForegroundColor Yellow

# Remove node_modules (too large for git)
if (Test-Path "server\node_modules") {
    Remove-Item -Recurse -Force "server\node_modules"
    Write-Host "  Removed: node_modules" -ForegroundColor Gray
}

# Remove dist folder (will be rebuilt on Render)
if (Test-Path "server\dist") {
    Remove-Item -Recurse -Force "server\dist"
    Write-Host "  Removed: dist" -ForegroundColor Gray
}

# Remove .env file (contains secrets)
if (Test-Path "server\.env") {
    Remove-Item -Force "server\.env"
    Write-Host "  Removed: .env (secrets)" -ForegroundColor Gray
}

# Remove unnecessary test files (optional)
 = @(
    "server\change-admin-password.js",
    "server\check-all-users.js", 
    "server\debug-login.js",
    "server\test-checkout-endpoint.js",
    "server\test-password.js",
    "server\test-supabase-connection.js",
    "server\vercel.json"
)

foreach ( in ) {
    if (Test-Path ) {
        Remove-Item -Force  -ErrorAction SilentlyContinue
        Write-Host "  Removed: " -ForegroundColor Gray
    }
}

Write-Host "✅ Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Essential files remaining:" -ForegroundColor Cyan
Get-ChildItem "server" -File | Select-Object -First 10 Name
