# Fix: Room Types Not Showing in Dropdown

## Problem
When adding a new room, the "Room Type" dropdown is empty - no options to select.

## Root Cause
The `room_types` table in your database is empty. The room types need to be inserted.

## Solution

### Option 1: Run SQL in pgAdmin (Recommended - 1 minute)

1. **Open pgAdmin**
2. **Connect to `hotel_pms` database**
3. **Open Query Tool**
4. **Copy and paste this SQL:**

```sql
-- Insert default room types
INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities)
SELECT 
    '550e8400-e29b-41d4-a716-446655440000',
    'Single',
    'Cozy room perfect for solo travelers',
    89.99,
    1,
    '["WiFi", "TV", "Air Conditioning"]'
WHERE NOT EXISTS (SELECT 1 FROM room_types WHERE name = 'Single');

INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities)
SELECT 
    '550e8400-e29b-41d4-a716-446655440000',
    'Double',
    'Comfortable room with double bed',
    129.99,
    2,
    '["WiFi", "TV", "Air Conditioning", "Mini Bar"]'
WHERE NOT EXISTS (SELECT 1 FROM room_types WHERE name = 'Double');

INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities)
SELECT 
    '550e8400-e29b-41d4-a716-446655440000',
    'Suite',
    'Luxurious suite with separate living area',
    249.99,
    4,
    '["WiFi", "TV", "Air Conditioning", "Mini Bar", "Jacuzzi", "Kitchen"]'
WHERE NOT EXISTS (SELECT 1 FROM room_types WHERE name = 'Suite');

INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities)
SELECT 
    '550e8400-e29b-41d4-a716-446655440000',
    'Deluxe',
    'Premium room with city view',
    179.99,
    2,
    '["WiFi", "TV", "Air Conditioning", "Mini Bar", "Balcony"]'
WHERE NOT EXISTS (SELECT 1 FROM room_types WHERE name = 'Deluxe');
```

5. **Click Execute (F5)**
6. **Refresh your app** - Room types should now appear!

### Option 2: Use the SQL File

1. Open pgAdmin
2. Connect to `hotel_pms` database
3. Open Query Tool
4. Click **Open File** icon
5. Navigate to: `database/add-room-types-if-missing.sql`
6. Click Execute (F5)

### Option 3: Re-run Seed Data

If you want to reset everything:

```bash
# In pgAdmin Query Tool
-- Clear existing data
DELETE FROM room_types;

-- Then run the seed file
-- Or copy from database/seed.sql (room_types section)
```

## Verify the Fix

After running the SQL:

1. **Check in pgAdmin:**
   ```sql
   SELECT name, base_price FROM room_types ORDER BY name;
   ```
   
   You should see:
   - Deluxe - $179.99
   - Double - $129.99
   - Single - $89.99
   - Suite - $249.99

2. **Check in your app:**
   - Go to Rooms page
   - Click "Add Room"
   - The "Room Type" dropdown should now show: Single, Double, Suite, Deluxe

## What Room Types Are Added

| Room Type | Price/Night | Max Occupancy | Amenities |
|-----------|-------------|---------------|-----------|
| Single | $89.99 | 1 | WiFi, TV, AC |
| Double | $129.99 | 2 | WiFi, TV, AC, Mini Bar |
| Deluxe | $179.99 | 2 | WiFi, TV, AC, Mini Bar, Balcony |
| Suite | $249.99 | 4 | WiFi, TV, AC, Mini Bar, Jacuzzi, Kitchen |

## Why This Happened

The `room_types` table was created but never populated with data. The seed file has the data, but it might not have been run, or the table was cleared at some point.

## Files Created

- `database/add-room-types-if-missing.sql` - SQL to add room types
- `database/check-room-types.sql` - Check and auto-insert room types
- `FIX_ROOM_TYPES_DROPDOWN.md` - This guide

## After Fixing

Once room types are added:
- ✅ You can create new rooms with proper types
- ✅ Room prices will be based on room type
- ✅ Bookings will show correct room type information
- ✅ Reports will categorize rooms by type

## Need to Add More Room Types?

You can add custom room types:

```sql
INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Presidential Suite',
    'Ultimate luxury experience',
    499.99,
    6,
    '["WiFi", "TV", "Air Conditioning", "Mini Bar", "Jacuzzi", "Kitchen", "Butler Service"]'
);
```
