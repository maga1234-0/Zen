-- Add hotel information columns to user_settings table
ALTER TABLE user_settings 
ADD COLUMN IF NOT EXISTS hotel_address VARCHAR(255) DEFAULT '123 Luxury Avenue',
ADD COLUMN IF NOT EXISTS hotel_city VARCHAR(255) DEFAULT 'Paradise City, PC 12345',
ADD COLUMN IF NOT EXISTS hotel_phone VARCHAR(50) DEFAULT '+1 (555) 123-4567',
ADD COLUMN IF NOT EXISTS hotel_email VARCHAR(255) DEFAULT 'info@grandhotel.com';

-- Update existing records with default values
UPDATE user_settings 
SET 
  hotel_address = COALESCE(hotel_address, '123 Luxury Avenue'),
  hotel_city = COALESCE(hotel_city, 'Paradise City, PC 12345'),
  hotel_phone = COALESCE(hotel_phone, '+1 (555) 123-4567'),
  hotel_email = COALESCE(hotel_email, 'info@grandhotel.com')
WHERE hotel_address IS NULL 
   OR hotel_city IS NULL 
   OR hotel_phone IS NULL 
   OR hotel_email IS NULL;
