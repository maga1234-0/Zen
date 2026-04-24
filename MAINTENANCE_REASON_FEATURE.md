# Maintenance Reason Feature

## Overview
When changing a room status to "maintenance", users must now provide a reason and indicate urgency level. This helps track maintenance issues and prioritize urgent repairs.

## Database Changes

### New Columns Added to `rooms` Table
Run this migration in pgAdmin:

```sql
-- File: database/add-maintenance-fields.sql
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS maintenance_reason TEXT,
ADD COLUMN IF NOT EXISTS is_urgent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS maintenance_reported_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS maintenance_reported_by UUID REFERENCES users(id);

CREATE INDEX IF NOT EXISTS idx_rooms_maintenance ON rooms(status, is_urgent) WHERE status = 'maintenance';
```

## Features

### 1. Edit Room Modal (Rooms Page)
- When status is changed to "maintenance", additional fields appear:
  - **Maintenance Reason** (required): Text area to describe the issue
  - **Mark as Urgent** (checkbox): Flag for urgent maintenance
  - Visual indicator when urgent is selected
- Fields are hidden for other statuses
- Validation: Reason is required when status is "maintenance"

### 2. Enhanced Notifications
- Maintenance notifications now include:
  - Reason for maintenance
  - Urgency indicator (🚨 URGENT prefix for urgent tasks)
  - Higher priority for urgent maintenance
- Sent to: admin, manager, maintenance roles

### 3. Maintenance Page
- Displays all rooms in maintenance status
- Separated into two sections:
  - **Urgent Maintenance**: Orange-themed, prioritized display
  - **Normal Priority**: Standard display
- Each card shows:
  - Room number and floor
  - Maintenance reason
  - Urgency badge
  - Date reported
  - "Mark as Complete" button (for authorized users)
- Stats dashboard showing total, urgent, and normal tasks

## User Workflow

### Reporting Maintenance
1. Go to Rooms page
2. Click Edit on a room
3. Change status to "Maintenance"
4. Additional fields appear:
   - Enter maintenance reason (required)
   - Check "Mark as Urgent" if needed
5. Click "Save Changes"
6. Notification sent to maintenance team with details

### Completing Maintenance
1. Go to Maintenance page
2. View urgent tasks first (orange section)
3. Review maintenance reason
4. Complete the work
5. Click "Mark as Complete"
6. Room status changes to "available"

## API Changes

### PUT /rooms/:id
Updated to accept additional fields:
```typescript
{
  room_number: string,
  floor: number,
  status: string,
  maintenanceReason?: string,  // Required if status is 'maintenance'
  isUrgent?: boolean           // Default: false
}
```

### Validation
- If status is "maintenance", `maintenanceReason` must be provided
- Returns 400 error if reason is missing

### Database Updates
- When status is "maintenance":
  - Stores reason, urgency, timestamp, and user ID
- When status changes from "maintenance":
  - Clears all maintenance fields

## Notification Service Updates

### notifyRoomMaintenance()
```typescript
notifyRoomMaintenance(roomNumber: string, reason?: string, isUrgent?: boolean)
```

- Includes reason in notification message
- Adds 🚨 URGENT prefix for urgent tasks
- Sets priority to 'high' for urgent, 'medium' for normal

## Files Modified

### Frontend
- `client/src/pages/Rooms.tsx`: Edit modal with maintenance fields
- `client/src/pages/Maintenance.tsx`: Complete rewrite with urgency support

### Backend
- `server/src/routes/roomRoutes.ts`: Updated PUT endpoint with validation
- `server/src/services/notificationService.ts`: Enhanced maintenance notifications

### Database
- `database/add-maintenance-fields.sql`: New migration file

## Testing Steps

1. **Run Database Migration**
   ```sql
   -- In pgAdmin, run:
   \i database/add-maintenance-fields.sql
   ```

2. **Test Maintenance Reporting**
   - Edit a room
   - Change status to "maintenance"
   - Verify reason field appears and is required
   - Try submitting without reason (should fail)
   - Add reason and mark as urgent
   - Submit and verify notification

3. **Test Maintenance Page**
   - Navigate to Maintenance page
   - Verify urgent tasks appear in orange section
   - Verify normal tasks appear in separate section
   - Check that reason and date are displayed
   - Complete a task and verify room becomes available

4. **Test Notifications**
   - Check that maintenance team receives notification
   - Verify urgent tasks have 🚨 prefix
   - Verify reason is included in message

## Permissions
- **View Maintenance**: All roles
- **Complete Maintenance**: admin, manager, maintenance roles
- **Report Maintenance**: All roles (via room edit)

## Future Enhancements
- Add maintenance history log
- Track time to complete maintenance
- Add photos/attachments to maintenance reports
- Maintenance cost tracking
- Recurring maintenance schedules
