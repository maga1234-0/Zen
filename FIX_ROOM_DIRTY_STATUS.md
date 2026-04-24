# Fix: Room Status Not Changing to Dirty After Checkout

## Root Cause Found! 🎯

The issue is that the database has a CHECK constraint on the `rooms` table that doesn't allow "dirty" as a valid status. When the code tries to set a room to "dirty" after checkout, the database rejects it with:

```
new row for relation "rooms" violates check constraint "rooms_status_check"
```

## The Problem

Your database was created with an older version of the schema that didn't include "dirty" in the allowed room statuses. The current `schema.sql` file has been updated to include it, but your existing database still has the old constraint.

## The Solution

Run the migration SQL file to update the constraint:

### Option 1: Using pgAdmin (Recommended)
1. Open pgAdmin
2. Connect to your `hotel_pms` database
3. Open the Query Tool
4. Copy and paste the contents of `database/fix-room-status-constraint.sql`
5. Click Execute (F5)
6. You should see: ✅ Room status constraint updated successfully!

### Option 2: Using Command Line
If you have PostgreSQL command line tools installed:
```bash
# Navigate to your project directory
cd C:\Users\aubin\Downloads\kiro1

# Run the migration
psql -U postgres -d hotel_pms -f database/fix-room-status-constraint.sql
```

### Option 3: Manual SQL Execution
Connect to your database and run these commands:

```sql
-- Drop the old constraint
ALTER TABLE rooms DROP CONSTRAINT IF EXISTS rooms_status_check;

-- Add the new constraint with 'dirty' included
ALTER TABLE rooms ADD CONSTRAINT rooms_status_check 
CHECK (status IN ('available', 'occupied', 'maintenance', 'cleaning', 'dirty'));
```

## Verify the Fix

After running the migration, test the checkout functionality:

### Test 1: Database Level Test
Run the test script:
```bash
node server/test-checkout-endpoint.js
```

You should see:
```
✅ SUCCESS! Checkout logic works correctly.
   - Booking status changed to "checked_out"
   - Room status changed to "dirty"
```

### Test 2: Application Level Test
1. Open your hotel management app
2. Go to the Bookings page
3. Find a booking with status "Checked In"
4. Click Edit
5. Change status to "Checked Out"
6. Click "Update Booking"
7. Go to the Rooms page
8. The room should now show status "Dirty" (or "Cleaning")

### Test 3: Check Server Logs
When you perform the checkout, you should see in the server console:
```
✅ Booking status changed from checked_in to checked_out
✅ Room {roomId} set to dirty after checkout
✅ Notification created for roles admin, manager, receptionist, housekeeping: Guest Checked Out
```

## What This Fixes

After applying this migration:

1. ✅ Rooms will automatically change to "dirty" when guests check out
2. ✅ Housekeeping staff will receive notifications about rooms needing cleaning
3. ✅ The auto-checkout scheduled job will work correctly
4. ✅ Manual checkout from the Bookings page will work
5. ✅ Front Desk checkout will work

## Why This Happened

The database constraint was created before "dirty" was added as a valid room status. The schema file was updated, but existing databases need to run a migration to update the constraint.

## Related Files

- `database/fix-room-status-constraint.sql` - The migration to fix the constraint
- `server/test-checkout-endpoint.js` - Test script to verify the fix
- `database/test-checkout-room-status.sql` - Diagnostic queries
- `CHECKOUT_ROOM_STATUS_DEBUG.md` - Full debugging guide

## Next Steps

1. Run the migration: `database/fix-room-status-constraint.sql`
2. Test with: `node server/test-checkout-endpoint.js`
3. Test in the application by checking out a guest
4. Verify rooms show "dirty" status after checkout
5. Check that housekeeping receives notifications

## Additional Notes

- The constraint now allows these room statuses: `available`, `occupied`, `maintenance`, `cleaning`, `dirty`
- "dirty" and "cleaning" are similar - both indicate the room needs attention
- The system uses "dirty" specifically to indicate a room that was just vacated
- Housekeeping can change "dirty" rooms to "cleaning" (in progress) and then to "available" (ready)
