# Run This in pgAdmin to Fix Room Status Issue

## The Problem
You tried to run `node server/test-checkout-endpoint.js` in pgAdmin, but that's a Node.js script, not SQL.

## What to Do Instead

### Option 1: Fix the Constraint (Recommended)

1. **Open pgAdmin**
2. **Connect to `hotel_pms` database**
3. **Open Query Tool** (Tools → Query Tool)
4. **Copy and paste this SQL:**

```sql
-- Drop the old constraint
ALTER TABLE rooms DROP CONSTRAINT IF EXISTS rooms_status_check;

-- Add the new constraint with 'dirty' included
ALTER TABLE rooms ADD CONSTRAINT rooms_status_check 
CHECK (status IN ('available', 'occupied', 'maintenance', 'cleaning', 'dirty'));
```

5. **Click Execute** (F5 or the Play button)
6. **Done!** ✅

### Option 2: Use the SQL File

1. Open pgAdmin
2. Connect to `hotel_pms` database
3. Open Query Tool
4. Click **Open File** icon
5. Navigate to: `database/PGADMIN_FIX_STEPS.sql`
6. Click Execute (F5)

### Option 3: Run Node.js Test from Terminal

If you want to run the Node.js test script:

1. **Open Command Prompt or PowerShell** (not pgAdmin)
2. **Navigate to your project:**
   ```bash
   cd C:\Users\aubin\Downloads\kiro1
   ```
3. **Run the test:**
   ```bash
   node server/test-checkout-endpoint.js
   ```

But you need to fix the constraint first (Option 1 or 2) before the test will pass.

## After Fixing

Once you've run the SQL fix in pgAdmin, test in your application:

1. Go to Bookings page
2. Edit a booking with status "Checked In"
3. Change status to "Checked Out"
4. Go to Rooms page
5. The room should now show "Dirty" status ✅

## Quick Reference

- **pgAdmin** = For running SQL commands
- **Terminal/Command Prompt** = For running Node.js scripts
- **Fix file** = `database/PGADMIN_FIX_STEPS.sql`
- **Test file** = `server/test-checkout-endpoint.js` (run in terminal, not pgAdmin)
