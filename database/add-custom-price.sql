-- Add custom_price column to rooms table
-- This allows individual rooms to have custom pricing that overrides the room type base price

ALTER TABLE rooms 
ADD COLUMN custom_price DECIMAL(10, 2);

COMMENT ON COLUMN rooms.custom_price IS 'Optional custom price for this specific room. If NULL, uses room_type base_price';
