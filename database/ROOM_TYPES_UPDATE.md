# Room Types Update

## Changes Made

### Room Type Names
Updated room types to use simple names without "Room" suffix:
- ~~Single Room~~ → **Single**
- ~~Double Room~~ → **Double**
- **Twin** (NEW)
- **Suite**

### Add Room Form
- Room type dropdown now shows only the type name (no prices)
- Price field is now **required** and labeled "Price per Night"
- User must enter the price when creating a room

## Apply Updates to Database

### Option 1: Run the update script
```bash
psql -U postgres -d hotel_pms -f database/update-room-types.sql
```

### Option 2: Manual SQL
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

## Room Types List

After update, you will have:

1. **Single** - 1 guest, base price $89.99
2. **Double** - 2 guests, base price $129.99
3. **Twin** - 2 guests, base price $139.99
4. **Suite** - 4 guests, base price $299.99

## How It Works Now

When adding a new room:
1. Select room type from dropdown (Single, Double, Twin, or Suite)
2. Enter room number (e.g., 101, 205)
3. Enter floor number
4. **Enter price** (required field)
5. Select status (Available, Maintenance, Cleaning, Dirty)

The price you enter will be stored as `custom_price` for that specific room.

## Example

Creating Room 305:
- Room Type: Suite
- Room Number: 305
- Floor: 3
- Price: $350.00 (custom price, higher than base $299.99)
- Status: Available

This allows flexibility - you can have different prices for the same room type based on location, view, size, etc.
