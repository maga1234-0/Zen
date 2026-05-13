import { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

// Create PostgreSQL connection pool
let connectionConfig: any;

if (process.env.DATABASE_URL) {
  // Use DATABASE_URL if provided (common for Vercel, Heroku, etc.)
  connectionConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
} else {
  // Use individual connection parameters
  connectionConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '6543'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_HOST?.includes('supabase.com') ? {
      rejectUnauthorized: false
    } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
}

const pool = new Pool(connectionConfig);

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

      // Compare password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      console.log('🔑 Password valid:', isValidPassword);

      if (!isValidPassword) {
        console.log('❌ Invalid password for:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Create JWT token
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
    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else if (path === '/api' || path === '/api/') {
    // API root
    res.json({ 
      status: 'OK', 
      message: 'Hotel PMS API is running on Vercel', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } else if (path === '/health') {
    // Health check
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  } else {
    // Not found
    res.status(404).json({ 
      message: 'Route not found', 
      path,
      method: req.method 
    });
  }
}
