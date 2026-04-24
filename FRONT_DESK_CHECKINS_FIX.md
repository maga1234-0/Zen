# Front Desk Check-ins Not Showing - Quick Fix

## Problem
The Front Desk page shows "No check-ins scheduled for today" even though you expect to see bookings.

## Most Common Cause
**You don't have any bookings with check-in date = TODAY**

The Front Desk only shows bookings where:
- Check-in date is exactly TODAY (not yesterday, not tomorrow)
- Status is 'confirmed' or 'checked_in'

## Quick Solution (2 Steps)

### Step 1: Create a Test Booking
Run this SQL in pgAdmin:

```sql
-- File: database/create-test-checkin.sql
-- This creates a booking with today's check-in date
```

Or create via UI:
1. Go to Bookings page
2. Click "New Booking"
3. Enter guest name: "Test Guest"
4. Select any available room
5. **Set check-in date to TODAY** ← Important!
6. Set check-out date to tomorrow
7. Set status to "Confirmed"
8. Click "Create Booking"

### Step 2: Refresh Front Desk
1. Go to Front Desk page
2. Press F5 to refresh
3. You should now see the booking in "Today's Check-ins"

## How to Verify

### Check 1: Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for: `Today's check-ins from API: [...]`
4. Should show array with booking data

### Check 2: Server Logs
1. Look at server terminal
2. Should see: `Today's check-ins query result: [...]`
3. Should show array with booking data

### Check 3: Database Query
Run in pgAdmin:
```sql
SELECT 
    b.check_in_date,
    b.status,
    g.first_name || ' ' || g.last_name as guest_name,
    r.room_number,
    DATE(b.check_in_date) = CURRENT_DATE as is_today
FROM bookings b
JOIN guests g ON b.guest_id = g.id
JOIN rooms r ON b.room_id = r.id
WHERE DATE(b.check_in_date) = CURRENT_DATE;
```

If this returns rows, the bookings should appear in Front Desk.

## Why This Happens

The Front Desk uses this query:
```sql
WHERE DATE(b.check_in_date) = CURRENT_DATE
AND b.status IN ('confirmed', 'checked_in')
```

This means:
- ✅ Shows: Bookings with check-in date = today
- ❌ Doesn't show: Past bookings
- ❌ Doesn't show: Future bookings (tomorrow, next week, etc.)
- ❌ Doesn't show: Cancelled or checked-out bookings
- ❌ Doesn't show: Pending bookings

## Example Scenarios

### Scenario 1: Booking for Tomorrow
```
Check-in date: Tomorrow
Status: Confirmed
Result: NOT shown in Front Desk (date is not today)
```

### Scenario 2: Booking for Today
```
Check-in date: Today
Status: Confirmed
Result: SHOWN in Front Desk ✅
```

### Scenario 3: Booking for Today but Cancelled
```
Check-in date: Today
Status: Cancelled
Result: NOT shown in Front Desk (status is cancelled)
```

### Scenario 4: Booking for Today but Pending
```
Check-in date: Today
Status: Pending
Result: NOT shown in Front Desk (status must be confirmed or checked_in)
```

## Testing Workflow

### Test 1: Create Today's Booking
```
1. Bookings → New Booking
2. Guest: "John Doe"
3. Room: 101
4. Check-in: TODAY (use date picker to select today)
5. Check-out: Tomorrow
6. Status: Confirmed
7. Save
8. Front Desk → Should see "John Doe" in check-ins
```

### Test 2: Create Tomorrow's Booking
```
1. Bookings → New Booking
2. Guest: "Jane Smith"
3. Room: 102
4. Check-in: TOMORROW
5. Check-out: Day after tomorrow
6. Status: Confirmed
7. Save
8. Front Desk → Should NOT see "Jane Smith" (not today)
9. Tomorrow → Should see "Jane Smith"
```

## Common Mistakes

### Mistake 1: Wrong Date
❌ Setting check-in date to tomorrow or next week
✅ Set check-in date to TODAY

### Mistake 2: Wrong Status
❌ Status is 'pending' or 'cancelled'
✅ Status must be 'confirmed' or 'checked_in'

### Mistake 3: Not Refreshing
❌ Expecting automatic update
✅ Refresh the page (F5) after creating booking

## Quick Debug Commands

### Check Today's Date
```sql
SELECT CURRENT_DATE, CURRENT_TIMESTAMP;
```

### Check All Bookings
```sql
SELECT 
    check_in_date,
    status,
    DATE(check_in_date) = CURRENT_DATE as is_today
FROM bookings
ORDER BY check_in_date;
```

### Count Today's Check-ins
```sql
SELECT COUNT(*) as today_checkins
FROM bookings
WHERE DATE(check_in_date) = CURRENT_DATE
AND status IN ('confirmed', 'checked_in');
```

## Still Not Working?

If you've created a booking with today's date and it still doesn't show:

1. **Check browser console for errors** (F12 → Console)
2. **Check server logs for errors** (server terminal)
3. **Verify the booking exists**:
   ```sql
   SELECT * FROM bookings ORDER BY created_at DESC LIMIT 1;
   ```
4. **Check the API endpoint** (F12 → Network → look for `/bookings/today/checkins`)
5. **Restart the server** and try again

## Summary

**The Front Desk shows bookings with check-in date = TODAY and status = 'confirmed' or 'checked_in'**

To see check-ins:
1. Create a booking with check-in date = TODAY
2. Set status to 'confirmed'
3. Refresh Front Desk page

---

**Quick Fix**: Run `database/create-test-checkin.sql` in pgAdmin, then refresh Front Desk page.
