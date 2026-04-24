-- Add profile_picture column to users table

ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'profile_picture';

SELECT '✅ Profile picture column added to users table' as result;
