-- Reset Database - Drop all tables and recreate from scratch
-- Run this in pgAdmin Query Tool

-- Drop all tables in correct order (to handle foreign keys)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS guests CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS room_types CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;

SELECT 'All tables dropped successfully!' as message;

-- Now you can run schema.sql to recreate the tables
