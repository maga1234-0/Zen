-- Create a test booking for today's check-in
-- Run this in pgAdmin to test the Front Desk check-ins display

-- Step 1: Get available guest and room
DO $$
DECLARE
    v_guest_id UUID;
    v_room_id UUID;
    v_booking_id UUID;
BEGIN
    -- Get first available guest
    SELECT id INTO v_guest_id FROM guests LIMIT 1;
    
    -- Get first available room
    SELECT id INTO v_room_id FROM rooms WHERE status = 'available' LIMIT 1;
    
    -- If no available room, use any room
    IF v_room_id IS NULL THEN
        SELECT id INTO v_room_id FROM rooms LIMIT 1;
    END IF;
    
    -- Create booking with today's check-in date
    INSERT INTO bookings (
        hotel_id,
        guest_id,
        room_id,
        check_in_date,
        check_out_date,
        number_of_guests,
        total_amount,
        status,
        special_requests
    )
    VALUES (
        '550e8400-e29b-41d4-a716-446655440000',
        v_guest_id,
        v_room_id,
        CURRENT_DATE, -- Today
        CURRENT_DATE + INTERVAL '2 days', -- 2 days from now
        2,
        200.00,
        'confirmed', -- Must be 'confirmed' or 'checked_in' to show in Front Desk
        'Test booking for Front Desk check-in'
    )
    RETURNING id INTO v_booking_id;
    
    -- Update room status to occupied
    UPDATE rooms SET status = 'occupied' WHERE id = v_room_id;
    
    -- Show the created booking
    RAISE NOTICE 'Created booking ID: %', v_booking_id;
    RAISE NOTICE 'Guest ID: %', v_guest_id;
    RAISE NOTICE 'Room ID: %', v_room_id;
    RAISE NOTICE 'Check-in date: %', CURRENT_DATE;
    
END $$;

-- Verify the booking was created
SELECT 
    b.id,
    b.check_in_date,
    b.check_out_date,
    b.status,
    g.first_name || ' ' || g.last_name as guest_name,
    r.room_number,
    DATE(b.check_in_date) = CURRENT_DATE as is_today
FROM bookings b
JOIN guests g ON b.guest_id = g.id
JOIN rooms r ON b.room_id = r.id
WHERE DATE(b.check_in_date) = CURRENT_DATE
ORDER BY b.created_at DESC;

-- Show current date for reference
SELECT 
    CURRENT_DATE as today,
    CURRENT_TIMESTAMP as now,
    'Booking should appear in Front Desk if is_today = true' as note;
