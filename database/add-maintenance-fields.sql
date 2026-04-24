-- Add maintenance tracking fields to rooms table

-- Add maintenance reason and urgency columns
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS maintenance_reason TEXT,
ADD COLUMN IF NOT EXISTS is_urgent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS maintenance_reported_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS maintenance_reported_by UUID REFERENCES users(id);

-- Create index for maintenance tracking
CREATE INDEX IF NOT EXISTS idx_rooms_maintenance ON rooms(status, is_urgent) WHERE status = 'maintenance';

-- Comment on columns
COMMENT ON COLUMN rooms.maintenance_reason IS 'Reason for maintenance status';
COMMENT ON COLUMN rooms.is_urgent IS 'Whether the maintenance is urgent';
COMMENT ON COLUMN rooms.maintenance_reported_at IS 'When maintenance was reported';
COMMENT ON COLUMN rooms.maintenance_reported_by IS 'User who reported the maintenance';
