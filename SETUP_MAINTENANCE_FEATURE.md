# Setup Guide: Maintenance Reason Feature

## Quick Setup (3 Steps)

### Step 1: Run Database Migration
Open pgAdmin and connect to your `hotel_pms` database, then run:

```sql
-- Add maintenance tracking columns
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS maintenance_reason TEXT,
ADD COLUMN IF NOT EXISTS is_urgent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS maintenance_reported_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS maintenance_reported_by UUID REFERENCES users(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_rooms_maintenance ON rooms(status, is_urgent) WHERE status = 'maintenance';
```

Or simply run the migration file:
```sql
\i database/add-maintenance-fields.sql
```

### Step 2: Restart the Server
```bash
cd server
npm run dev
```

### Step 3: Test the Feature
1. Open the application
2. Go to **Rooms** page
3. Click **Edit** on any room
4. Change status to **Maintenance**
5. You should see:
   - Maintenance Reason field (required)
   - Mark as Urgent checkbox
6. Fill in the reason and submit
7. Go to **Maintenance** page to see the task

## Verification

### Check Database Columns
```sql
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'rooms' 
  AND column_name LIKE 'maintenance%';
```

Expected output:
```
maintenance_reason        | text
maintenance_reported_at   | timestamp
maintenance_reported_by   | uuid
```

### Test Maintenance Workflow
1. **Report Maintenance**:
   - Rooms page → Edit room → Status: Maintenance
   - Enter reason: "AC not cooling properly"
   - Check "Mark as Urgent"
   - Save

2. **Check Notification**:
   - Go to Notifications
   - Should see: "🚨 URGENT Room Needs Maintenance"
   - Message includes the reason

3. **View in Maintenance Page**:
   - Go to Maintenance page
   - Room appears in "Urgent Maintenance" section
   - Shows reason and date reported

4. **Complete Maintenance**:
   - Click "Mark as Complete"
   - Room status changes to "available"
   - Room disappears from maintenance list

## Troubleshooting

### Issue: Maintenance fields not showing
- Clear browser cache
- Restart development server
- Check browser console for errors

### Issue: Database error when saving
- Verify migration was run successfully
- Check that columns exist: `\d rooms` in psql
- Ensure user has permissions

### Issue: Notifications not showing reason
- Check server logs for errors
- Verify notification service is running
- Check that reason is being passed to API

## What Changed

### Frontend Changes
- **Rooms.tsx**: Added maintenance reason form fields
- **Maintenance.tsx**: Complete rewrite with urgency support

### Backend Changes
- **roomRoutes.ts**: Validation for maintenance reason
- **notificationService.ts**: Enhanced notifications with reason

### Database Changes
- **rooms table**: 4 new columns for maintenance tracking

## Features Added

✅ Required maintenance reason when status is "maintenance"
✅ Urgency flag for prioritizing tasks
✅ Timestamp tracking when maintenance was reported
✅ User tracking who reported the maintenance
✅ Enhanced notifications with reason and urgency
✅ Maintenance page with urgent/normal separation
✅ Visual indicators for urgent tasks
✅ One-click completion of maintenance tasks

## Next Steps

After setup, you can:
1. Test with different maintenance scenarios
2. Train staff on the new workflow
3. Review maintenance reports regularly
4. Consider adding maintenance history tracking

## Support

If you encounter issues:
1. Check server logs: `server/logs` or console output
2. Check browser console for frontend errors
3. Verify database migration completed
4. Ensure all dependencies are installed
