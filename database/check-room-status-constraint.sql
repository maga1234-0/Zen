-- Check the current room status constraint
SELECT conname, pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'rooms_status_check';

-- Show all room statuses currently in use
SELECT DISTINCT status, COUNT(*) as count
FROM rooms
GROUP BY status
ORDER BY count DESC;

-- Try to see if 'dirty' is a valid status by checking the constraint
SELECT 
    table_name,
    constraint_name,
    check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'rooms_status_check';
