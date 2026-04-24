-- Add Room Types if Missing
-- Run this in pgAdmin if you can't see room types when adding a room

-- Step 1: Check current room types
SELECT 'Current room types:' as info;
SELECT name, base_price, max_occupancy FROM room_types ORDER BY name;

-- Step 2: Insert default room types if none exist
INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities)
SELECT 
    '550e8400-e29b-41d4-a716-446655440000',
    'Single',
    'Cozy room perfect for solo travelers',
    89.99,
    1,
    '["WiFi", "TV", "Air Conditioning"]'
WHERE NOT EXISTS (SELECT 1 FROM room_types WHERE name = 'Single');

INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities)
SELECT 
    '550e8400-e29b-41d4-a716-446655440000',
    'Double',
    'Comfortable room with double bed',
    129.99,
    2,
    '["WiFi", "TV", "Air Conditioning", "Mini Bar"]'
WHERE NOT EXISTS (SELECT 1 FROM room_types WHERE name = 'Double');

INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities)
SELECT 
    '550e8400-e29b-41d4-a716-446655440000',
    'Suite',
    'Luxurious suite with separate living area',
    249.99,
    4,
    '["WiFi", "TV", "Air Conditioning", "Mini Bar", "Jacuzzi", "Kitchen"]'
WHERE NOT EXISTS (SELECT 1 FROM room_types WHERE name = 'Suite');

INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities)
SELECT 
    '550e8400-e29b-41d4-a716-446655440000',
    'Deluxe',
    'Premium room with city view',
    179.99,
    2,
    '["WiFi", "TV", "Air Conditioning", "Mini Bar", "Balcony"]'
WHERE NOT EXISTS (SELECT 1 FROM room_types WHERE name = 'Deluxe');

-- Step 3: Verify room types were added
SELECT 'Room types after insert:' as info;
SELECT name, base_price, max_occupancy FROM room_types ORDER BY name;

-- Success message
SELECT '✅ Room types are now available!' as result;
