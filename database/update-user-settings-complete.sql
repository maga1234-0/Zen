-- Complete update for user_settings table with all new columns

-- Add hotel information columns if they don't exist
ALTER TABLE user_settings 
ADD COLUMN IF NOT EXISTS hotel_address VARCHAR(255) DEFAULT '123 Luxury Avenue',
ADD COLUMN IF NOT EXISTS hotel_city VARCHAR(255) DEFAULT 'Paradise City, PC 12345',
ADD COLUMN IF NOT EXISTS hotel_phone VARCHAR(50) DEFAULT '+1 (555) 123-4567',
ADD COLUMN IF NOT EXISTS hotel_email VARCHAR(255) DEFAULT 'info@grandhotel.com',
ADD COLUMN IF NOT EXISTS signature TEXT DEFAULT '';

-- Update existing records with default values where NULL
UPDATE user_settings 
SET 
  hotel_address = COALESCE(hotel_address, '123 Luxury Avenue'),
  hotel_city = COALESCE(hotel_city, 'Paradise City, PC 12345'),
  hotel_phone = COALESCE(hotel_phone, '+1 (555) 123-4567'),
  hotel_email = COALESCE(hotel_email, 'info@grandhotel.com'),
  signature = COALESCE(signature, '')
WHERE hotel_address IS NULL 
   OR hotel_city IS NULL 
   OR hotel_phone IS NULL 
   OR hotel_email IS NULL
   OR signature IS NULL;

-- Verify the changes
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'user_settings' 
ORDER BY ordinal_position;
