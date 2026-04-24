# Testing Checklist - Guest Duplicate Fix

## 📋 Pre-Testing Setup

### ✅ Step 1: Database Migrations
- [ ] Open pgAdmin
- [ ] Connect to `hotel_pms` database
- [ ] Open Query Tool
- [ ] Run `database/update-guests-phone-optional.sql`
- [ ] Verify output shows "ALTER TABLE" success
- [ ] Run `database/update-notifications-table.sql`
- [ ] Verify output shows "ALTER TABLE" success

### ✅ Step 2: Server Restart
- [ ] Stop server (Ctrl+C)
- [ ] Navigate to server folder: `cd server`
- [ ] Start server: `npm run dev`
- [ ] Verify server starts on port 5000
- [ ] Check for any error messages

### ✅ Step 3: Frontend Check
- [ ] Frontend should still be running on port 5174
- [ ] If not, start it: `cd client && npm run dev`
- [ ] Open browser: `http://localhost:5174`
- [ ] Login with admin credentials

## 🧪 Test Scenarios

### Test 1: Create New Guest via Booking
**Objective**: Verify minimal guest creation works

- [ ] Go to Bookings page
- [ ] Click "New Booking" button
- [ ] Enter guest name: "Test User One"
- [ ] Select available room
- [ ] Select check-in date (today or future)
- [ ] Select check-out date (after check-in)
- [ ] Enter number of guests: 1
- [ ] Click "Create Booking"
- [ ] **Expected**: Toast message "New guest created. Complete their details in the Guests page."
- [ ] **Expected**: Booking appears in list

### Test 2: Verify Guest Created
**Objective**: Confirm guest exists with incomplete profile

- [ ] Go to Guests page
- [ ] Search for "Test User One"
- [ ] **Expected**: Guest card appears
- [ ] **Expected**: Yellow badge "Incomplete Profile"
- [ ] **Expected**: "Email not provided" (grayed out)
- [ ] **Expected**: "Phone not provided" (grayed out)
- [ ] Click on guest card
- [ ] **Expected**: Details modal opens
- [ ] **Expected**: Email shows "N/A"
- [ ] **Expected**: Phone shows "N/A"

### Test 3: Reuse Existing Guest (Exact Match)
**Objective**: Verify duplicate prevention with exact name

- [ ] Go to Bookings page
- [ ] Click "New Booking"
- [ ] Enter guest name: "Test User One" (exact same)
- [ ] **Expected**: Autocomplete suggestion appears
- [ ] Select room and dates
- [ ] Click "Create Booking"
- [ ] **Expected**: Toast message "Using existing guest: Test User One"
- [ ] Go to Guests page
- [ ] Search for "Test User One"
- [ ] **Expected**: Still only ONE guest with this name

### Test 4: Reuse Existing Guest (Case Variation)
**Objective**: Verify case-insensitive matching

- [ ] Go to Bookings page
- [ ] Click "New Booking"
- [ ] Enter guest name: "test user one" (lowercase)
- [ ] Select room and dates
- [ ] Click "Create Booking"
- [ ] **Expected**: Toast message "Using existing guest: Test User One"
- [ ] Go to Guests page
- [ ] **Expected**: Still only ONE guest (no duplicate)

### Test 5: Reuse Existing Guest (Whitespace)
**Objective**: Verify whitespace handling

- [ ] Go to Bookings page
- [ ] Click "New Booking"
- [ ] Enter guest name: "  Test  User  One  " (extra spaces)
- [ ] Select room and dates
- [ ] Click "Create Booking"
- [ ] **Expected**: Toast message "Using existing guest: Test User One"
- [ ] Go to Guests page
- [ ] **Expected**: Still only ONE guest (no duplicate)

### Test 6: Complete Guest Information
**Objective**: Verify guest profile can be completed

- [ ] Go to Guests page
- [ ] Find "Test User One"
- [ ] Click on guest card
- [ ] Click "Edit Guest" button
- [ ] Add email: "testuser@email.com"
- [ ] Add phone: "+1234567890"
- [ ] Add address: "123 Test St"
- [ ] Add city: "Test City"
- [ ] Add country: "Test Country"
- [ ] Click "Save Changes"
- [ ] **Expected**: Toast message "Guest updated successfully!"
- [ ] **Expected**: "Incomplete Profile" badge disappears
- [ ] **Expected**: Email and phone now display properly

### Test 7: Create Different Guest
**Objective**: Verify new guests are still created when names differ

- [ ] Go to Bookings page
- [ ] Click "New Booking"
- [ ] Enter guest name: "Jane Smith"
- [ ] Select room and dates
- [ ] Click "Create Booking"
- [ ] **Expected**: Toast message "New guest created..."
- [ ] Go to Guests page
- [ ] **Expected**: TWO guests total ("Test User One" and "Jane Smith")

### Test 8: Autocomplete Suggestions
**Objective**: Verify autocomplete helps prevent duplicates

- [ ] Go to Bookings page
- [ ] Click "New Booking"
- [ ] Start typing: "Test"
- [ ] **Expected**: Dropdown shows "Test User One"
- [ ] Start typing: "Jane"
- [ ] **Expected**: Dropdown shows "Jane Smith"
- [ ] Select from dropdown
- [ ] **Expected**: Name fills in automatically

### Test 9: Browser Console Check
**Objective**: Verify logging is working

- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Create a booking with existing guest
- [ ] **Expected**: Log message "✅ Using existing guest: [name]"
- [ ] Create a booking with new guest
- [ ] **Expected**: Log message "✅ Created minimal guest record: [data]"

### Test 10: Server Logs Check
**Objective**: Verify server-side duplicate prevention

- [ ] Check server terminal
- [ ] Create booking with existing guest
- [ ] **Expected**: Log "⚠️ Guest already exists: [data]"
- [ ] Create booking with new guest
- [ ] **Expected**: Log "✅ Guest created: [data]"

## 🔍 Edge Cases to Test

### Edge Case 1: Single Name
- [ ] Create booking with name: "Madonna"
- [ ] **Expected**: Creates guest with first_name="Madonna", last_name="Madonna"
- [ ] Try to create another booking: "madonna"
- [ ] **Expected**: Reuses existing guest

### Edge Case 2: Multiple Spaces
- [ ] Create booking with name: "John    Doe" (multiple spaces)
- [ ] **Expected**: Normalizes to "John Doe"
- [ ] Try: "John Doe" (single space)
- [ ] **Expected**: Reuses existing guest

### Edge Case 3: Three-Part Name
- [ ] Create booking with name: "John Paul Smith"
- [ ] **Expected**: first_name="John", last_name="Paul Smith"
- [ ] Try: "john paul smith"
- [ ] **Expected**: Reuses existing guest

## 📊 Results Summary

### Pass Criteria
- ✅ No duplicate guests created for same name
- ✅ Case-insensitive matching works
- ✅ Whitespace handling works
- ✅ Incomplete profile badges appear
- ✅ Guest information can be completed
- ✅ Autocomplete suggestions work
- ✅ Toast messages appear correctly
- ✅ Server logs show correct behavior

### If Tests Fail

#### Issue: Can't create guest without phone
**Solution**: 
1. Verify migration was run: `update-guests-phone-optional.sql`
2. Check database: `SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'phone';`
3. Should show `is_nullable = YES`

#### Issue: Still seeing duplicates
**Solution**:
1. Check browser console for error messages
2. Check server logs for error messages
3. Verify names are spelled exactly the same
4. Clear test data: `DELETE FROM guests WHERE first_name LIKE 'Test%';`
5. Try again

#### Issue: Autocomplete not working
**Solution**:
1. Check if guests are loading: Network tab → `/api/guests`
2. Verify datalist element in HTML
3. Try typing slowly

#### Issue: Notifications not working
**Solution**:
1. Run migration: `update-notifications-table.sql`
2. Restart server
3. Check server logs for notification creation

## 📝 Test Results Log

Date: _______________
Tester: _______________

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Create New Guest | ⬜ Pass / ⬜ Fail | |
| 2 | Verify Guest Created | ⬜ Pass / ⬜ Fail | |
| 3 | Reuse Exact Match | ⬜ Pass / ⬜ Fail | |
| 4 | Reuse Case Variation | ⬜ Pass / ⬜ Fail | |
| 5 | Reuse Whitespace | ⬜ Pass / ⬜ Fail | |
| 6 | Complete Info | ⬜ Pass / ⬜ Fail | |
| 7 | Create Different Guest | ⬜ Pass / ⬜ Fail | |
| 8 | Autocomplete | ⬜ Pass / ⬜ Fail | |
| 9 | Browser Console | ⬜ Pass / ⬜ Fail | |
| 10 | Server Logs | ⬜ Pass / ⬜ Fail | |

Overall Result: ⬜ All Pass / ⬜ Some Fail

## 🎉 Success Criteria

All tests should pass with:
- ✅ No duplicate guests
- ✅ Clear user feedback
- ✅ Smooth workflow
- ✅ No errors in console
- ✅ Proper logging

If all tests pass, the system is working correctly! 🚀
