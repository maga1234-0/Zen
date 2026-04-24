# Payment List - Exclude Cancelled Bookings

## Problem
Cancelled bookings were appearing in the payment list, allowing users to create payments for bookings that were cancelled.

## Solution
Updated the unpaid bookings query to exclude bookings with status 'cancelled'.

## Changes Made

### Backend Query Update
**File**: `server/src/routes/bookingRoutes.ts`

**Before:**
```sql
SELECT b.*, 
  g.first_name || ' ' || g.last_name as guest_name,
  r.room_number
FROM bookings b
LEFT JOIN payments p ON b.id = p.booking_id AND p.payment_status = 'completed'
WHERE p.id IS NULL
```

**After:**
```sql
SELECT b.*, 
  g.first_name || ' ' || g.last_name as guest_name,
  r.room_number
FROM bookings b
LEFT JOIN payments p ON b.id = p.booking_id AND p.payment_status = 'completed'
WHERE p.id IS NULL
AND b.status NOT IN ('cancelled')
```

## How It Works Now

### Bookings That Appear in Payment List
- ✅ Status: 'pending'
- ✅ Status: 'confirmed'
- ✅ Status: 'checked_in'
- ✅ Status: 'checked_out'
- ✅ No completed payment exists

### Bookings That DON'T Appear in Payment List
- ❌ Status: 'cancelled'
- ❌ Already has completed payment

## Testing

### Test 1: Cancelled Booking
1. Go to Bookings page
2. Create a new booking
3. Change status to "Cancelled"
4. Go to Payments page
5. Click "Record Payment"
6. **Expected**: Cancelled booking does NOT appear in the list

### Test 2: Active Booking
1. Go to Bookings page
2. Create a new booking
3. Set status to "Confirmed"
4. Go to Payments page
5. Click "Record Payment"
6. **Expected**: Booking DOES appear in the list

### Test 3: After Cancellation
1. Go to Payments page
2. Note which bookings appear
3. Go to Bookings page
4. Cancel one of the bookings
5. Go back to Payments page
6. Click "Record Payment"
7. **Expected**: Cancelled booking disappears from list

## Benefits

1. ✅ Prevents payments for cancelled bookings
2. ✅ Cleaner payment list
3. ✅ Reduces errors
4. ✅ Better data integrity
5. ✅ Matches business logic

## Workflow

```
Booking Created → Status: confirmed
    ↓
Appears in Payment List ✅
    ↓
Booking Cancelled → Status: cancelled
    ↓
Disappears from Payment List ✅
```

## Related Logic

This change complements other booking status logic:
- Cancelled bookings free up rooms (set to 'available')
- Cancelled bookings don't appear in Front Desk
- Cancelled bookings don't count in revenue
- Cancelled bookings can't receive payments

---

**Status**: Fixed! Restart the server to apply changes.
