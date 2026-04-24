-- Fix room status constraint to include 'dirty' status
-- This migration updates the check constraint to allow 'dirty' as a valid room status

-- Step 1: Drop the old constraint
ALTER TABLE rooms DROP CONSTRAINT IF EXISTS rooms_status_check;

-- Step 2: Add the new constraint with 'dirty' included
ALTER TABLE rooms ADD CONSTRAINT rooms_status_check 
CHECK (status IN ('available', 'occupied', 'maintenance', 'cleaning', 'dirty'));

-- Step 3: Verify the constraint was updated
SELECT conname, pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'rooms_status_check';

-- Step 4: Show current room statuses
SELECT status, COUNT(*) as count
FROM rooms
GROUP BY status
ORDER BY count DESC;

-- Success message
SELECT '✅ Room status constraint updated successfully! "dirty" is now a valid status.' as result;
