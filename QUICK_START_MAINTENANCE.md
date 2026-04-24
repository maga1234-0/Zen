# Quick Start: Maintenance Reason Feature

## 🚀 Setup (2 Minutes)

### 1. Run in pgAdmin
```sql
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS maintenance_reason TEXT,
ADD COLUMN IF NOT EXISTS is_urgent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS maintenance_reported_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS maintenance_reported_by UUID REFERENCES users(id);

CREATE INDEX IF NOT EXISTS idx_rooms_maintenance ON rooms(status, is_urgent) WHERE status = 'maintenance';
```

### 2. Restart Server
```bash
cd server && npm run dev
```

### 3. Done! ✅

## 📝 How to Use

### Report Maintenance
```
Rooms → Edit Room → Status: Maintenance
↓
Enter Reason: "AC not working"
↓
☑ Mark as Urgent (if needed)
↓
Save
```

### View Tasks
```
Maintenance Page
↓
See Urgent (orange) and Normal (blue) sections
↓
Review reason and date
```

### Complete Task
```
Maintenance Page → Select Task
↓
Click "Mark as Complete"
↓
Room becomes Available
```

## 🎯 Key Features

✅ Required reason for maintenance
✅ Urgency flag
✅ Enhanced notifications
✅ Separate urgent/normal display
✅ One-click completion
✅ Automatic tracking

## 📊 What You'll See

### Edit Room Modal
```
Status: [Maintenance ▼]

┌─────────────────────────────────────┐
│ 🔶 Maintenance Details              │
├─────────────────────────────────────┤
│ Reason: *                           │
│ [Text area for description]         │
│                                     │
│ ☐ Mark as Urgent                    │
└─────────────────────────────────────┘
```

### Maintenance Page
```
Stats: Total: 5 | Urgent: 2 | Normal: 3

🚨 URGENT MAINTENANCE
┌──────────────────┐
│ Room 301         │
│ AC not cooling   │
│ Reported: Today  │
│ [Mark Complete]  │
└──────────────────┘

🕐 NORMAL PRIORITY
┌──────────────────┐
│ Room 205         │
│ Light bulb out   │
│ Reported: 2d ago │
│ [Mark Complete]  │
└──────────────────┘
```

## 🔔 Notifications

**Urgent:**
```
🚨 URGENT Room Needs Maintenance
Room 301: AC not cooling properly
```

**Normal:**
```
Room Needs Maintenance
Room 205: Light bulb replacement
```

## 🎭 User Roles

| Action | Admin | Manager | Maintenance | Others |
|--------|-------|---------|-------------|--------|
| Report | ✅ | ✅ | ✅ | ✅ |
| View | ✅ | ✅ | ✅ | ✅ |
| Complete | ✅ | ✅ | ✅ | ❌ |
| Notify | ✅ | ✅ | ✅ | ❌ |

## 📁 Files Changed

- `client/src/pages/Rooms.tsx` - Edit modal
- `client/src/pages/Maintenance.tsx` - Task list
- `server/src/routes/roomRoutes.ts` - API
- `server/src/services/notificationService.ts` - Alerts
- `database/add-maintenance-fields.sql` - Migration

## ✅ Testing

1. Edit room → Status: Maintenance
2. See orange maintenance section
3. Enter reason (required)
4. Check urgent if needed
5. Save and check notification
6. Go to Maintenance page
7. See task in correct section
8. Click "Mark as Complete"
9. Verify room is available

## 🆘 Troubleshooting

**Fields not showing?**
- Clear browser cache
- Restart server

**Database error?**
- Run migration again
- Check columns exist: `\d rooms`

**No notifications?**
- Check server logs
- Verify user roles

## 📚 Full Documentation

- `MAINTENANCE_REASON_FEATURE.md` - Complete docs
- `SETUP_MAINTENANCE_FEATURE.md` - Detailed setup
- `MAINTENANCE_WORKFLOW.md` - Visual guide
- `TASK_8_MAINTENANCE_REASON_COMPLETE.md` - Summary

---

**Ready to use!** 🎉
