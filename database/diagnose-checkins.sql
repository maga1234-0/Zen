-- Diagnostic queries to find why check-ins are not showing

-- 1. Check what today's date is in the database
SELECT 
    CURRENT_DATE as today,
    CURRENT_TIMESTAMP as now;

-- 2. Show ALL bookings with their dates
SELECT 
    b.id,
    b.check_in_date,
    DATE(b.check_in_date) as check_in_date_only,
    b.check_out_date,
    b.status,
    g.first_name || ' ' || g.last_name as guest_name,
    r.room_number,
    -- Check if it matches today
    DATE(b.check_in_date) = CURRENT_DATE as is_today,
    -- Check if status is correct
    b.status IN ('confirmed', 'checked_in') as status_ok
FROM bookings b
JOIN guests g ON b.guest_id = g.id
JOIN rooms r ON b.room_id = r.id
ORDER BY b.check_in_date DESC;

-- 3. Show bookings that SHOULD appear in Front Desk
SELECT 
    b.id,
    b.check_in_date,
    b.status,
    g.first_name || ' ' || g.last_name as guest_name,
    r.room_number,
    'This should show in Front Desk' as note
FROM bookings b
JOIN guests g ON b.guest_id = g.id
JOIN rooms r ON b.room_id = r.id
WHERE DATE(b.check_in_date) = CURRENT_DATE
AND b.status IN ('confirmed', 'checked_in');

-- 4. Show bookings with check-in date close to today
SELECT 
    b.id,
    b.check_in_date,
    DATE(b.check_in_date) as date_only,
    b.status,
    g.first_name || ' ' || g.last_name as guest_name,
    r.room_number,
    CURRENT_DATE - DATE(b.check_in_date) as days_difference
FROM bookings b
JOIN guests g ON b.guest_id = g.id
JOIN rooms r ON b.room_id = r.id
WHERE b.check_in_date BETWEEN CURRENT_DATE - INTERVAL '3 days' AND CURRENT_DATE + INTERVAL '3 days'
ORDER BY b.check_in_date;

-- 5. Count bookings by status
SELECT 
    status,
    COUNT(*) as count
FROM bookings
GROUP BY status;

-- 6. Show the exact query that the API uses
SELECT b.*, 
    g.first_name || ' ' || g.last_name as guest_name,
    g.phone as guest_phone,
    r.room_number,
    r.status as room_status
FROM bookings b
JOIN guests g ON b.guest_id = g.id
JOIN rooms r ON b.room_id = r.id
WHERE DATE(b.check_in_date) = CURRENT_DATE
AND b.status IN ('confirmed', 'checked_in')
ORDER BY b.check_in_date ASC;
