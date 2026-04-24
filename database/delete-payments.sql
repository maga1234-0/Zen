-- Delete all payments from the database
-- Run this in pgAdmin or your PostgreSQL client

DELETE FROM payments;

-- Reset the sequence (optional - for clean IDs)
-- ALTER SEQUENCE payments_id_seq RESTART WITH 1;

-- Verify deletion
SELECT COUNT(*) as remaining_payments FROM payments;
