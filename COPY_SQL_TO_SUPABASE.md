# Copy SQL Scripts to Supabase - Easy Method

## Your SQL Files Location
`C:\Users\aubin\Downloads\kiro1\database\`

## Method: Copy & Paste from Your Computer

### Step 1: Open Supabase SQL Editor
1. Go to: https://app.supabase.com
2. Select your project
3. Click "SQL Editor" in left sidebar

### Step 2: Run Each Script

#### Script 1: schema.sql
1. On your computer, open: `C:\Users\aubin\Downloads\kiro1\database\schema.sql`
2. Select all (Ctrl+A) and copy (Ctrl+C)
3. In Supabase SQL Editor, click "New query"
4. Paste (Ctrl+V)
5. Click "Run" or press Ctrl+Enter
6. Wait for "Success" message

#### Script 2: seed.sql
1. Open: `C:\Users\aubin\Downloads\kiro1\database\seed.sql`
2. Copy all content
3. New query in Supabase
4. Paste and Run

#### Script 3: update-guests-phone-optional.sql
1. Open: `C:\Users\aubin\Downloads\kiro1\database\update-guests-phone-optional.sql`
2. Copy all content
3. New query in Supabase
4. Paste and Run

#### Script 4: fix-room-status-constraint.sql
1. Open: `C:\Users\aubin\Downloads\kiro1\database\fix-room-status-constraint.sql`
2. Copy all content
3. New query in Supabase
4. Paste and Run

#### Script 5: add-maintenance-fields.sql
1. Open: `C:\Users\aubin\Downloads\kiro1\database\add-maintenance-fields.sql`
2. Copy all content
3. New query in Supabase
4. Paste and Run

#### Script 6: update-notifications-table.sql
1. Open: `C:\Users\aubin\Downloads\kiro1\database\update-notifications-table.sql`
2. Copy all content
3. New query in Supabase
4. Paste and Run

## Quick Checklist

- [ ] schema.sql - Creates all tables
- [ ] seed.sql - Adds sample data
- [ ] update-guests-phone-optional.sql - Makes phone optional
- [ ] fix-room-status-constraint.sql - Fixes room statuses
- [ ] add-maintenance-fields.sql - Adds maintenance tracking
- [ ] update-notifications-table.sql - Updates notifications

## Verify Success

After running all scripts:

1. Click "Table Editor" in Supabase
2. You should see these tables:
   - users (with 3 users)
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

## Troubleshooting

### "relation already exists"
**Solution**: Table already created, this is OK. Continue to next script.

### "syntax error"
**Solution**: Make sure you copied the entire file content.

### "permission denied"
**Solution**: Make sure you're in SQL Editor, not API section.

## After All Scripts Run Successfully

✅ Database is ready!
✅ Proceed to Vercel deployment

**Next**: Read `DEPLOY_NOW_CHECKLIST.md` for Vercel deployment steps.

---

## Alternative: Use Kiro to Read Files

Since the files are open in Kiro, I can help you see the content. Just ask me to show you any specific SQL file content and I'll display it for you to copy!

---

**Start with schema.sql - it's the most important one!** 🚀
