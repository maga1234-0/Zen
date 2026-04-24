-- Check if custom_price column exists and add it if not

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'rooms' 
        AND column_name = 'custom_price'
    ) THEN
        ALTER TABLE rooms ADD COLUMN custom_price DECIMAL(10, 2);
        RAISE NOTICE 'Column custom_price added successfully';
    ELSE
        RAISE NOTICE 'Column custom_price already exists';
    END IF;
END $$;

-- Verify
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'rooms' 
ORDER BY ordinal_position;
