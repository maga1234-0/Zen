# Checkout Room Status Debug Guide

## Issue
When a guest checks out, the room status should automatically change to "dirty" but it's not happening.

## How It Should Work

### Backend Logic (server/src/routes/bookingRoutes.ts)
When booking status is updated to "checked_out" via `PATCH /bookings/:id/status`:
1. Updates booking status to "checked_out"
2. Sets room status to "dirty"
3. Sends notification to housekeeping staff
4. Logs: `✅ Room {roomId} set to dirty after checkout`

### Frontend Logic (client/src/pages/Bookings.tsx)
When editing a booking and changing status:
1. Calls `PATCH /bookings/:id` to update booking details
2. If status changed, also calls `PATCH /bookings/:id/status` to trigger room status update
3. Invalidates rooms query to refresh UI

### Auto-Checkout Job (server/src/services/scheduledJobs.ts)
Runs every hour:
1. Finds bookings with status='checked_in' and checkout_date <= today
2. Updates booking to "checked_out"
3. Sets room to "dirty"
4. Sends notification

## Diagnostic Steps

### 1. Check Server is Running
```bash
# Check if Node processes are running
Get-Process -Name node

# Server should be running on port 5000
```

### 2. Test Database State
Run the test SQL file:
```bash
psql -U postgres -d hotel_pms -f database/test-checkout-room-status.sql
```

This will show:
- Current checked-in bookings
- Rooms that should be dirty after checkout
- Room status counts
- Recent checkout activity

### 3. Check Server Logs
When you edit a booking and change status to "Checked Out", you should see:
```
✅ Booking status changed from checked_in to checked_out
✅ Room {roomId} set to dirty after checkout
✅ Notification created for roles admin, manager, receptionist, housekeeping: Guest Checked Out
```

### 4. Test Manually

#### Option A: Edit Existing Booking
1. Go to Bookings page
2. Find a booking with status "Checked In"
3. Click Edit
4. Change status to "Checked Out"
5. Click "Update Booking"
6. Check server console for logs
7. Go to Rooms page - room should show "dirty" status

#### Option B: Create Test Booking and Check Out
1. Go to Bookings page
2. Create new booking with status "Checked In"
3. Edit the booking
4. Change status to "Checked Out"
5. Verify room becomes "dirty"

### 5. Verify API Endpoint
Test the status endpoint directly:
```bash
# Get a checked-in booking ID from the database
psql -U postgres -d hotel_pms -c "SELECT id, room_id FROM bookings WHERE status='checked_in' LIMIT 1;"

# Test the endpoint (replace {booking_id} with actual ID)
curl -X PATCH http://localhost:5000/api/bookings/{booking_id}/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {your_token}" \
  -d '{"status":"checked_out"}'

# Check if room status changed
psql -U postgres -d hotel_pms -c "SELECT room_number, status FROM rooms WHERE id=(SELECT room_id FROM bookings WHERE id='{booking_id}');"
```

## Common Issues and Solutions

### Issue 1: Server Not Restarted
**Symptom**: Code looks correct but changes don't take effect
**Solution**: Restart the server
```bash
# Stop server (Ctrl+C in terminal)
# Start server again
cd server
npm run dev
```

### Issue 2: Frontend Not Calling Status Endpoint
**Symptom**: Booking updates but room status doesn't change
**Check**: Look at browser console for API calls
**Solution**: Verify lines 95-100 in Bookings.tsx are executing

### Issue 3: Database Transaction Rollback
**Symptom**: Changes don't persist
**Check**: Server logs for "ROLLBACK" messages
**Solution**: Check for database errors in logs

### Issue 4: Room Has Multiple Active Bookings
**Symptom**: Room doesn't become available after cancellation
**Reason**: This is correct behavior - room stays occupied if other bookings exist
**Check**: Run query to see active bookings for the room

## Expected Behavior Summary

| Action | Booking Status | Room Status | Notification |
|--------|---------------|-------------|--------------|
| Create booking (confirmed) | confirmed | occupied | New Booking |
| Check in guest | checked_in | occupied | Guest Checked In |
| Check out guest | checked_out | dirty | Guest Checked Out (to housekeeping) |
| Cancel booking (no other bookings) | cancelled | available | Booking Cancelled |
| Delete booking (no other bookings) | deleted | available | Booking Cancelled |
| Auto-checkout (hourly job) | checked_out | dirty | Guest Checked Out |

## Quick Fix Commands

### Manually Fix Rooms That Should Be Dirty
```sql
-- Find checked-out bookings with non-dirty rooms
UPDATE rooms r
SET status = 'dirty'
FROM bookings b
WHERE r.id = b.room_id
AND b.status = 'checked_out'
AND r.status != 'dirty'
AND b.updated_at > NOW() - INTERVAL '24 hours';
```

### Reset Test Data
```bash
psql -U postgres -d hotel_pms -f database/clean-data.sql
psql -U postgres -d hotel_pms -f database/seed.sql
```

## Next Steps

1. Run diagnostic SQL: `database/test-checkout-room-status.sql`
2. Check server logs when editing booking status
3. Verify the status endpoint is being called from frontend
4. Test with a fresh booking to isolate the issue
5. Check if auto-checkout job is working (wait for hourly run or trigger manually)
