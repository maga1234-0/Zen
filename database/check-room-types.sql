-- Check if room types exist in the database

SELECT 
    '=== ROOM TYPES IN DATABASE ===' as info;

SELECT 
    id,
    name,
    description,
    base_price,
    max_occupancy,
    created_at
FROM room_types
ORDER BY name;

-- Count room types
SELECT 
    '=== ROOM TYPES COUNT ===' as info;

SELECT COUNT(*) as total_room_types
FROM room_types;

-- If no room types, insert default ones
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM room_types LIMIT 1) THEN
        RAISE NOTICE '⚠️ No room types found! Inserting default room types...';
        
        INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities) VALUES
        ('550e8400-e29b-41d4-a716-446655440000', 'Single', 'Cozy room perfect for solo travelers', 89.99, 1, '["WiFi", "TV", "Air Conditioning"]'),
        ('550e8400-e29b-41d4-a716-446655440000', 'Double', 'Comfortable room with double bed', 129.99, 2, '["WiFi", "TV", "Air Conditioning", "Mini Bar"]'),
        ('550e8400-e29b-41d4-a716-446655440000', 'Suite', 'Luxurious suite with separate living area', 249.99, 4, '["WiFi", "TV", "Air Conditioning", "Mini Bar", "Jacuzzi", "Kitchen"]'),
        ('550e8400-e29b-41d4-a716-446655440000', 'Deluxe', 'Premium room with city view', 179.99, 2, '["WiFi", "TV", "Air Conditioning", "Mini Bar", "Balcony"]');
        
        RAISE NOTICE '✅ Default room types inserted successfully!';
    ELSE
        RAISE NOTICE '✅ Room types already exist in database';
    END IF;
END $$;

-- Show final count
SELECT 
    '=== FINAL ROOM TYPES ===' as info;

SELECT 
    name,
    base_price,
    max_occupancy
FROM room_types
ORDER BY name;
