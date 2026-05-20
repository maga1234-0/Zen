# PowerShell Script to Test Frontend-Backend Connection
Write-Host "🔗 Testing Frontend-Backend Connection" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

$backendUrl = "https://hotel-pms-backend-production-2f06.up.railway.app"
$frontendUrl = "https://zen-lyart.vercel.app"

Write-Host "Backend URL: $backendUrl" -ForegroundColor Yellow
Write-Host "Frontend URL: $frontendUrl" -ForegroundColor Yellow
Write-Host ""

# Step 1: Test backend directly
Write-Host "1. Testing backend endpoints..." -ForegroundColor White
try {
    $health = Invoke-RestMethod -Uri "$backendUrl/health" -Method Get
    Write-Host "   ✅ Backend health: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Backend health check failed: $_" -ForegroundColor Red
}

# Step 2: Test CORS
Write-Host "2. Testing CORS (frontend to backend)..." -ForegroundColor White
try {
    $headers = @{
        "Origin" = $frontendUrl
    }
    $corsTest = Invoke-WebRequest -Uri "$backendUrl/health" -Method Get -Headers $headers
    Write-Host "   ✅ CORS headers present" -ForegroundColor Green
    if ($corsTest.Headers['Access-Control-Allow-Origin']) {
        Write-Host "   Access-Control-Allow-Origin: $($corsTest.Headers['Access-Control-Allow-Origin'])" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ CORS test failed: $_" -ForegroundColor Red
}

# Step 3: Test login
Write-Host "3. Testing login endpoint..." -ForegroundColor White
try {
    $body = @{
        email = "admin@hotel.com"
        password = "password123"
    } | ConvertTo-Json
    
    $login = Invoke-RestMethod -Uri "$backendUrl/api/auth/login" -Method Post -Body $body -ContentType "application/json"
    Write-Host "   ✅ Login successful" -ForegroundColor Green
    $token = $login.token
    Write-Host "   Token received: $($token -ne $null)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Login failed: $_" -ForegroundColor Red
}

# Step 4: Test staff endpoint with token
Write-Host "4. Testing staff endpoint with authentication..." -ForegroundColor White
if ($token) {
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        $staff = Invoke-RestMethod -Uri "$backendUrl/api/users" -Method Get -Headers $headers
        Write-Host "   ✅ Staff endpoint works with authentication" -ForegroundColor Green
        Write-Host "   Found $($staff.Count) users" -ForegroundColor Gray
    } catch {
        Write-Host "   ❌ Staff endpoint failed: $_" -ForegroundColor Red
    }
} else {
    Write-Host "   ⚠️  Skipping - no token from login" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Diagnosis:" -ForegroundColor White
Write-Host "=============" -ForegroundColor Cyan
Write-Host "If backend tests pass but frontend still shows 'route not found':" -ForegroundColor Gray
Write-Host "1. Check browser console (F12 → Console) for errors" -ForegroundColor Gray
Write-Host "2. Verify VITE_API_URL in Vercel is set correctly" -ForegroundColor Gray
Write-Host "3. Check if frontend is sending Authorization header" -ForegroundColor Gray
Write-Host "4. Look for CORS errors in browser console" -ForegroundColor Gray
Write-Host ""
Write-Host "🔧 Common fixes:" -ForegroundColor White
Write-Host "1. Update Vercel VITE_API_URL to: $backendUrl/api" -ForegroundColor Gray
Write-Host "2. Check Railway CORS_ORIGIN is: $frontendUrl" -ForegroundColor Gray
Write-Host "3. Clear browser cache and reload" -ForegroundColor Gray