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
