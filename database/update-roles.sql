-- Update the role constraint to include new roles
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role IN ('admin', 'manager', 'receptionist', 'housekeeping', 'maintenance', 'accountant'));
