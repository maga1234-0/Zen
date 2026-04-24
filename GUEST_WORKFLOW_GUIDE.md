# Guest Workflow Guide

## Overview
The guest management system now supports a streamlined "quick booking" workflow where you can create bookings with minimal guest information and complete the details later.

## How It Works

### 1. Create Booking with Guest Name
When creating a new booking:
- Enter the guest's full name in the "Guest Name" field (e.g., "John Doe")
- The system will:
  - Check if a guest with that exact name already exists (case-insensitive)
  - If found: Reuse the existing guest record
  - If not found: Create a minimal guest record with just the name

### 2. Complete Guest Details Later
After creating the booking:
- Go to the Guests page
- Find the guest (they'll have an "Incomplete Profile" badge if missing email/phone)
- Click on the guest card to view details
- Click "Edit Guest" to add:
  - Email address
  - Phone number
  - ID Type and Number
  - Address, City, Country

## Key Features

### Duplicate Prevention
- The system uses case-insensitive name matching to prevent duplicates
- Whitespace is automatically trimmed
- If you enter "John Doe" and a guest "john doe" already exists, it will reuse the existing record

### Autocomplete Suggestions
- When typing a guest name in the booking form, you'll see suggestions from existing guests
- This helps you quickly select existing guests and avoid duplicates

### Visual Indicators
- Guests with incomplete information show an "Incomplete Profile" badge
- Missing email/phone fields are clearly marked with "not provided" text

## Testing the Workflow

### Test 1: Create New Guest via Booking
1. Go to Bookings page
2. Click "New Booking"
3. Enter guest name: "Test User"
4. Select room, dates, etc.
5. Submit booking
6. You should see: "New guest created. Complete their details in the Guests page."

### Test 2: Verify Guest Created
1. Go to Guests page
2. Search for "Test User"
3. You should see the guest with "Incomplete Profile" badge
4. Click on the guest card
5. Click "Edit Guest"
6. Add phone number and email
7. Save changes

### Test 3: Reuse Existing Guest
1. Go to Bookings page
2. Click "New Booking"
3. Enter the same guest name: "Test User"
4. The system should show: "Using existing guest: Test User"
5. Complete the booking
6. Verify no duplicate guest was created in Guests page

### Test 4: Case Insensitive Matching
1. Create booking with "john smith"
2. Create another booking with "John Smith"
3. Verify only ONE guest "john smith" exists in Guests page

## Database Migrations Required

Before testing, ensure you've run these migrations in pgAdmin:

### 1. Make Phone Field Optional
```sql
-- File: database/update-guests-phone-optional.sql
-- This allows creating guests without phone numbers
```

Run this first to allow minimal guest records.

### 2. Update Notifications Table
```sql
-- File: database/update-notifications-table.sql
-- This adds priority column and new notification types
```

Run this to enable the notification system.

### How to Run Migrations
1. Open pgAdmin
2. Connect to your `hotel_pms` database
3. Open Query Tool
4. Copy and paste the SQL from each file
5. Execute the queries
6. Verify the changes in the output

## Troubleshooting

### Issue: Duplicates Still Appearing
- Check the browser console for logs showing "Using existing guest" vs "Created minimal guest"
- Verify the names are exactly the same (case doesn't matter, but spelling does)
- Clear any test data and try again

### Issue: Can't Save Guest Without Phone
- Phone is now optional in both Add and Edit forms
- You can save a guest with just first name and last name

### Issue: Notifications Not Working
- Run the database migration: `database/update-notifications-table.sql`
- Restart the server
- Check server logs for notification creation messages

## Benefits of This Workflow

1. **Speed**: Quickly create bookings without entering full guest details
2. **Flexibility**: Complete guest information when you have time
3. **No Duplicates**: Automatic detection prevents duplicate guest records
4. **Clear Status**: Visual indicators show which guests need more information
5. **Efficient**: Reuses existing guest records automatically
