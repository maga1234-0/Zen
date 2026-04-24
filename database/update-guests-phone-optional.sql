-- Make phone field optional in guests table
-- This allows creating minimal guest records from bookings

-- Remove NOT NULL constraint from phone field
ALTER TABLE guests 
ALTER COLUMN phone DROP NOT NULL;

-- Verify the change
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'guests' 
AND column_name IN ('phone', 'email')
ORDER BY column_name;

-- Update any existing empty phone values to NULL for consistency
UPDATE guests 
SET phone = NULL 
WHERE phone = '' OR TRIM(phone) = '';

-- Show result
SELECT 
    COUNT(*) as total_guests,
    COUNT(phone) as guests_with_phone,
    COUNT(*) - COUNT(phone) as guests_without_phone
FROM guests;
