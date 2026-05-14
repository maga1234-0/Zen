import { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

// Create PostgreSQL connection pool (Vercel compatible)
console.log('🔧 Database configuration check:');
console.log('   DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('   NODE_ENV:', process.env.NODE_ENV);

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required!');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 5,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Parse URL path
  const path = req.url || '';
  
  // Handle different API routes
  console.log('📝 Request:', req.method, path, 'Body:', req.body);
  
  if (path === '/api/auth/login' && req.method === 'POST') {
    // Handle login
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      console.log('🔐 Login attempt for:', email);

      // Test database connection first
      try {
        await pool.query('SELECT 1 as test');
        console.log('✅ Database connection test successful');
      } catch (dbError: any) {
        console.error('❌ Database connection failed:', dbError);
        return res.status(500).json({ 
          message: 'Database connection failed',
          error: dbError.message 
        });
      }

      // Query user from database
      const result = await pool.query(
        'SELECT id, email, password_hash, first_name, last_name, role, is_active FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        console.log('❌ User not found:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = result.rows[0];
      console.log('✅ User found:', user.email, '- Role:', user.role, '- Active:', user.is_active);

      if (!user.is_active) {
        console.log('❌ Account deactivated:', email);
        return res.status(403).json({ message: 'Account is deactivated' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      console.log('🔑 Password valid:', isValidPassword);

      if (!isValidPassword) {
        console.log('❌ Invalid password for:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const jwtSecret = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
      
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        jwtSecret,
        { expiresIn: '7d' }
      );

      const responseData = {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
        },
      };

      console.log('✅ Login successful for:', email, '- Sending response');
      res.status(200).json(responseData);
    } catch (error: any) {
      console.error('❌ Login error:', error);
      res.status(500).json({ 
        message: 'Server error',
        error: error.message,
        envVars: {
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          hasDbHost: !!process.env.DB_HOST,
          hasDbUser: !!process.env.DB_USER,
          hasJwtSecret: !!process.env.JWT_SECRET,
          nodeEnv: process.env.NODE_ENV
        }
      });
    }
  } else if (path === '/api' || path === '/api/') {
    // API root
    res.json({ 
      status: 'OK', 
      message: 'Hotel PMS API is running on Vercel', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      envVars: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasDbHost: !!process.env.DB_HOST,
        hasDbUser: !!process.env.DB_USER,
        hasJwtSecret: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV
      }
    });
  } else if (path === '/health') {
    // Health check
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  } else if (path === '/api/test-db') {
    // Test database connection with multiple options
    try {
      console.log('🔧 Testing database connection...');
      console.log('🔧 Environment variables:');
      console.log('   DATABASE_URL exists:', !!process.env.DATABASE_URL);
      console.log('   DB_HOST exists:', !!process.env.DB_HOST);
      console.log('   DB_USER exists:', !!process.env.DB_USER);
      console.log('   NODE_ENV:', process.env.NODE_ENV);
      
      // Try to connect
      const result = await pool.query('SELECT 1 as test, NOW() as time');
      console.log('✅ Database connection successful');
      
      res.json({ 
        status: 'OK', 
        database: 'Connected',
        time: result.rows[0].time,
        envVars: {
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          hasDbHost: !!process.env.DB_HOST,
          hasDbUser: !!process.env.DB_USER,
          nodeEnv: process.env.NODE_ENV,
          databaseUrlFirst10: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + '...' : 'not set',
          dbHost: process.env.DB_HOST || 'not set',
          dbUser: process.env.DB_USER || 'not set'
        },
        connectionConfig: connectionConfig ? {
          using: process.env.DATABASE_URL ? 'DATABASE_URL' : 'individual',
          host: connectionConfig.host || (connectionConfig.connectionString ? 'from connection string' : 'not set'),
          port: connectionConfig.port || 'from connection string'
        } : 'No connection config'
      });
    } catch (error: any) {
      console.error('❌ Database connection failed:', error);
      
      // Test alternative connections
      const testResults = [];
      
      // Test 1: Try direct Supabase connection (from documentation)
      try {
        const testPool1 = new Pool({
          connectionString: 'postgresql://postgres:QRHxAWQ3YOBeYmCW@db.sikmnuxzpozgljbndapt.supabase.co:5432/postgres',
          ssl: { rejectUnauthorized: false }
        });
        const result1 = await testPool1.query('SELECT 1 as test');
        testResults.push({ name: 'Documentation Supabase', status: 'OK', project: 'sikmnuxzpozgljbndapt' });
        await testPool1.end();
      } catch (err1: any) {
        testResults.push({ name: 'Documentation Supabase', status: 'FAILED', error: err1.message, project: 'sikmnuxzpozgljbndapt' });
      }
      
      // Test 2: Try .env Supabase connection
      try {
        const testPool2 = new Pool({
          host: 'aws-0-eu-west-1.pooler.supabase.com',
          port: 6543,
          database: 'postgres',
          user: 'postgres.bdahordvjnspfszwexnb',
          password: 'LqDPYFn5FIUhEcN0',
          ssl: { rejectUnauthorized: false }
        });
        const result2 = await testPool2.query('SELECT 1 as test');
        testResults.push({ name: '.env Supabase', status: 'OK', project: 'bdahordvjnspfszwexnb' });
        await testPool2.end();
      } catch (err2: any) {
        testResults.push({ name: '.env Supabase', status: 'FAILED', error: err2.message, project: 'bdahordvjnspfszwexnb' });
      }
      
      res.status(500).json({ 
        status: 'ERROR', 
        database: 'Connection failed',
        error: error.message,
        envVars: {
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          hasDbHost: !!process.env.DB_HOST,
          hasDbUser: !!process.env.DB_USER,
          nodeEnv: process.env.NODE_ENV,
          databaseUrlFirst10: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + '...' : 'not set',
          dbHost: process.env.DB_HOST || 'not set',
          dbUser: process.env.DB_USER || 'not set'
        },
        connectionConfig: connectionConfig ? {
          using: process.env.DATABASE_URL ? 'DATABASE_URL' : 'individual',
          host: connectionConfig.host || (connectionConfig.connectionString ? 'from connection string' : 'not set'),
          port: connectionConfig.port || 'from connection string'
        } : 'No connection config',
        alternativeTests: testResults,
        recommendations: [
          '1. Check if environment variables are set in Vercel',
          '2. Verify Supabase database is running',
          '3. Check if password is correct',
          '4. Ensure SSL is enabled (required for Supabase)'
        ]
      });
    }
  } else {
    // Not found
    res.status(404).json({ 
      message: 'Route not found', 
      path,
      method: req.method,
      availableRoutes: ['/api/auth/login (POST)', '/api', '/health', '/api/test-db']
    });
  }
}
