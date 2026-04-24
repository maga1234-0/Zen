# Quick Fix: Room Not Changing to Dirty After Checkout

## Problem
Guest checked out but room status didn't change to "dirty" automatically.

## Root Cause
Database constraint doesn't allow "dirty" as a valid room status.

## Quick Fix (2 minutes)

### Step 1: Open pgAdmin
- Connect to `hotel_pms` database
- Open Query Tool

### Step 2: Run This SQL
```sql
ALTER TABLE rooms DROP CONSTRAINT IF EXISTS rooms_status_check;

ALTER TABLE rooms ADD CONSTRAINT rooms_status_check 
CHECK (status IN ('available', 'occupied', 'maintenance', 'cleaning', 'dirty'));
```

### Step 3: Click Execute (F5)

### Step 4: Test
```bash
node server/test-checkout-endpoint.js
```

You should see: `✅ SUCCESS! Checkout logic works correctly.`

## Done! 🎉

Now when guests check out, rooms will automatically change to "dirty" status.

---

**Full details:** See `FIX_ROOM_DIRTY_STATUS.md`
