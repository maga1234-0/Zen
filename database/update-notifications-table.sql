-- Update notifications table to support new notification types and priority

-- Add priority column if it doesn't exist
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high'));

-- Update the type constraint to include new types
ALTER TABLE notifications 
DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE notifications 
ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('booking', 'room', 'housekeeping', 'payment', 'maintenance', 'system', 'check_in', 'check_out'));

-- Verify the changes
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;
