# Room Status Update Fix

## Problem

When editing a booking and changing its status to "checked_out" or "cancelled", the room status was not updating automatically. The room remained in its previous state instead of changing to:
- **"dirty"** when booking is checked out
- **"available"** when booking is cancelled (and no other active bookings exist)

## Root Cause

The frontend was calling the wrong API endpoint when updating bookings. It was using:
```
PATCH /api/bookings/:id
```

This endpoint only updates booking fields but does NOT update room status.

The correct endpoint for status changes is:
```
PATCH /api/bookings/:id/status
```

This endpoint includes logic to update room status based on the booking status change.

## Solution

Updated `client/src/pages/Bookings.tsx` to:

1. **Detect Status Changes**: Check if the booking status has changed during edit
2. **Call Status Endpoint**: If status changed, call the `/status` endpoint after updating booking
3. **Refresh Rooms**: Invalidate rooms query to refresh the Rooms page with updated status

## Code Changes

### Before
```typescript
await api.patch(`/bookings/${editingBooking.id}`, {
  checkInDate: bookingData.checkInDate,
  checkOutDate: bookingData.checkOutDate,
  numberOfGuests: bookingData.numberOfGuests,
  status: bookingData.status,
  totalAmount,
  specialRequests: bookingData.specialRequests,
});
```

### After
```typescript
// Update booking details
await api.patch(`/bookings/${editingBooking.id}`, {
  checkInDate: bookingData.checkInDate,
  checkOutDate: bookingData.checkOutDate,
  numberOfGuests: bookingData.numberOfGuests,
  status: bookingData.status,
  totalAmount,
  specialRequests: bookingData.specialRequests,
});

// If status changed, also call the status endpoint to update room status
if (statusChanged) {
  await api.patch(`/bookings/${editingBooking.id}/status`, {
    status: bookingData.status,
  });
}

// Refresh rooms list
queryClient.invalidateQueries({ queryKey: ['rooms'] });
```

## How It Works Now

### Scenario 1: Check Out Guest
```
1. Edit booking
2. Change status to "Checked Out"
3. Save
   ↓
4. Backend updates booking status
5. Backend sets room status to "dirty"
6. Frontend refreshes rooms list
   ↓
7. Room appears as "dirty" in Rooms page
8. Housekeeping can see it needs cleaning
```

### Scenario 2: Cancel Booking
```
1. Edit booking
2. Change status to "Cancelled"
3. Save
   ↓
4. Backend updates booking status
5. Backend checks for other active bookings
6. If none, sets room status to "available"
7. Frontend refreshes rooms list
   ↓
8. Room appears as "available" in Rooms page
9. Room can be booked again
```

### Scenario 3: Delete Booking
```
1. Delete booking
2. Confirm deletion
   ↓
3. Backend deletes booking
4. Backend checks for other active bookings
5. If none, sets room status to "available"
6. Frontend refreshes rooms list
   ↓
7. Room appears as "available" in Rooms page
```

## Backend Logic (Already Implemented)

The backend already had the correct logic in `server/src/routes/bookingRoutes.ts`:

### Check Out Logic
```typescript
if (status === 'checked_out') {
  await client.query(
    'UPDATE rooms SET status = $1 WHERE id = $2',
    ['dirty', roomId]
  );
  console.log(`✅ Room ${roomId} set to dirty after checkout`);
}
```

### Cancellation Logic
```typescript
if (status === 'cancelled') {
  const activeBookings = await client.query(
    `SELECT id FROM bookings 
     WHERE room_id = $1 
     AND status NOT IN ('cancelled', 'checked_out')
     AND check_out_date >= CURRENT_DATE`,
    [roomId]
  );

  // If no active bookings, mark room as available
  if (activeBookings.rows.length === 0) {
    await client.query(
      'UPDATE rooms SET status = $1 WHERE id = $2',
      ['available', roomId]
    );
  }
}
```

### Auto-Checkout (Scheduled Job)
The system also has an auto-checkout job that runs every hour:
```typescript
// Find bookings that should be checked out
const result = await pool.query(`
  SELECT b.id, b.room_id, r.room_number
  FROM bookings b
  WHERE b.status = 'checked_in' 
  AND b.check_out_date <= CURRENT_DATE
`);

// Update booking to checked_out and room to dirty
await pool.query('UPDATE bookings SET status = $1 WHERE id = $2', ['checked_out', booking.id]);
await pool.query('UPDATE rooms SET status = $1 WHERE id = $2', ['dirty', booking.room_id]);
```

## Testing

### Test 1: Manual Check Out
1. Go to Bookings page
2. Find a booking with status "Checked In"
3. Click Edit
4. Change status to "Checked Out"
5. Save
6. Go to Rooms page
7. **Expected**: Room shows status "Dirty" (red badge)

### Test 2: Cancel Booking
1. Go to Bookings page
2. Find a booking with status "Confirmed"
3. Click Edit
4. Change status to "Cancelled"
5. Save
6. Go to Rooms page
7. **Expected**: Room shows status "Available" (green badge)

### Test 3: Delete Booking
1. Go to Bookings page
2. Find any booking
3. Click Delete
4. Confirm deletion
5. Go to Rooms page
6. **Expected**: Room shows status "Available" (green badge)

### Test 4: Auto-Checkout
1. Create a booking with checkout date = today
2. Set status to "Checked In"
3. Wait for the hourly job to run (or restart server to trigger)
4. Go to Rooms page
5. **Expected**: Room shows status "Dirty"

## Room Status Flow

```
Available → Occupied → Dirty → Cleaning → Clean → Available
    ↑          ↓         ↑         ↓         ↓         ↑
    |      Booking    Checkout  Housekeeping  |        |
    |      Created              Starts        |        |
    |                                    Cleaning      |
    |                                    Complete      |
    └──────────────────────────────────────────────────┘
```

## Status Meanings

- **Available**: Room is ready for new bookings
- **Occupied**: Guest is currently staying in the room
- **Dirty**: Guest checked out, room needs cleaning
- **Cleaning**: Housekeeping is currently cleaning
- **Clean**: Room is cleaned and ready
- **Maintenance**: Room needs maintenance work

## Files Modified

- `client/src/pages/Bookings.tsx` - Added status endpoint call and rooms refresh

## Files Already Correct

- `server/src/routes/bookingRoutes.ts` - Status update logic
- `server/src/services/scheduledJobs.ts` - Auto-checkout logic
- `server/src/routes/roomRoutes.ts` - Room update logic

## Benefits

1. ✅ Rooms automatically update when bookings change
2. ✅ Housekeeping sees dirty rooms immediately
3. ✅ Cancelled rooms become available instantly
4. ✅ No manual room status updates needed
5. ✅ Consistent room status across the system

## Next Steps

1. Test the workflow with the scenarios above
2. Verify rooms update in real-time
3. Check that housekeeping page shows dirty rooms
4. Confirm cancelled bookings free up rooms

---

**Status**: Fixed and ready to test!
