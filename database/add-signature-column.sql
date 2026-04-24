-- Add signature column to user_settings table
ALTER TABLE user_settings 
ADD COLUMN IF NOT EXISTS signature TEXT DEFAULT '';

-- Update existing records with empty signature
UPDATE user_settings 
SET signature = ''
WHERE signature IS NULL;
