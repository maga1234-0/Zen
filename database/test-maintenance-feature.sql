-- Test Maintenance Feature
-- Run this after applying add-maintenance-fields.sql

-- 1. Verify new columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'rooms' 
  AND column_name IN ('maintenance_reason', 'is_urgent', 'maintenance_reported_at', 'maintenance_reported_by')
ORDER BY column_name;

-- 2. Check current rooms in maintenance
SELECT 
    room_number,
    status,
    maintenance_reason,
    is_urgent,
    maintenance_reported_at,
    floor
FROM rooms
WHERE status = 'maintenance'
ORDER BY is_urgent DESC, maintenance_reported_at DESC;

-- 3. Test updating a room to maintenance status
-- (Replace the room_id with an actual room ID from your database)
-- UPDATE rooms 
-- SET 
--     status = 'maintenance',
--     maintenance_reason = 'AC not working properly',
--     is_urgent = true,
--     maintenance_reported_at = NOW(),
--     maintenance_reported_by = (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
-- WHERE room_number = '101'
-- RETURNING *;

-- 4. View all maintenance tasks with urgency
SELECT 
    r.room_number,
    r.floor,
    r.maintenance_reason,
    r.is_urgent,
    r.maintenance_reported_at,
    u.first_name || ' ' || u.last_name as reported_by
FROM rooms r
LEFT JOIN users u ON r.maintenance_reported_by = u.id
WHERE r.status = 'maintenance'
ORDER BY r.is_urgent DESC, r.maintenance_reported_at ASC;

-- 5. Count urgent vs normal maintenance tasks
SELECT 
    CASE WHEN is_urgent THEN 'Urgent' ELSE 'Normal' END as priority,
    COUNT(*) as count
FROM rooms
WHERE status = 'maintenance'
GROUP BY is_urgent;

-- 6. Test completing maintenance (clearing fields)
-- UPDATE rooms 
-- SET 
--     status = 'available',
--     maintenance_reason = NULL,
--     is_urgent = false,
--     maintenance_reported_at = NULL,
--     maintenance_reported_by = NULL
-- WHERE room_number = '101'
-- RETURNING *;
