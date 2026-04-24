-- Check which room numbers already exist

SELECT 
    '=== EXISTING ROOMS ===' as info;

SELECT 
    room_number,
    floor,
    status,
    type_name,
    base_price
FROM rooms r
LEFT JOIN room_types rt ON r.room_type_id = rt.id
ORDER BY 
    CAST(REGEXP_REPLACE(room_number, '[^0-9]', '', 'g') AS INTEGER);

-- Count rooms by floor
SELECT 
    '=== ROOMS BY FLOOR ===' as info;

SELECT 
    floor,
    COUNT(*) as room_count
FROM rooms
GROUP BY floor
ORDER BY floor;

-- Suggest available room numbers
SELECT 
    '=== SUGGESTED AVAILABLE ROOM NUMBERS ===' as info;

-- Generate room numbers 101-120 and show which are available
SELECT 
    room_num::text as suggested_room_number,
    CASE 
        WHEN EXISTS (SELECT 1 FROM rooms WHERE room_number = room_num::text) 
        THEN '❌ Already exists'
        ELSE '✅ Available'
    END as status
FROM generate_series(101, 120) as room_num
ORDER BY room_num;
