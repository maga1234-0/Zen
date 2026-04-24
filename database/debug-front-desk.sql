-- Debug script to understand why Front Desk is not showing check-ins

-- 1. Check what date the database thinks is "today"
SELECT 
    CURRENT_DATE as database_today,
    CURRENT_TIMESTAMP as database_now,
    NOW() as now_function;

-- 2. Check ALL bookings (regardless of date)
SELECT 
    b.id,
    b.check_in_date,
    DATE(b.check_in_date) as check_in_date_only,
    b.check_out_date,
    b.status,
    g.first_name || ' ' || g.last_name as guest_name,
    r.room_number,
    DATE(b.check_in_date) = CURRENT_DATE as is_today,
    b.created_at
FROM bookings b
JOIN guests g ON b.guest_id = g.id
JOIN rooms r ON b.room_id = r.id
ORDER BY b.check_in_date DESC
LIMIT 10;

-- 3. Check bookings with today's date (exact query from backend)
SELECT 
    b.*, 
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

-- 4. Count bookings by date
SELECT 
    DATE(check_in_date) as check_in_date,
    status,
    COUNT(*) as count
FROM bookings
GROUP BY DATE(check_in_date), status
ORDER BY DATE(check_in_date) DESC;

-- 5. Check if there are ANY bookings at all
SELECT 
    COUNT(*) as total_bookings,
    COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
    COUNT(CASE WHEN status = 'checked_in' THEN 1 END) as checked_in_bookings,
    COUNT(CASE WHEN DATE(check_in_date) = CURRENT_DATE THEN 1 END) as today_bookings
FROM bookings;

-- 6. Show the most recent booking
SELECT 
    'Most recent booking:' as note,
    b.id,
    b.check_in_date,
    b.status,
    g.first_name || ' ' || g.last_name as guest_name,
    r.room_number
FROM bookings b
JOIN guests g ON b.guest_id = g.id
JOIN rooms r ON b.room_id = r.id
ORDER BY b.created_at DESC
LIMIT 1;
