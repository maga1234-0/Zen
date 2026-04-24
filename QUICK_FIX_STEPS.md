# Quick Fix Steps - Guest Duplicate Issue

## 🚀 Quick Start (3 Steps)

### Step 1: Run Database Migrations
Open pgAdmin and execute these two SQL files:

```sql
-- 1. Make phone optional (REQUIRED)
-- File: database/update-guests-phone-optional.sql
ALTER TABLE guests ALTER COLUMN phone DROP NOT NULL;

-- 2. Update notifications (if not done already)
-- File: database/update-notifications-table.sql
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS priority VARCHAR(20);
```

### Step 2: Restart Server
```bash
cd server
npm run dev
```

### Step 3: Test It
1. Go to Bookings → New Booking
2. Enter guest name: "Test User"
3. Complete booking
4. Create another booking with same name
5. Verify only ONE guest exists in Guests page

## ✅ What's Fixed

- ✅ No more duplicate guests
- ✅ Case-insensitive name matching
- ✅ Whitespace handling
- ✅ Phone field now optional
- ✅ Visual "Incomplete Profile" badges
- ✅ Better user feedback messages

## 📋 Workflow

```
Create Booking → Enter Name → System Checks → Reuse or Create
                                              ↓
                                    Go to Guests Page
                                              ↓
                                    Complete Details Later
```

## 🔍 How to Verify

### Check 1: No Duplicates
```
1. Create booking: "John Doe"
2. Create booking: "john doe"
3. Guests page should show only ONE guest
```

### Check 2: Incomplete Profiles
```
1. Create booking with just name
2. Go to Guests page
3. Should see "Incomplete Profile" badge
4. Click Edit → Add phone/email
```

### Check 3: Autocomplete
```
1. Start typing existing guest name
2. Should see suggestions dropdown
3. Select from list to reuse guest
```

## 📁 Files Changed

- `client/src/pages/Bookings.tsx` - Better name parsing
- `client/src/pages/Guests.tsx` - Visual improvements
- `server/src/routes/guestRoutes.ts` - Duplicate prevention
- `database/update-guests-phone-optional.sql` - Schema fix

## 🆘 Troubleshooting

**Problem**: Can't create guest without phone
**Fix**: Run `update-guests-phone-optional.sql` migration

**Problem**: Still seeing duplicates
**Fix**: Check names are spelled exactly the same

**Problem**: Notifications not working
**Fix**: Run `update-notifications-table.sql` migration

## 📚 Full Documentation

- `GUEST_DUPLICATE_FIX.md` - Complete technical details
- `GUEST_WORKFLOW_GUIDE.md` - User workflow guide
- `database/update-guests-phone-optional.sql` - Migration file
