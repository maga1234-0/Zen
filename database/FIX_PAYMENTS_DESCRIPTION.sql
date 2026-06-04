-- Fix: Add description column to payments table
-- The backend code expects a 'description' column but the table only has 'notes'

-- Option 1: Add description column (recommended - keeps backward compatibility)
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Option 2: If you prefer to use 'notes' everywhere, you can rename it
-- ALTER TABLE payments RENAME COLUMN notes TO description;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'payments' 
AND column_name IN ('description', 'notes');

SELECT '✅ Colonne description ajoutée à la table payments' AS message;
