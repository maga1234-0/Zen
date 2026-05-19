import { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

// Create PostgreSQL connection pool (Vercel compatible)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 5,
  connectionTimeoutMillis: 10000,
});

// Helper function to verify JWT token
const verifyToken = (token: string): any => {
  const jwtSecret = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Helper function to check authentication
const checkAuth = (req: VercelRequest): { userId: string; email: string; role: string } => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authentication required');
  }
  
  const token = authHeader.substring(7);
  const decoded = verifyToken(token) as any;
  return {
    userId: decoded.id,
    email: decoded.email,
    role: decoded.role
  };
};

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
  console.log('📝 Request:', req.method, path);
  
  try {
    // Handle different API routes
    if (path === '/api/auth/login' && req.method === 'POST') {
      // Handle login
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

      if (!user.is_active) {
        console.log('❌ Account deactivated:', email);
        return res.status(403).json({ message: 'Account is deactivated' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);

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

      console.log('✅ Login successful for:', email);
      res.status(200).json(responseData);
      
    } else if (path === '/api/users' && req.method === 'POST') {
      // Handle user creation (for adding staff members)
      console.log('👤 Creating user...');
      
      // Check authentication
      const auth = checkAuth(req);
      console.log('✅ Authenticated user:', auth.email, '- Role:', auth.role);
      
      // Check if user has permission (admin or manager)
      if (auth.role !== 'admin' && auth.role !== 'manager') {
        return res.status(403).json({ message: 'Permission denied. Only admins and managers can create users.' });
      }
      
      // Parse request body
      const { email, password, firstName, lastName, phone, role } = req.body;
      
      // Validate required fields
      if (!email || !password || !firstName || !lastName || !role) {
        return res.status(400).json({ 
          message: 'Missing required fields',
          required: ['email', 'password', 'firstName', 'lastName', 'role'],
          optional: ['phone']
        });
      }
      
      // Check if user already exists
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );
      
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Create user
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone, role) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id, email, first_name, last_name, phone, role, is_active, created_at`,
        [email, passwordHash, firstName, lastName, phone || null, role]
      );
      
      console.log('✅ User created:', result.rows[0].email);
      res.status(201).json(result.rows[0]);
      
    } else if (path === '/api/users' && req.method === 'GET') {
      // Handle getting all users (for staff list)
      console.log('👤 Getting all users...');
      
      // Check authentication
      const auth = checkAuth(req);
      console.log('✅ Authenticated user:', auth.email, '- Role:', auth.role);
      
      // Get all users
      const result = await pool.query(
        'SELECT id, email, first_name, last_name, phone, role, is_active, created_at FROM users ORDER BY created_at DESC'
      );
      
      console.log('✅ Found', result.rows.length, 'users');
      res.status(200).json(result.rows);
      
    } else if (path === '/api/rooms' && req.method === 'GET') {
      // Handle getting all rooms (for room list)
      console.log('🏨 Getting all rooms...');
      
      // Check authentication
      const auth = checkAuth(req);
      console.log('✅ Authenticated user:', auth.email, '- Role:', auth.role);
      
      // Get all rooms with room type information
      const result = await pool.query(`
        SELECT 
          r.id, r.room_number, r.floor, r.status,
          rt.name as room_type, rt.base_price, rt.max_occupancy,
          rt.amenities
        FROM rooms r
        JOIN room_types rt ON r.room_type_id = rt.id
        ORDER BY r.floor, r.room_number
      `);
      
      console.log('✅ Found', result.rows.length, 'rooms');
      res.status(200).json(result.rows);
      
    } else if (path === '/api/room-types' && req.method === 'GET') {
      // Handle getting all room types (for dropdown)
      console.log('🏨 Getting all room types...');
      
      // Check authentication
      const auth = checkAuth(req);
      console.log('✅ Authenticated user:', auth.email, '- Role:', auth.role);
      
      // Get all room types
      const result = await pool.query(`
        SELECT id, name, description, base_price, max_occupancy, amenities
        FROM room_types
        ORDER BY base_price
      `);
      
      console.log('✅ Found', result.rows.length, 'room types');
      res.status(200).json(result.rows);
      
    } else if (path === '/api' || path === '/api/') {
      // API root
      res.json({ 
        status: 'OK', 
        message: 'Hotel PMS API is running on Vercel', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        availableRoutes: [
          '/api/auth/login (POST)',
          '/api/users (GET, POST)',
          '/api/rooms (GET)',
          '/api/room-types (GET)',
          '/api (GET)',
          '/health (GET)'
        ]
      });
    } else if (path === '/health') {
      // Health check with database test
      try {
        await pool.query('SELECT 1 as test');
        res.json({ 
          status: 'OK', 
          database: 'connected',
          timestamp: new Date().toISOString() 
        });
      } catch (error: any) {
        res.status(500).json({ 
          status: 'ERROR', 
          database: 'disconnected',
          error: error.message,
          timestamp: new Date().toISOString() 
        });
      }
    } else {
      // Not found
      res.status(404).json({ 
        message: 'Route not found', 
        path,
        method: req.method,
        availableRoutes: [
          '/api/auth/login (POST)',
          '/api/users (GET, POST)',
          '/api/rooms (GET)',
          '/api/room-types (GET)',
          '/api (GET)',
          '/health (GET)'
        ]
      });
    }
  } catch (error: any) {
    console.error('❌ API error:', error);
    
    if (error.message === 'Authentication required') {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (error.message === 'Invalid or expired token') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    
    res.status(500).json({ 
      message: 'Server error',
      error: error.message
    });
  }
}

