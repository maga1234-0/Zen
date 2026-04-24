-- ============================================
-- FIX ROOM STATUS CONSTRAINT IN PGADMIN
-- ============================================
-- Copy and paste these commands into pgAdmin Query Tool
-- Then click Execute (F5) or the Play button

-- Step 1: Check if the problem exists
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as current_definition
FROM pg_constraint 
WHERE conname = 'rooms_status_check';

-- If the above shows that 'dirty' is NOT in the constraint, continue with Step 2

-- Step 2: Drop the old constraint
ALTER TABLE rooms DROP CONSTRAINT IF EXISTS rooms_status_check;

-- Step 3: Add the new constraint with 'dirty' included
ALTER TABLE rooms ADD CONSTRAINT rooms_status_check 
CHECK (status IN ('available', 'occupied', 'maintenance', 'cleaning', 'dirty'));

-- Step 4: Verify the fix
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as new_definition
FROM pg_constraint 
WHERE conname = 'rooms_status_check';

-- Step 5: Test that 'dirty' is now allowed
-- This should succeed without errors
DO $$
DECLARE
    test_room_id UUID;
    original_status VARCHAR(20);
BEGIN
    -- Get a room to test
    SELECT id, status INTO test_room_id, original_status
    FROM rooms
    LIMIT 1;
    
    -- Try to set it to dirty
    UPDATE rooms SET status = 'dirty' WHERE id = test_room_id;
    
    -- Restore original status
    UPDATE rooms SET status = original_status WHERE id = test_room_id;
    
    RAISE NOTICE '✅ SUCCESS! Room status can now be set to dirty';
END $$;

-- Done! You should see: "✅ SUCCESS! Room status can now be set to dirty"
