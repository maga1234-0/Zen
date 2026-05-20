# PowerShell script to generate JWT secret
Write-Host "🔐 Generating JWT Secret for Production" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Generate random 32-byte hex string
$jwtSecret = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Write-Host "✅ JWT Secret Generated:" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Cyan
Write-Host $jwtSecret -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 Copy this value and add it as JWT_SECRET in Railway:" -ForegroundColor White
Write-Host "1. Go to Railway dashboard → Your project → Variables" -ForegroundColor Gray
Write-Host "2. Add new variable: JWT_SECRET = $jwtSecret" -ForegroundColor Gray
Write-Host "3. Save and redeploy" -ForegroundColor Gray
Write-Host ""

Write-Host "⚠️  IMPORTANT:" -ForegroundColor Red
Write-Host "• Keep this secret safe!" -ForegroundColor Yellow
Write-Host "• Don't commit it to GitHub" -ForegroundColor Yellow
Write-Host "• Use only in production environment" -ForegroundColor Yellow
Write-Host ""

Write-Host "🎯 Environment Variables Checklist:" -ForegroundColor White
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "NODE_ENV=production" -ForegroundColor Gray
Write-Host "PORT=3000" -ForegroundColor Gray
Write-Host "DATABASE_URL=postgresql://postgres.hxvhkhwhhfwtthujkahx:CEQ17BlWx58MWdWY@aws-1-eu-central-2.pooler.supabase.com:6543/postgres" -ForegroundColor Gray
Write-Host "JWT_SECRET=$jwtSecret" -ForegroundColor Gray
Write-Host "CORS_ORIGIN=https://zen-lyart.vercel.app" -ForegroundColor Gray
Write-Host "VERCEL=0" -ForegroundColor Gray
Write-Host "JWT_EXPIRES_IN=7d" -ForegroundColor Gray