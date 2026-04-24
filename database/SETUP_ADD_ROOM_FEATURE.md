# Setup Add Room Feature

Follow these steps to enable the "Add Room" functionality.

## Step 1: Add custom_price Column

Run this SQL in pgAdmin Query Tool:

```sql
-- Add custom_price column if it doesn't exist
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
```

## Step 2: Update Room Type Names

Run this SQL to update room type names and add Twin:

```sql
-- Update existing names
UPDATE room_types SET name = 'Single' WHERE name LIKE '%Single%';
UPDATE room_types SET name = 'Double' WHERE name LIKE '%Double%';

-- Add Twin type (only if it doesn't exist)
INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities)
SELECT 
    '550e8400-e29b-41d4-a716-446655440000',
    'Twin',
    'Room with two single beds',
    139.99,
    2,
    '["WiFi", "TV", "Air Conditioning", "Mini Bar"]'::jsonb
WHERE NOT EXISTS (
    SELECT 1 FROM room_types WHERE name = 'Twin'
);
```

## Step 3: Verify Setup

Run this to verify everything is set up correctly:

```sql
-- Check custom_price column exists
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'rooms' AND column_name = 'custom_price';

-- Check room types
SELECT id, name, base_price, max_occupancy 
FROM room_types 
WHERE hotel_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY name;
```

Expected results:
- custom_price column should exist (numeric, nullable)
- You should see 4 room types: Double, Single, Suite, Twin

## Step 4: Restart Backend Server

1. Stop the backend server (Ctrl+C in the terminal)
2. Restart it:
   ```bash
   cd server
   npm run dev
   ```

## Step 5: Test the Feature

1. Go to the Rooms page
2. Click "Add Room" button
3. Fill in the form:
   - Room Number: e.g., 401
   - Room Type: Select from dropdown (Single, Double, Twin, Suite)
   - Price per Night: e.g., 150.00
   - Floor: e.g., 4
   - Status: Available
4. Click "Create Room"

## Troubleshooting

### Button doesn't open modal
- Check browser console for errors (F12)
- Make sure frontend is running on http://localhost:5174

### "Failed to create room" error
- Check backend server is running on http://localhost:5000
- Check backend console for error messages
- Verify custom_price column exists in database

### "Room number already exists" error
- Choose a different room number
- Check existing rooms: `SELECT room_number FROM rooms ORDER BY room_number;`

### Backend errors about custom_price
- Run Step 1 again to add the column
- Restart backend server

## Quick Fix - Run All at Once

Copy and paste this entire block into pgAdmin:

```sql
-- Add custom_price column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'rooms' AND column_name = 'custom_price'
    ) THEN
        ALTER TABLE rooms ADD COLUMN custom_price DECIMAL(10, 2);
    END IF;
END $$;

-- Update room type names
UPDATE room_types SET name = 'Single' WHERE name LIKE '%Single%';
UPDATE room_types SET name = 'Double' WHERE name LIKE '%Double%';

-- Add Twin type
INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities)
SELECT 
    '550e8400-e29b-41d4-a716-446655440000',
    'Twin',
    'Room with two single beds',
    139.99,
    2,
    '["WiFi", "TV", "Air Conditioning", "Mini Bar"]'::jsonb
WHERE NOT EXISTS (
    SELECT 1 FROM room_types WHERE name = 'Twin'
);

-- Verify
SELECT 'custom_price column:' as check_type, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'rooms' AND column_name = 'custom_price'
UNION ALL
SELECT 'room_types:' as check_type, name, base_price::text 
FROM room_types 
WHERE hotel_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY check_type, column_name;
```

Then restart the backend server and try again!
