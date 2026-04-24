-- Update room type names to be simpler (Single, Double, Twin, Suite)
-- And add Twin room type if it doesn't exist

-- Update existing room types
UPDATE room_types SET name = 'Single' WHERE name LIKE '%Single%';
UPDATE room_types SET name = 'Double' WHERE name LIKE '%Double%';
UPDATE room_types SET name = 'Suite' WHERE name = 'Suite';

-- Add Twin room type if it doesn't exist (using a new UUID)
INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities)
SELECT 
    '550e8400-e29b-41d4-a716-446655440000',
    'Twin',
    'Room with two single beds',
    139.99,
    2,
    '["WiFi", "TV", "Air Conditioning", "Mini Bar"]'::jsonb
WHERE NOT EXISTS (
    SELECT 1 FROM room_types WHERE name = 'Twin' AND hotel_id = '550e8400-e29b-41d4-a716-446655440000'
);

-- Verify the changes
SELECT id, name, base_price, max_occupancy 
FROM room_types 
WHERE hotel_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY name;
