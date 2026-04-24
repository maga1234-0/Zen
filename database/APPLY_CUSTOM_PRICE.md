# Apply Custom Price Migration

This migration adds the `custom_price` column to the `rooms` table, allowing individual rooms to have custom pricing that overrides the room type base price.

## How to Apply

### Option 1: Using psql command line
```bash
psql -U postgres -d hotel_pms -f database/add-custom-price.sql
```

### Option 2: Using pgAdmin
1. Open pgAdmin
2. Connect to your `hotel_pms` database
3. Open Query Tool
4. Copy and paste the contents of `add-custom-price.sql`
5. Execute the query

### Option 3: Direct SQL
```sql
ALTER TABLE rooms 
ADD COLUMN custom_price DECIMAL(10, 2);
```

## What This Does

- Adds a `custom_price` column to the `rooms` table
- Type: `DECIMAL(10, 2)` (allows prices like 99.99)
- Nullable: Yes (NULL means use the room type's base price)
- When a room has a custom price, it overrides the room type's base price
- When NULL, the system uses the room type's base price

## Usage

When creating a room:
- Leave custom price empty → uses room type price
- Enter a custom price → uses that specific price for this room

Example:
- Room Type "Deluxe" has base price $150/night
- Room 301 (Deluxe) can have custom price $180/night (better view)
- Room 302 (Deluxe) can have custom price $120/night (smaller)
- Room 303 (Deluxe) with no custom price uses $150/night

## Verification

After applying, verify with:
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'rooms' AND column_name = 'custom_price';
```

Expected result:
```
column_name  | data_type | is_nullable
-------------+-----------+-------------
custom_price | numeric   | YES
```
