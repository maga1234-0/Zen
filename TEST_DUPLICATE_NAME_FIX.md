# Testing the Duplicate Guest Name Fix

## Quick Test Steps

### 1. Test Single Name Booking

**Steps:**
1. Go to Bookings page
2. Click "New Booking"
3. Enter guest name: `John` (just first name, leave last name empty)
4. Select a room, dates, and other details
5. Click "Create Booking"

**Expected Result:**
- Guest name should display as "John" (not "John John")
- Check in these locations:
  - Bookings table
  - Dashboard > Recent Activities
  - Front Desk > Today's Check-ins (if applicable)
  - Notifications

### 2. Test Full Name Booking

**Steps:**
1. Create a booking with guest name: `John Doe`
2. Complete the booking

**Expected Result:**
- Guest name should display as "John Doe"

### 3. Test Existing Single-Name Guest

**Steps:**
1. If you have an existing guest with duplicate name (e.g., "John John")
2. Create a new booking for them
3. The booking should show their name correctly

**Note:** Existing guests in the database with `first_name = last_name` will now display correctly as a single name.

## SQL Test Query

You can test the SQL logic directly in Supabase SQL Editor:

```sql
-- Test the CASE statement logic
SELECT 
  first_name,
  last_name,
  CASE 
    WHEN last_name = '' OR last_name IS NULL OR last_name = first_name 
    THEN first_name 
    ELSE first_name || ' ' || last_name 
  END as display_name
FROM guests
ORDER BY created_at DESC
LIMIT 10;
```

**Expected Results:**
- Guests with `first_name = last_name` → Display as single name
- Guests with different names → Display as "FirstName LastName"

## Backend Test

If you want to test the helper function:

```typescript
// Test cases for constructGuestName()
constructGuestName('John', 'John')     // Returns: 'John'
constructGuestName('John', '')         // Returns: 'John'
constructGuestName('John', 'Doe')      // Returns: 'John Doe'
constructGuestName('Jane', 'Smith')    // Returns: 'Jane Smith'
```

## Verification Checklist

- [ ] Single name bookings display correctly in Bookings list
- [ ] Single name bookings display correctly in Dashboard
- [ ] Single name bookings display correctly in Front Desk
- [ ] Notifications show single names correctly
- [ ] Full name bookings still work correctly
- [ ] No TypeScript errors in modified files
- [ ] Backend builds successfully
- [ ] Frontend builds successfully

## Rollback Plan

If issues occur, the changes can be reverted by:
1. Reverting `server/src/routes/bookingRoutes.ts`
2. Reverting `server/src/controllers/dashboardController.ts`

The frontend requires no changes as it's backward compatible.
