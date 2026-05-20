# PowerShell Script to Fix Railway Server Issues
Write-Host "🔧 Fixing Railway Server Issues" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create a simple test server to debug
Write-Host "1. Creating simple test server for debugging..." -ForegroundColor Yellow
$testServer = @"
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Basic CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json());

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Simple API test
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API is working',
    environment: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'not set'
  });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const { Pool } = await import('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    const result = await pool.query('SELECT 1 as test');
    await pool.end();
    
    res.json({ 
      database: 'connected',
      test: result.rows[0].test 
    });
  } catch (error: any) {
    res.status(500).json({ 
      database: 'error',
      error: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(\`🚀 Simple test server running on port \${PORT}\`);
  console.log(\`🌐 CORS Origin: \${process.env.CORS_ORIGIN || 'not set'}\`);
  console.log(\`🔧 NODE_ENV: \${process.env.NODE_ENV || 'development'}\`);
});

export default app;
"@

# Save to a test file
$testServer | Out-File -FilePath "server\src\test-server.ts" -Encoding UTF8
Write-Host "   ✅ Created test-server.ts" -ForegroundColor Green
Write-Host ""

# Step 2: Update package.json to add test script
Write-Host "2. Updating package.json with test script..." -ForegroundColor Yellow
$packageJsonPath = "server\package.json"
$packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json

# Add test script
$packageJson.scripts.test = "node -r ts-node/register src/test-server.ts"

# Save updated package.json
$packageJson | ConvertTo-Json -Depth 10 | Out-File -FilePath $packageJsonPath -Encoding UTF8
Write-Host "   ✅ Updated package.json" -ForegroundColor Green
Write-Host ""

# Step 3: Create a simple fix for the main server
Write-Host "3. Creating backup of original server.ts..." -ForegroundColor Yellow
Copy-Item "server\src\server.ts" "server\src\server.ts.backup" -Force
Write-Host "   ✅ Created backup" -ForegroundColor Green
Write-Host ""

# Step 4: Create a fixed version of server.ts
Write-Host "4. Creating fixed server.ts with better error handling..." -ForegroundColor Yellow
$fixedServer = @"
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🔧 Starting server with configuration:');
console.log(\`   PORT: \${PORT}\`);
console.log(\`   NODE_ENV: \${process.env.NODE_ENV || 'development'}\`);
console.log(\`   CORS_ORIGIN: \${process.env.CORS_ORIGIN || 'not set'}\`);
console.log(\`   VERCEL: \${process.env.VERCEL || 'not set'}\`);

// Middleware
app.use(helmet());

// CORS configuration - simplified for debugging
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API test endpoint working',
    timestamp: new Date().toISOString()
  });
});

// Try to load routes with error handling
try {
  console.log('📁 Attempting to load routes...');
  const routes = require('./routes').default;
  app.use('/api', routes);
  console.log('✅ Routes loaded successfully');
} catch (error: any) {
  console.error('❌ Failed to load routes:', error.message);
  console.error('Stack:', error.stack);
  
  // Provide a fallback API endpoint
  app.get('/api', (req, res) => {
    res.json({ 
      error: 'Routes failed to load',
      message: 'Check server logs for details',
      availableEndpoints: ['/health', '/api/test']
    });
  });
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Start server
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(\`🚀 Server running on port \${PORT}\`);
    console.log(\`🌐 Health check: http://localhost:\${PORT}/health\`);
    console.log(\`📝 API test: http://localhost:\${PORT}/api/test\`);
  });
} else {
  console.log('🚀 Server running in Vercel serverless mode');
}

export default app;
"@

# Save the fixed server
$fixedServer | Out-File -FilePath "server\src\server-fixed.ts" -Encoding UTF8
Write-Host "   ✅ Created server-fixed.ts" -ForegroundColor Green
Write-Host ""

# Step 5: Update the push script to use fixed server
Write-Host "5. Updating push script to use fixed server..." -ForegroundColor Yellow
$pushScript = Get-Content "push-to-backend-repo.ps1" -Raw
$pushScript = $pushScript -replace 'Copy-Item -Recurse -Path "server\\\*" -Destination \$repoDir -Force', 'Copy-Item -Recurse -Path "server\*" -Destination $repoDir -Force; Copy-Item "server\src\server-fixed.ts" "$repoDir\src\server.ts" -Force'
$pushScript | Out-File -FilePath "push-to-backend-repo-fixed.ps1" -Encoding UTF8
Write-Host "   ✅ Created push-to-backend-repo-fixed.ps1" -ForegroundColor Green
Write-Host ""

Write-Host "🎯 Fixes Applied:" -ForegroundColor White
Write-Host "================" -ForegroundColor Cyan
Write-Host "1. Created test-server.ts for debugging" -ForegroundColor Gray
Write-Host "2. Created server-fixed.ts with better error handling" -ForegroundColor Gray
Write-Host "3. Updated package.json with test script" -ForegroundColor Gray
Write-Host "4. Created backup of original server.ts" -ForegroundColor Gray
Write-Host "5. Created updated push script" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Magenta
Write-Host "1. Run: .\push-to-backend-repo-fixed.ps1" -ForegroundColor Gray
Write-Host "2. Railway will auto-deploy the fixed version" -ForegroundColor Gray
Write-Host "3. Test: https://hotel-pms-backend-production-2f06.up.railway.app/api/test" -ForegroundColor Gray
Write-Host "4. Check Railway logs for any errors" -ForegroundColor Gray