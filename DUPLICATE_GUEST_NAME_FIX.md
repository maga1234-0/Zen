# Duplicate Guest Name Fix

## Problem
When creating a booking with a single name (e.g., "John"), the guest name was displayed as "John John" throughout the system.

## Root Cause
1. **Database Constraint**: The `guests` table has `last_name VARCHAR(100) NOT NULL`, requiring a value
2. **Frontend Logic**: When no last name was provided, the frontend used `firstName` as `lastName` to satisfy the database constraint
3. **Backend Display**: SQL queries concatenated `first_name || ' ' || last_name` without checking for duplicates

## Solution

### Backend Changes (Fixed)

#### 1. Updated SQL Queries in `bookingRoutes.ts`
Added conditional logic to avoid displaying duplicate names:

```sql
CASE 
  WHEN g.last_name = '' OR g.last_name IS NULL OR g.last_name = g.first_name 
  THEN g.first_name 
  ELSE g.first_name || ' ' || g.last_name 
END as guest_name
```

Applied to:
- `GET /` - All bookings
- `GET /today/checkins` - Today's check-ins
- `GET /today/checkouts` - Today's check-outs
- `GET /unpaid` - Unpaid bookings

#### 2. Updated `dashboardController.ts`
Applied same logic to recent activities query

#### 3. Added Helper Function in `bookingRoutes.ts`
```typescript
const constructGuestName = (firstName: string, lastName: string): string => {
  if (!lastName || lastName.trim() === '' || lastName === firstName) {
    return firstName;
  }
  return `${firstName} ${lastName}`;
};
```

Used in all notification calls:
- `notifyNewBooking()`
- `notifyCheckIn()`
- `notifyCheckOut()`
- `notifyBookingCancelled()`

### Frontend Changes (No Change Needed)
The frontend continues to use `firstName` as `lastName` when no last name is provided, as required by the database constraint. The backend now handles the display logic correctly.

## Testing

### Test Case 1: Single Name Booking
1. Create a booking with guest name "John" (no last name)
2. **Expected**: Guest name displays as "John" (not "John John")
3. **Verify in**:
   - Bookings list
   - Dashboard recent activities
   - Today's check-ins/check-outs
   - Notifications

### Test Case 2: Full Name Booking
1. Create a booking with guest name "John Doe"
2. **Expected**: Guest name displays as "John Doe"
3. **Verify in**: Same locations as Test Case 1

### Test Case 3: Existing Guest
1. Use an existing guest with single name
2. **Expected**: Name displays correctly without duplication

## Files Modified
- `server/src/routes/bookingRoutes.ts` - SQL queries and helper function
- `server/src/controllers/dashboardController.ts` - Recent activities query
- `client/src/pages/Bookings.tsx` - Comment clarification (no logic change)

## Database Schema Note
The `guests.last_name` column remains `NOT NULL` to maintain backward compatibility. The fix is purely in the display logic, not the data storage.

## Deployment
No database migration required. Changes are backward compatible with existing data.
