# Notification Distribution Guide

## Overview
All registered staff receive relevant notifications based on their role. The system ensures that the right people are notified about the right events.

## Staff Roles in the System

1. **Admin** - Full system access, receives all notifications
2. **Manager** - Management oversight, receives most notifications
3. **Receptionist** - Front desk operations, receives booking-related notifications
4. **Housekeeping** - Room cleaning, receives room status notifications
5. **Maintenance** - Room repairs, receives maintenance notifications
6. **Accountant** - Financial operations, receives payment notifications

## Notification Distribution by Event

### 📅 Booking Events

#### New Booking Created
- **Who receives**: Admin, Manager, Receptionist
- **Priority**: Medium
- **Message**: "New booking for {Guest Name} in Room {Room Number}. Check-in: {Date}"
- **Why**: Front desk staff need to prepare for guest arrival

#### Guest Checked In ✅ UPDATED
- **Who receives**: Admin, Manager, Receptionist, Housekeeping
- **Priority**: Medium
- **Message**: "{Guest Name} has checked into Room {Room Number}"
- **Why**: 
  - Front desk confirms check-in
  - Housekeeping knows room is occupied (don't disturb)
  - Management tracks occupancy

#### Guest Checked Out
- **Who receives**: Admin, Manager, Receptionist, Housekeeping
- **Priority**: High
- **Message**: "{Guest Name} has checked out of Room {Room Number}. Room needs cleaning."
- **Why**: 
  - Housekeeping needs to clean the room immediately
  - Front desk can prepare for next guest
  - Management tracks turnover

#### Booking Cancelled
- **Who receives**: Admin, Manager, Receptionist
- **Priority**: Medium
- **Message**: "Booking cancelled for {Guest Name} in Room {Room Number}"
- **Why**: Front desk can reassign the room

### 🏠 Room Events

#### Room Status Changed
- **Who receives**: 
  - If status = "dirty": Admin, Manager, Housekeeping
  - Otherwise: Admin, Manager, Receptionist
- **Priority**: High (if dirty), Medium (otherwise)
- **Message**: "Room {Room Number} status changed from {Old Status} to {New Status}"
- **Why**: Relevant staff need to know room availability

#### Room Cleaned
- **Who receives**: Admin, Manager, Receptionist
- **Priority**: Low
- **Message**: "Room {Room Number} has been cleaned and is ready for guests"
- **Why**: Front desk can assign the room to new guests

#### Room Needs Maintenance
- **Who receives**: Admin, Manager, Maintenance
- **Priority**: High
- **Message**: "Room {Room Number} has been marked for maintenance"
- **Why**: Maintenance staff need to fix the issue

#### High Number of Dirty Rooms Alert
- **Who receives**: Admin, Manager, Housekeeping
- **Priority**: High
- **Message**: "There are {Count} dirty rooms that need cleaning"
- **Trigger**: When more than 5 rooms are dirty
- **Why**: Management needs to allocate more housekeeping resources

### 💰 Payment Events

#### Payment Received
- **Who receives**: Admin, Manager, Accountant
- **Priority**: Low
- **Message**: "Payment of ${Amount} received from {Guest Name} for Room {Room Number}"
- **Why**: Financial tracking and reconciliation

## Notification Priority Levels

### High Priority 🔴
- Guest checked out (room needs immediate cleaning)
- Room needs maintenance
- High number of dirty rooms
- Urgent issues requiring immediate attention

### Medium Priority 🟡
- New booking created
- Guest checked in
- Booking cancelled
- Room status changes (non-urgent)

### Low Priority 🟢
- Room cleaned
- Payment received
- Informational updates

## How Notifications Work

### 1. Event Occurs
Example: Guest checks out

### 2. System Triggers Notification
Backend code calls: `notifyCheckOut(guestName, roomNumber)`

### 3. Notification Service Distributes
- Queries database for all active users with specified roles
- Creates notification record for each user
- Stores in `notifications` table

### 4. Users Receive Notification
- Notification appears in their notification panel
- Unread count badge updates
- Auto-refreshes every 30 seconds

## Ensuring All Staff Receive Notifications

### Current Implementation ✅

The system uses `createNotificationForRoles()` function which:

1. **Queries active users**: Only sends to users with `is_active = true`
2. **Filters by role**: Uses PostgreSQL array matching (`role = ANY($1)`)
3. **Creates individual notifications**: Each user gets their own notification record
4. **Handles errors gracefully**: Falls back if priority column doesn't exist

### Code Example

```typescript
export const notifyCheckOut = async (guestName: string, roomNumber: string) => {
  await createNotificationForRoles(
    ['admin', 'manager', 'receptionist', 'housekeeping'], // Roles
    {
      type: 'booking',
      title: 'Guest Checked Out',
      message: `${guestName} has checked out of Room ${roomNumber}. Room needs cleaning.`,
      priority: 'high',
    }
  );
};
```

## Verification

### Check Who Receives Notifications

Run this SQL to see notification distribution:

```sql
-- See all notifications and who received them
SELECT 
    n.title,
    n.message,
    n.priority,
    u.username,
    u.role,
    n.is_read,
    n.created_at
FROM notifications n
JOIN users u ON n.user_id = u.id
ORDER BY n.created_at DESC
LIMIT 20;
```

### Check Active Staff by Role

```sql
-- See all active staff and their roles
SELECT 
    username,
    role,
    is_active
FROM users
WHERE is_active = true
ORDER BY role, username;
```

## Testing Notifications

### Test Check-In Notification

1. Go to **Bookings** page
2. Edit a booking
3. Change status to **"Checked In"**
4. Click **Update Booking**
5. Check notifications for:
   - ✅ Admin user
   - ✅ Manager user
   - ✅ Receptionist user
   - ✅ Housekeeping user

### Test Check-Out Notification

1. Go to **Bookings** page
2. Edit a checked-in booking
3. Change status to **"Checked Out"**
4. Click **Update Booking**
5. Check notifications for:
   - ✅ Admin user
   - ✅ Manager user
   - ✅ Receptionist user
   - ✅ Housekeeping user

### Test Payment Notification

1. Go to **Payments** page
2. Create a new payment
3. Check notifications for:
   - ✅ Admin user
   - ✅ Manager user
   - ✅ Accountant user

## Troubleshooting

### Staff Not Receiving Notifications?

1. **Check if user is active**:
   ```sql
   SELECT username, role, is_active FROM users WHERE username = 'username';
   ```
   If `is_active = false`, update it:
   ```sql
   UPDATE users SET is_active = true WHERE username = 'username';
   ```

2. **Check if role is correct**:
   Valid roles: `admin`, `manager`, `receptionist`, `housekeeping`, `maintenance`, `accountant`

3. **Check server logs**:
   Look for: `✅ Notification created for roles ...`

4. **Restart server**:
   Changes to notification service require server restart

## Summary

✅ **All registered staff receive relevant notifications** based on their role
✅ **Check-in notifications** now include housekeeping staff
✅ **Check-out notifications** go to all relevant staff (admin, manager, receptionist, housekeeping)
✅ **Priority levels** ensure urgent notifications get attention
✅ **Role-based distribution** ensures right people get right notifications
✅ **Only active users** receive notifications

The system is designed to keep all staff informed about events relevant to their responsibilities!
