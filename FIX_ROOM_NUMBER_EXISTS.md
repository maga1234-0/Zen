# Fix: Room Number Already Exists Error

## Problem
When trying to create a room, you get the error: "Room number already exists"

## Why This Happens
The room number you're trying to use (e.g., 102) is already in the database, even if you don't see it on the screen (it might be filtered out or on another page).

## Solution Options

### Option 1: Use a Different Room Number (Quickest)

Simply try a different room number that doesn't exist yet. Common available numbers:
- 103, 104, 105, 106, etc.
- 201, 202, 203, etc.
- 301, 302, 303, etc.

### Option 2: Check Which Rooms Exist (Recommended)

Run this in pgAdmin to see all existing rooms:

```sql
SELECT 
    room_number,
    floor,
    status,
    type_name
FROM rooms r
LEFT JOIN room_types rt ON r.room_type_id = rt.id
ORDER BY room_number;
```

This shows you all room numbers that are taken.

### Option 3: Find Available Room Numbers

Run this in pgAdmin to see which room numbers are available:

```sql
-- Check rooms 101-120
SELECT 
    room_num::text as room_number,
    CASE 
        WHEN EXISTS (SELECT 1 FROM rooms WHERE room_number = room_num::text) 
        THEN '❌ Exists'
        ELSE '✅ Available'
    END as status
FROM generate_series(101, 120) as room_num
ORDER BY room_num;
```

### Option 4: Delete the Existing Room (If it's a duplicate)

If room 102 shouldn't exist, you can delete it:

```sql
-- First, check what room 102 is
SELECT * FROM rooms WHERE room_number = '102';

-- If you want to delete it
DELETE FROM rooms WHERE room_number = '102';
```

**Warning**: Only delete if you're sure the room shouldn't exist!

### Option 5: Update the Existing Room Instead

If room 102 exists but you want to change it:

1. Go to the Rooms page
2. Search for room 102
3. Click the Edit button (pencil icon)
4. Update the room details

## Quick Fix in Your App

Instead of creating room 102, try creating:
- **Room 103** (if you want floor 1)
- **Room 203** (if you want floor 2)
- **Room 303** (if you want floor 3)

Just change the room number in the form and click "Create Room" again.

## Check Your Current Rooms

From your screenshot, I can see you have:
- Room 100 (Floor 1, Double, Dirty)
- Room 200 (Floor 1, Double, Dirty)
- Room 900 (Floor 1, Twin, Available)

So room 102 must exist somewhere in your database.

## Prevent This in the Future

The app already checks for duplicate room numbers, which is why you're seeing this error. This is actually a good thing - it prevents you from accidentally creating duplicate rooms!

## Files Created

- `database/check-existing-rooms.sql` - Check all existing rooms and find available numbers
- `FIX_ROOM_NUMBER_EXISTS.md` - This guide

## Summary

The error is working as intended - it's protecting you from creating duplicate rooms. Simply:
1. Choose a different room number (103, 104, 105, etc.)
2. Or check which rooms exist using the SQL query above
3. Or delete the existing room 102 if it's a mistake
