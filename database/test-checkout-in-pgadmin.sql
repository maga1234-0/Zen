-- Test Checkout Functionality in pgAdmin
-- This script tests if the room status constraint allows "dirty" status

-- Step 1: Check current constraint
SELECT '=== STEP 1: Current Constraint ===' as step;
SELECT conname, pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'rooms_status_check';

-- Step 2: Find a checked-in booking to test
SELECT '=== STEP 2: Finding Checked-In Booking ===' as step;
SELECT 
    b.id as booking_id,
    b.status as booking_status,
    g.first_name || ' ' || g.last_name as guest_name,
    r.room_number,
    r.status as room_status
FROM bookings b
JOIN rooms r ON b.room_id = r.id
JOIN guests g ON b.guest_id = g.id
WHERE b.status = 'checked_in'
LIMIT 1;

-- Step 3: Try to update a room to 'dirty' status (this will fail if constraint is wrong)
SELECT '=== STEP 3: Testing Room Status Update ===' as step;

-- First, let's see if we can create a test
DO $$
DECLARE
    test_booking_id UUID;
    test_room_id UUID;
    test_result TEXT;
BEGIN
    -- Find a checked-in booking
    SELECT b.id, b.room_id INTO test_booking_id, test_room_id
    FROM bookings b
    WHERE b.status = 'checked_in'
    LIMIT 1;
    
    IF test_booking_id IS NULL THEN
        RAISE NOTICE '❌ No checked-in bookings found to test';
        RETURN;
    END IF;
    
    RAISE NOTICE '📋 Testing with booking ID: %', test_booking_id;
    RAISE NOTICE '📋 Testing with room ID: %', test_room_id;
    
    -- Try to update room to dirty
    BEGIN
        UPDATE rooms SET status = 'dirty' WHERE id = test_room_id;
        RAISE NOTICE '✅ SUCCESS! Room status can be set to dirty';
        test_result := 'PASS';
        
        -- Rollback the test change
        ROLLBACK;
    EXCEPTION
        WHEN check_violation THEN
            RAISE NOTICE '❌ FAILED! Constraint does not allow dirty status';
            RAISE NOTICE '❌ Error: %', SQLERRM;
            test_result := 'FAIL - Need to run fix-room-status-constraint.sql';
            ROLLBACK;
    END;
    
END $$;

-- Step 4: Show what statuses are currently allowed
SELECT '=== STEP 4: Current Room Statuses in Use ===' as step;
SELECT status, COUNT(*) as count
FROM rooms
GROUP BY status
ORDER BY count DESC;

-- Step 5: Instructions
SELECT '=== NEXT STEPS ===' as step;
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'rooms_status_check' 
            AND pg_get_constraintdef(oid) LIKE '%dirty%'
        ) 
        THEN '✅ Constraint is correct! "dirty" is allowed.'
        ELSE '❌ Constraint needs fixing! Run: database/fix-room-status-constraint.sql'
    END as status;
