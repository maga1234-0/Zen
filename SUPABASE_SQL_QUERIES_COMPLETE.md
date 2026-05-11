# Complete SQL Queries for Supabase Setup

## 📋 **Run These Queries in Supabase SQL Editor (IN ORDER!)**

### **Step 1: Create Database Schema**
**File:** `schema.sql`
```sql
-- Hotel PMS Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users & Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager', 'receptionist', 'housekeeping', 'maintenance', 'accountant')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hotels (for multi-hotel support)
CREATE TABLE hotels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Room Types
CREATE TABLE room_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    max_occupancy INTEGER NOT NULL,
    amenities JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    room_type_id UUID REFERENCES room_types(id),
    room_number VARCHAR(20) NOT NULL,
    floor INTEGER,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'cleaning', 'dirty')),
    custom_price DECIMAL(10, 2),
    maintenance_reason TEXT,
    is_urgent BOOLEAN DEFAULT false,
    maintenance_reported_at TIMESTAMP,
    maintenance_reported_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(hotel_id, room_number)
);

-- Guests
CREATE TABLE guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    id_type VARCHAR(50),
    id_number VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES guests(id),
    room_id UUID REFERENCES rooms(id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    number_of_guests INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled')),
    total_amount DECIMAL(10, 2) NOT NULL,
    special_requests TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'card', 'mobile_money', 'bank_transfer')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'overdue', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('booking', 'payment', 'check_in', 'check_out', 'system')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    changes JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_maintenance ON rooms(status, is_urgent) WHERE status = 'maintenance';
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guests_updated_at BEFORE UPDATE ON guests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- User Settings Table
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hotel_name VARCHAR(255) DEFAULT 'Grand Seafoam Hotel',
    time_zone VARCHAR(100) DEFAULT 'UTC-5 (Eastern Time)',
    email_notifications BOOLEAN DEFAULT true,
    booking_alerts BOOLEAN DEFAULT true,
    payment_notifications BOOLEAN DEFAULT true,
    theme VARCHAR(50) DEFAULT 'Dark',
    language VARCHAR(50) DEFAULT 'English',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

### **Step 2: Insert Sample Data**
**File:** `seed.sql`
```sql
-- Seed Data for Hotel PMS

-- Insert sample hotel
INSERT INTO hotels (id, name, address, city, country, phone, email) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Grand Seafoam Hotel', '123 Ocean Drive', 'Miami', 'USA', '+1-305-555-0100', 'info@grandseafoam.com');

-- Insert users (password: 'password123' - hashed with bcrypt)
-- First, delete existing users to avoid conflicts
DELETE FROM users WHERE email IN ('admin@hotel.com', 'manager@hotel.com', 'reception@hotel.com');

INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'admin@hotel.com', '$2a$10$ePPOujJ2NGLiSV/MIO21wu4RUsLn/QRFdVznXPFXbgAt76fEGjvmK', 'John', 'Admin', '+1-305-555-0101', 'admin'),
('660e8400-e29b-41d4-a716-446655440002', 'manager@hotel.com', '$2a$10$ePPOujJ2NGLiSV/MIO21wu4RUsLn/QRFdVznXPFXbgAt76fEGjvmK', 'Sarah', 'Manager', '+1-305-555-0102', 'manager'),
('660e8400-e29b-41d4-a716-446655440003', 'reception@hotel.com', '$2a$10$ePPOujJ2NGLiSV/MIO21wu4RUsLn/QRFdVznXPFXbgAt76fEGjvmK', 'Mike', 'Reception', '+1-305-555-0103', 'receptionist');

-- Insert room types
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Single', 'Cozy room perfect for solo travelers', 89.99, 1, '["WiFi", "TV", "Air Conditioning"]'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Double', 'Comfortable room with double bed', 129.99, 2, '["WiFi", "TV", "Air Conditioning", "Mini Bar"]'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Twin', 'Room with two single beds', 139.99, 2, '["WiFi", "TV", "Air Conditioning", "Mini Bar"]'),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Suite', 'Luxurious suite with ocean view', 299.99, 4, '["WiFi", "TV", "Air Conditioning", "Mini Bar", "Balcony", "Jacuzzi"]');

-- Insert rooms
INSERT INTO rooms (hotel_id, room_type_id, room_number, floor, status) VALUES
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440001', '101', 1, 'available'),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440001', '102', 1, 'occupied'),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440002', '201', 2, 'available'),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440002', '202', 2, 'occupied'),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440003', '203', 2, 'available'),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440003', '204', 2, 'maintenance'),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440004', '301', 3, 'available'),
('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440004', '302', 3, 'occupied');

-- Insert guests
INSERT INTO guests (id, first_name, last_name, email, phone, id_type, id_number, city, country) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Emma', 'Wilson', 'emma.wilson@email.com', '+1-555-0201', 'Passport', 'P123456', 'New York', 'USA'),
('880e8400-e29b-41d4-a716-446655440002', 'James', 'Brown', 'james.brown@email.com', '+1-555-0202', 'Driver License', 'DL789012', 'Los Angeles', 'USA'),
('880e8400-e29b-41d4-a716-446655440003', 'Sophia', 'Davis', 'sophia.davis@email.com', '+1-555-0203', 'Passport', 'P654321', 'Chicago', 'USA');

-- Insert bookings
INSERT INTO bookings (id, hotel_id, guest_id, room_id, check_in_date, check_out_date, number_of_guests, status, total_amount, created_by) VALUES
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440001', 
 (SELECT id FROM rooms WHERE room_number = '102'), '2026-04-10', '2026-04-15', 1, 'checked_in', 449.95, '660e8400-e29b-41d4-a716-446655440003'),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440002', 
 (SELECT id FROM rooms WHERE room_number = '202'), '2026-04-12', '2026-04-14', 2, 'checked_in', 259.98, '660e8400-e29b-41d4-a716-446655440003'),
('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440003', 
 (SELECT id FROM rooms WHERE room_number = '301'), '2026-04-15', '2026-04-20', 2, 'confirmed', 1499.95, '660e8400-e29b-41d4-a716-446655440003');

-- Insert payments
INSERT INTO payments (booking_id, amount, payment_method, payment_status, transaction_id) VALUES
('990e8400-e29b-41d4-a716-446655440001', 449.95, 'card', 'completed', 'TXN001234'),
('990e8400-e29b-41d4-a716-446655440002', 259.98, 'cash', 'completed', 'TXN001235');

-- Insert notifications
INSERT INTO notifications (user_id, title, message, type) VALUES
('660e8400-e29b-41d4-a716-446655440003', 'New Booking', 'New booking for Room 301 - Check-in: Apr 15', 'booking'),
('660e8400-e29b-41d4-a716-446655440002', 'Payment Received', 'Payment of $449.95 received for booking #001', 'payment'),
('660e8400-e29b-41d4-a716-446655440003', 'Check-in Reminder', 'Guest Emma Wilson checking in today - Room 102', 'check_in');
```

---

### **Step 3: Make Phone Field Optional**
**File:** `update-guests-phone-optional.sql`
```sql
-- Make phone field optional in guests table
-- This allows creating minimal guest records from bookings

-- Remove NOT NULL constraint from phone field
ALTER TABLE guests 
ALTER COLUMN phone DROP NOT NULL;

-- Update any existing empty phone values to NULL for consistency
UPDATE guests 
SET phone = NULL 
WHERE phone = '' OR TRIM(phone) = '';
```

---

### **Step 4: Fix Room Status Constraint**
**File:** `fix-room-status-constraint.sql`
```sql
-- Fix room status constraint to include 'dirty' status
-- This migration updates the check constraint to allow 'dirty' as a valid room status

-- Step 1: Drop the old constraint
ALTER TABLE rooms DROP CONSTRAINT IF EXISTS rooms_status_check;

-- Step 2: Add the new constraint with 'dirty' included
ALTER TABLE rooms ADD CONSTRAINT rooms_status_check 
CHECK (status IN ('available', 'occupied', 'maintenance', 'cleaning', 'dirty'));
```

---

### **Step 5: Add Maintenance Tracking Fields**
**File:** `add-maintenance-fields.sql`
```sql
-- Add maintenance tracking fields to rooms table

-- Add maintenance reason and urgency columns
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS maintenance_reason TEXT,
ADD COLUMN IF NOT EXISTS is_urgent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS maintenance_reported_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS maintenance_reported_by UUID REFERENCES users(id);

-- Create index for maintenance tracking
CREATE INDEX IF NOT EXISTS idx_rooms_maintenance ON rooms(status, is_urgent) WHERE status = 'maintenance';
```

---

### **Step 6: Update Notifications Table**
**File:** `update-notifications-table.sql`
```sql
-- Update notifications table to support new notification types and priority

-- Add priority column if it doesn't exist
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high'));

-- Update the type constraint to include new types
ALTER TABLE notifications 
DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE notifications 
ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('booking', 'room', 'housekeeping', 'payment', 'maintenance', 'system', 'check_in', 'check_out'));
```

---

### **Step 7: Add Hotel Info Columns**
**File:** `add-hotel-info-columns.sql`
```sql
-- Add hotel information columns to user_settings table
ALTER TABLE user_settings 
ADD COLUMN IF NOT EXISTS hotel_address VARCHAR(255) DEFAULT '123 Luxury Avenue',
ADD COLUMN IF NOT EXISTS hotel_city VARCHAR(255) DEFAULT 'Paradise City, PC 12345',
ADD COLUMN IF NOT EXISTS hotel_phone VARCHAR(50) DEFAULT '+1 (555) 123-4567',
ADD COLUMN IF NOT EXISTS hotel_email VARCHAR(255) DEFAULT 'info@grandhotel.com';

-- Update existing records with default values
UPDATE user_settings 
SET 
  hotel_address = COALESCE(hotel_address, '123 Luxury Avenue'),
  hotel_city = COALESCE(hotel_city, 'Paradise City, PC 12345'),
  hotel_phone = COALESCE(hotel_phone, '+1 (555) 123-4567'),
  hotel_email = COALESCE(hotel_email, 'info@grandhotel.com')
WHERE hotel_address IS NULL 
   OR hotel_city IS NULL 
   OR hotel_phone IS NULL 
   OR hotel_email IS NULL;
```

---

### **Step 8: Add Signature Column**
**File:** `add-signature-column.sql`
```sql
-- Add signature column to user_settings table
ALTER TABLE user_settings 
ADD COLUMN IF NOT EXISTS signature TEXT DEFAULT '';

-- Update existing records with empty signature
UPDATE user_settings 
SET signature = ''
WHERE signature IS NULL;
```

---

### **Step 9: Add Custom Price Column**
**File:** `add-custom-price.sql`
```sql
-- Add custom_price column to rooms table
-- This allows individual rooms to have custom pricing that overrides the room type base price

ALTER TABLE rooms 
ADD COLUMN custom_price DECIMAL(10, 2);
```

---

### **Step 10: Add Profile Picture Column**
**File:** `add-profile-picture.sql`
```sql
-- Add profile_picture column to users table

ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture TEXT;
```

---

## 🚀 **How to Run in Supabase:**

### **Method 1: Run All Queries at Once**
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **"New query"**
3. Copy and paste **ALL the SQL above** (from Step 1 to Step 10)
4. Click **"Run"** (or press `Ctrl+Enter`)

### **Method 2: Run Step by Step** (Recommended)
1. Go to **Supabase Dashboard** → **SQL Editor**
2. For each step (1-10):
   - Click **"New query"**
   - Copy the SQL for that step
   - Paste and click **"Run"**
   - Wait for **"Success"** message
   - Move to next step

### **Method 3: Use Individual Files**
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run these files in order:
   - `schema.sql`
   - `seed.sql`
   - `update-guests-phone-optional.sql`
   - `fix-room-status-constraint.sql`
   - `add-maintenance-fields.sql`
   - `update-notifications-table.sql`
   - `add-hotel-info-columns.sql`
   - `add-signature-column.sql`
   - `add-custom-price.sql`
   - `add-profile-picture.sql`

---

## ✅ **Verification Steps:**

After running all SQL queries, verify your database:

### **1. Check Tables Exist:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Should show:**
- users
- hotels
- room_types
- rooms
- guests
- bookings
- payments
- invoices
- notifications
- audit_logs
- user_settings

### **2. Check Sample Data:**
```sql
-- Check users
SELECT email, first_name, last_name, role FROM users;

-- Check rooms
SELECT room_number, status FROM rooms ORDER BY room_number;

-- Check bookings
SELECT b.id, g.first_name, r.room_number, b.status 
FROM bookings b
JOIN guests g ON b.guest_id = g.id
JOIN rooms r ON b.room_id = r.id;
```

### **3. Test Login Credentials:**
**Demo Accounts:**
- **Admin**: `admin@hotel.com` / `password123`
- **Manager**: `manager@hotel.com` / `password123`
- **Reception**: `reception@hotel.com` / `password123`

---

## 🛠 **Troubleshooting:**

### **Error: "relation already exists"**
- **Solution**: Table already created, skip to next script
- **Note**: This is normal if you're re-running scripts

### **Error: "permission denied"**
- **Solution**: Make sure you're using the SQL Editor, not the API

### **Error: "syntax error"**
- **Solution**: Make sure you copied the entire script
- **Check**: No missing semicolons at end of statements

### **Error: "constraint does not exist"**
- **Solution**: The constraint might have a different name
- **Fix**: Use `DROP CONSTRAINT IF EXISTS` version

---

## 📊 **Database Structure Created:**

### **Core Tables:**
1. **users** - Staff members with roles (admin, manager, receptionist, etc.)
2. **hotels** - Hotel information (supports multi-hotel)
3. **room_types** - Room categories with base pricing
4. **rooms** - Individual rooms with status tracking
5. **guests** - Guest information
6. **bookings** - Reservations and check-ins
7. **payments** - Payment transactions
8. **invoices** - Billing documents
9. **notifications** - System notifications
10. **audit_logs** - Activity tracking
11. **user_settings** - User preferences and hotel info

### **Features Included:**
- ✅ Multi-language support (English, French, Spanish)
- ✅ Room status tracking (available, occupied, maintenance, cleaning, dirty)
- ✅ Maintenance tracking with urgency levels
- ✅ Custom pricing per room
- ✅ User settings with hotel information
- ✅ Audit logging for security
- ✅ Performance indexes for fast queries
- ✅ Automatic timestamp updates

---

## 🎯 **Next Steps After SQL Setup:**

1. **Deploy to Vercel** (follow `VERCEL_ENV_VARIABLES.md`)
2. **Add environment variables** in Vercel dashboard
3. **Test the application** with demo accounts
4. **Configure hotel information** in Settings page
5. **Add more rooms and staff** as needed

**Your database is now ready for the Hotel PMS system!** 🚀