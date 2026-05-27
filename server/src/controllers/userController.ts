import { Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, phone, role, is_active, created_at FROM users ORDER BY created_at DESC'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;

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
      [email, passwordHash, firstName, lastName, phone, role]
    );

    console.log('✅ User created:', result.rows[0].email);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, role, isActive } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, phone = $3, role = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING id, email, first_name, last_name, phone, role, is_active`,
      [firstName, lastName, phone, role, isActive, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query('BEGIN');

    // Check if user exists
    const userCheck = await client.query(
      'SELECT id, email, first_name, last_name FROM users WHERE id = $1',
      [id]
    );

    if (userCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userCheck.rows[0];

    // Set created_by to NULL for bookings created by this user
    await client.query(
      'UPDATE bookings SET created_by = NULL WHERE created_by = $1',
      [id]
    );

    // Set maintenance_reported_by to NULL for rooms reported by this user
    await client.query(
      'UPDATE rooms SET maintenance_reported_by = NULL WHERE maintenance_reported_by = $1',
      [id]
    );

    // Delete audit logs (or set user_id to NULL if you want to keep the logs)
    await client.query(
      'DELETE FROM audit_logs WHERE user_id = $1',
      [id]
    );

    // Delete user settings (has ON DELETE CASCADE, but being explicit)
    await client.query(
      'DELETE FROM user_settings WHERE user_id = $1',
      [id]
    );

    // Delete notifications (has ON DELETE CASCADE, but being explicit)
    await client.query(
      'DELETE FROM notifications WHERE user_id = $1',
      [id]
    );

    // Finally, delete the user
    await client.query(
      'DELETE FROM users WHERE id = $1',
      [id]
    );

    await client.query('COMMIT');

    console.log(`✅ User deleted: ${user.email} (${user.first_name} ${user.last_name})`);
    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Delete user error:', error);
    res.status(500).json({ 
      message: 'Failed to delete user', 
      error: error.message 
    });
  } finally {
    client.release();
  }
};
