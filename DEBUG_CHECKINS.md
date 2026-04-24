# Debug Check-ins Not Showing

## Problem
The Front Desk page is not showing today's check-ins.

## Possible Causes

### 1. No Bookings with Today's Date
The most common reason is that there are no bookings with check-in date = today.

### 2. Booking Status is Wrong
Bookings must have status 'confirmed' or 'checked_in' to appear.

### 3. Date Format Issue
The database might be storing dates in a different timezone.

## How to Debug

### Step 1: Check Server Logs
1. Open the server terminal
2. Go to Front Desk page in the browser
3. Look for this log: `Today's check-ins query result: [...]`
4. If it shows empty array `[]`, there are no matching bookings

### Step 2: Check Database Directly
Run this query in pgAdmin:

```sql
-- Check all bookings with today's check-in date
SELECT 
    b.id,
    b.check_in_date,
    b.status,
    g.first_name || ' ' || g.last_name as guest_name,
    r.room_number
FROM bookings b
JOIN guests g ON b.guest_id = g.id
JOIN rooms r ON b.room_id = r.id
WHERE DATE(b.check_in_date) = CURRENT_DATE
ORDER BY b.check_in_date;
```

If this returns no rows, you need to create a booking with today's date.

### Step 3: Check All Bookings
Run this to see all bookings:

```sql
-- See all bookings with their dates
SELECT 
    b.id,
    b.check_in_date,
    b.check_out_date,
    b.status,
    g.first_name || ' ' || g.last_name as guest_name,
    r.room_number
FROM bookings b
JOIN guests g ON b.guest_id = g.id
JOIN rooms r ON b.room_id = r.id
ORDER BY b.check_in_date DESC;
```

### Step 4: Check Current Date
Run this to verify the database date:

```sql
-- Check what the database thinks "today" is
SELECT CURRENT_DATE, CURRENT_TIMESTAMP;
```

## Solution: Create Test Booking

If you don't have any bookings with today's date, create one:

### Option 1: Via UI
1. Go to Bookings page
2. Click "New Booking"
3. Enter guest name: "Test Guest"
4. Select an available room
5. **Set check-in date to TODAY**
6. Set check-out date to tomorrow or later
7. Set status to "Confirmed"
8. Save

### Option 2: Via SQL
Run this in pgAdmin:

```sql
-- First, get a guest ID and room ID
SELECT id FROM guests LIMIT 1; -- Copy this ID
SELECT id FROM rooms WHERE status = 'available' LIMIT 1; -- Copy this ID

-- Then create a booking with today's date
INSERT INTO bookings (
    hotel_id, 
    guest_id, 
    room_id, 
    check_in_date, 
    check_out_date, 
    number_of_guests, 
    total_amount, 
    status
)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000', -- hotel_id
    'PASTE_GUEST_ID_HERE', 
    'PASTE_ROOM_ID_HERE', 
    CURRENT_DATE, -- Today
    CURRENT_DATE + INTERVAL '2 days', -- 2 days from now
    2, 
    200.00, 
    'confirmed'
);

-- Update room status to occupied
UPDATE rooms 
SET status = 'occupied' 
WHERE id = 'PASTE_ROOM_ID_HERE';
```

## Verification Steps

After creating a booking with today's date:

1. **Refresh Front Desk page** (F5)
2. **Check Server Logs**: Should see the booking in the query result
3. **Check Browser Console**: Should see "Today's check-ins from API: [...]"
4. **Front Desk Page**: Should show the booking in "Today's Check-ins" section

## Expected Behavior

### Check-ins Show When:
- ✅ Check-in date = TODAY
- ✅ Status = 'confirmed' OR 'checked_in'
- ✅ Booking has valid guest and room

### Check-ins Don't Show When:
- ❌ Check-in date is in the past
- ❌ Check-in date is in the future
- ❌ Status is 'cancelled' or 'checked_out'
- ❌ Status is 'pending'

## Quick Test

### Test 1: Create Today's Check-in
```
1. Bookings → New Booking
2. Guest: "John Doe"
3. Room: Any available
4. Check-in: TODAY
5. Check-out: Tomorrow
6. Status: Confirmed
7. Save
8. Go to Front Desk
9. Should see "John Doe" in check-ins
```

### Test 2: Check Browser Console
```
1. Open DevTools (F12)
2. Go to Console tab
3. Go to Front Desk page
4. Look for: "Today's check-ins from API: [...]"
5. Should show array with booking data
```

### Test 3: Check Server Logs
```
1. Look at server terminal
2. Should see: "Today's check-ins query result: [...]"
3. Should show array with booking data
```

## Common Issues

### Issue 1: "No check-ins scheduled for today"
**Cause**: No bookings with today's date
**Fix**: Create a booking with check-in date = today

### Issue 2: Booking exists but not showing
**Cause**: Status is not 'confirmed' or 'checked_in'
**Fix**: Edit the booking and change status to 'confirmed'

### Issue 3: Date is off by one day
**Cause**: Timezone mismatch
**Fix**: Check database timezone vs server timezone

### Issue 4: Empty array in console
**Cause**: Query returning no results
**Fix**: Run the SQL queries above to check database

## Debug Checklist

- [ ] Check server logs for query result
- [ ] Check browser console for API response
- [ ] Run SQL query to check bookings
- [ ] Verify CURRENT_DATE in database
- [ ] Create test booking with today's date
- [ ] Refresh Front Desk page
- [ ] Verify booking appears

## Still Not Working?

If check-ins still don't show after creating a booking with today's date:

1. **Check the booking was created**:
   ```sql
   SELECT * FROM bookings ORDER BY created_at DESC LIMIT 1;
   ```

2. **Check the date format**:
   ```sql
   SELECT 
       check_in_date,
       DATE(check_in_date),
       CURRENT_DATE,
       DATE(check_in_date) = CURRENT_DATE as is_today
   FROM bookings
   ORDER BY created_at DESC LIMIT 1;
   ```

3. **Check for errors**:
   - Browser console (F12)
   - Server terminal
   - Network tab (check API response)

---

**Most Likely Solution**: Create a booking with check-in date = today and status = 'confirmed'
