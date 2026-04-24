-- Clean all sample data but keep essential structure

-- Delete sample data (in correct order due to foreign keys)
DELETE FROM notifications;
DELETE FROM payments;
DELETE FROM bookings;
DELETE FROM guests;

-- Keep hotel, rooms, room_types, and users (for login)
-- This allows you to test the system with a clean slate

-- You can now:
-- 1. Login with existing users (admin@hotel.com, manager@hotel.com, reception@hotel.com)
-- 2. Create your own guests
-- 3. Create your own bookings
-- 4. Process payments
-- 5. Add staff members

SELECT 'Database cleaned! Sample bookings, guests, payments, and notifications removed.' as message;
