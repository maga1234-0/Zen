-- Fix Foreign Key Constraints for User Deletion
-- This allows users to be deleted even when they have associated bookings or maintenance reports
-- The associated records will have their user references set to NULL instead of blocking deletion

-- ============================================
-- Fix bookings.created_by constraint
-- ============================================

-- Drop the existing foreign key constraint
ALTER TABLE bookings 
DROP CONSTRAINT IF EXISTS bookings_created_by_fkey;

-- Add it back with ON DELETE SET NULL
ALTER TABLE bookings 
ADD CONSTRAINT bookings_created_by_fkey 
FOREIGN KEY (created_by) 
REFERENCES users(id) 
ON DELETE SET NULL;

-- ============================================
-- Fix rooms.maintenance_reported_by constraint
-- ============================================

-- Drop the existing foreign key constraint
ALTER TABLE rooms 
DROP CONSTRAINT IF EXISTS rooms_maintenance_reported_by_fkey;

-- Add it back with ON DELETE SET NULL
ALTER TABLE rooms 
ADD CONSTRAINT rooms_maintenance_reported_by_fkey 
FOREIGN KEY (maintenance_reported_by) 
REFERENCES users(id) 
ON DELETE SET NULL;

-- ============================================
-- Verify the changes
-- ============================================

SELECT 
    'bookings.created_by' as table_column,
    confdeltype as delete_action,
    CASE confdeltype
        WHEN 'a' THEN 'NO ACTION'
        WHEN 'r' THEN 'RESTRICT'
        WHEN 'c' THEN 'CASCADE'
        WHEN 'n' THEN 'SET NULL'
        WHEN 'd' THEN 'SET DEFAULT'
    END as delete_action_name
FROM pg_constraint
WHERE conname = 'bookings_created_by_fkey'

UNION ALL

SELECT 
    'rooms.maintenance_reported_by' as table_column,
    confdeltype as delete_action,
    CASE confdeltype
        WHEN 'a' THEN 'NO ACTION'
        WHEN 'r' THEN 'RESTRICT'
        WHEN 'c' THEN 'CASCADE'
        WHEN 'n' THEN 'SET NULL'
        WHEN 'd' THEN 'SET DEFAULT'
    END as delete_action_name
FROM pg_constraint
WHERE conname = 'rooms_maintenance_reported_by_fkey';

-- Expected result: Both should show 'n' and 'SET NULL'
