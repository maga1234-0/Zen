# PowerShell Script to Test Railway Endpoints
Write-Host "🔍 Testing Railway Backend Endpoints" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Backend URL: https://hotel-pms-backend-production-2f06.up.railway.app" -ForegroundColor Yellow
Write-Host ""

$baseUrl = "https://hotel-pms-backend-production-2f06.up.railway.app"

# Test 1: Health endpoint
Write-Host "1. Testing /health endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get -ErrorAction Stop
    Write-Host "   ✅ Health check: $($health.status)" -ForegroundColor Green
    Write-Host "   Timestamp: $($health.timestamp)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Health check failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: API root endpoint
Write-Host "2. Testing /api endpoint..." -ForegroundColor Yellow
try {
    $api = Invoke-RestMethod -Uri "$baseUrl/api" -Method Get -ErrorAction Stop
    Write-Host "   ✅ API root: Working" -ForegroundColor Green
    Write-Host "   Response: $($api | ConvertTo-Json -Compress)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ API root failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: Test with Accept header
Write-Host "3. Testing with Accept header..." -ForegroundColor Yellow
try {
    $headers = @{
        "Accept" = "application/json"
    }
    $apiWithHeader = Invoke-RestMethod -Uri "$baseUrl/api" -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "   ✅ With Accept header: Working" -ForegroundColor Green
} catch {
    Write-Host "   ❌ With Accept header failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 4: Test login endpoint (should fail without credentials)
Write-Host "4. Testing /api/auth/login endpoint (should fail without credentials)..." -ForegroundColor Yellow
try {
    $login = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body (@{email="test";password="test"} | ConvertTo-Json) -ContentType "application/json" -ErrorAction Stop
    Write-Host "   ✅ Login endpoint exists" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Login endpoint error (expected): $($_.Exception.Message)" -ForegroundColor Gray
}
Write-Host ""

# Test 5: Check if server is responding at all
Write-Host "5. Testing server response..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $baseUrl -Method Get -ErrorAction Stop
    Write-Host "   ✅ Server responding with status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Content type: $($response.Headers['Content-Type'])" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Server not responding: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "📋 Summary:" -ForegroundColor White
Write-Host "===========" -ForegroundColor Cyan
Write-Host "• Health endpoint: ✅ Working" -ForegroundColor Green
Write-Host "• API endpoints: ❌ Not working (might be CORS or route issue)" -ForegroundColor Red
Write-Host "• Server: ⚠️  Partially working" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔧 Possible issues:" -ForegroundColor White
Write-Host "1. CORS configuration might be blocking requests" -ForegroundColor Gray
Write-Host "2. Routes might not be properly registered" -ForegroundColor Gray
Write-Host "3. Server might be crashing on startup" -ForegroundColor Gray
Write-Host "4. Check Railway logs for errors" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Magenta
Write-Host "1. Check Railway deployment logs" -ForegroundColor Gray
Write-Host "2. Verify environment variables are set correctly" -ForegroundColor Gray
Write-Host "3. Test with Postman or curl from command line" -ForegroundColor Gray