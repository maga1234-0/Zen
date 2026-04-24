# Complete Supabase Database Setup

## Your Supabase Project
**URL**: https://sikmnuxzpozgljbndapt.supabase.co

## Step 1: Access SQL Editor

1. Go to: https://app.supabase.com
2. Select your project: `hotel-pms`
3. Click "SQL Editor" in the left sidebar

## Step 2: Run SQL Scripts (In Order!)

### Script 1: Create Schema
1. Click "New query"
2. Copy content from `database/schema.sql`
3. Paste into SQL Editor
4. Click "Run" (or press Ctrl+Enter)
5. Wait for "Success" message

### Script 2: Add Seed Data
1. Click "New query"
2. Copy content from `database/seed.sql`
3. Paste and Run
4. Wait for "Success"

### Script 3: Update Guests Table
1. Click "New query"
2. Copy content from `database/update-guests-phone-optional.sql`
3. Paste and Run

### Script 4: Fix Room Status
1. Click "New query"
2. Copy content from `database/fix-room-status-constraint.sql`
3. Paste and Run

### Script 5: Add Maintenance Fields
1. Click "New query"
2. Copy content from `database/add-maintenance-fields.sql`
3. Paste and Run

### Script 6: Update Notifications
1. Click "New query"
2. Copy content from `database/update-notifications-table.sql`
3. Paste and Run

## Step 3: Verify Database

### Check Tables
1. Click "Table Editor" in left sidebar
2. You should see these tables:
   - users
   - hotels
   - room_types
   - rooms
   - guests
   - bookings
   - payments
   - invoices
   - notifications
   - audit_logs
   - user_settings

### Check Data
1. Click on "users" table
2. You should see 3 users:
   - admin@hotel.com
   - manager@hotel.com
   - receptionist@hotel.com

## Step 4: Test Connection

### Get Connection String
Your connection string is:
```
postgresql://postgres:QRHxAWQ3YOBeYmCW@db.sikmnuxzpozgljbndapt.supabase.co:5432/postgres
```

### Test in Supabase
1. Go to Settings → Database
2. Scroll to "Connection string"
3. Verify it matches above

## Troubleshooting

### Error: "relation already exists"
**Solution**: Table already created, skip to next script

### Error: "permission denied"
**Solution**: Make sure you're using the SQL Editor, not the API

### Error: "syntax error"
**Solution**: Make sure you copied the entire script

## Database Ready! ✅

Your database is now set up with:
- ✅ All tables created
- ✅ Sample data loaded
- ✅ Users created (admin, manager, receptionist)
- ✅ Room types and rooms
- ✅ All migrations applied

## Next Step: Deploy to Vercel

Now that your database is ready, proceed to Vercel deployment:

1. Go to: https://vercel.com
2. Sign in with GitHub
3. Import `zenith1` repository
4. Add environment variables (see VERCEL_ENV_VARIABLES.md)
5. Deploy!

---

## Quick Reference

### Database URL
```
postgresql://postgres:QRHxAWQ3YOBeYmCW@db.sikmnuxzpozgljbndapt.supabase.co:5432/postgres
```

### Supabase Dashboard
https://app.supabase.com

### SQL Scripts Order
1. schema.sql
2. seed.sql
3. update-guests-phone-optional.sql
4. fix-room-status-constraint.sql
5. add-maintenance-fields.sql
6. update-notifications-table.sql

---

**Database setup complete! Ready for Vercel deployment!** 🚀
