-- Simple script to create a test booking for today's check-in
-- Run each section separately in pgAdmin

-- STEP 1: Check if you have guests and rooms
SELECT 'Checking guests...' as step;
SELECT id, first_name, last_name FROM guests LIMIT 5;

SELECT 'Checking rooms...' as step;
SELECT id, room_number, status FROM rooms LIMIT 5;

-- STEP 2: Get IDs (copy these for next step)
SELECT 'Copy these IDs for the next step:' as note;
SELECT id as guest_id FROM guests LIMIT 1;
SELECT id as room_id FROM rooms WHERE status = 'available' LIMIT 1;

-- STEP 3: Create the booking
-- REPLACE the guest_id and room_id with the IDs from STEP 2
INSERT INTO bookings (
    hotel_id,
    guest_id,
    room_id,
    check_in_date,
    check_out_date,
    number_of_guests,
    total_amount,
    status
)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'PASTE_GUEST_ID_HERE',  -- Replace with guest_id from STEP 2
    'PASTE_ROOM_ID_HERE',   -- Replace with room_id from STEP 2
    CURRENT_DATE,            -- Today
    CURRENT_DATE + 2,        -- 2 days from now
    2,
    200.00,
    'confirmed'
);

-- STEP 4: Verify the booking was created
SELECT 
    b.id,
    b.check_in_date,
    b.status,
    g.first_name || ' ' || g.last_name as guest_name,
    r.room_number,
    DATE(b.check_in_date) = CURRENT_DATE as is_today
FROM bookings b
JOIN guests g ON b.guest_id = g.id
JOIN rooms r ON b.room_id = r.id
WHERE DATE(b.check_in_date) = CURRENT_DATE
ORDER BY b.created_at DESC;

-- STEP 5: Check what date the database thinks is "today"
SELECT 
    CURRENT_DATE as today,
    CURRENT_TIMESTAMP as now;
