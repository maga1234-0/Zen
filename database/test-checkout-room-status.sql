-- Test script to verify checkout automatically sets room to dirty

-- Step 1: Check current state
SELECT 
    '=== CURRENT STATE ===' as step;

SELECT 
    b.id,
    b.status as booking_status,
    g.first_name || ' ' || g.last_name as guest_name,
    r.room_number,
    r.status as room_status,
    b.check_in_date,
    b.check_out_date
FROM bookings b
JOIN guests g ON b.guest_id = g.id
JOIN rooms r ON b.room_id = r.id
WHERE b.status = 'checked_in'
ORDER BY b.check_out_date
LIMIT 5;

-- Step 2: Show rooms that should be dirty after checkout
SELECT 
    '=== ROOMS THAT SHOULD BE DIRTY AFTER CHECKOUT ===' as step;

SELECT 
    r.room_number,
    r.status as current_status,
    b.status as booking_status,
    g.first_name || ' ' || g.last_name as guest_name,
    b.check_out_date
FROM rooms r
JOIN bookings b ON r.id = b.room_id
JOIN guests g ON b.guest_id = g.id
WHERE b.status = 'checked_out'
AND r.status != 'dirty'
ORDER BY b.updated_at DESC
LIMIT 10;

-- Step 3: Count rooms by status
SELECT 
    '=== ROOM STATUS COUNTS ===' as step;

SELECT 
    status,
    COUNT(*) as count
FROM rooms
GROUP BY status
ORDER BY count DESC;

-- Step 4: Show recent checkout activity
SELECT 
    '=== RECENT CHECKOUTS ===' as step;

SELECT 
    b.id,
    b.status as booking_status,
    g.first_name || ' ' || g.last_name as guest_name,
    r.room_number,
    r.status as room_status,
    b.updated_at,
    CASE 
        WHEN r.status = 'dirty' THEN '✅ Correct'
        ELSE '❌ Should be dirty'
    END as status_check
FROM bookings b
JOIN guests g ON b.guest_id = g.id
JOIN rooms r ON b.room_id = r.id
WHERE b.status = 'checked_out'
ORDER BY b.updated_at DESC
LIMIT 10;
