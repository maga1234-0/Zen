# Maintenance Workflow Guide

## Visual Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                     MAINTENANCE WORKFLOW                         │
└─────────────────────────────────────────────────────────────────┘

1. REPORT MAINTENANCE
   ┌──────────────┐
   │  Rooms Page  │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────────────────┐
   │  Click "Edit" on Room               │
   │  Change Status to "Maintenance"     │
   └──────┬──────────────────────────────┘
          │
          ▼
   ┌─────────────────────────────────────┐
   │  🔶 Maintenance Fields Appear       │
   │  ├─ Reason (required)               │
   │  └─ Mark as Urgent (checkbox)       │
   └──────┬──────────────────────────────┘
          │
          ▼
   ┌─────────────────────────────────────┐
   │  Enter Details:                     │
   │  "AC not cooling properly"          │
   │  ☑ Mark as Urgent                   │
   └──────┬──────────────────────────────┘
          │
          ▼
   ┌─────────────────────────────────────┐
   │  Click "Save Changes"               │
   └──────┬──────────────────────────────┘
          │
          ├──────────────────┬─────────────────┐
          ▼                  ▼                 ▼
   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
   │  Database    │  │ Notification │  │ Maintenance  │
   │  Updated     │  │ Sent to Team │  │ Page Updated │
   └──────────────┘  └──────────────┘  └──────────────┘

2. VIEW MAINTENANCE TASKS
   ┌──────────────────┐
   │ Maintenance Page │
   └────────┬─────────┘
            │
            ▼
   ┌─────────────────────────────────────┐
   │  📊 Stats Dashboard                 │
   │  ├─ Total Tasks: 5                  │
   │  ├─ Urgent: 2                       │
   │  └─ Normal: 3                       │
   └──────┬──────────────────────────────┘
            │
            ├──────────────────┬──────────────────┐
            ▼                  ▼                  ▼
   ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
   │ 🚨 URGENT      │  │ 🕐 NORMAL      │  │ ✅ COMPLETED   │
   │ Room 301       │  │ Room 205       │  │ (Removed from  │
   │ AC Issue       │  │ Light Bulb     │  │  list)         │
   │ Reported: Today│  │ Reported: 2d   │  └────────────────┘
   └────────────────┘  └────────────────┘

3. COMPLETE MAINTENANCE
   ┌──────────────────┐
   │ Maintenance Page │
   └────────┬─────────┘
            │
            ▼
   ┌─────────────────────────────────────┐
   │  Select Task Card                   │
   │  Review Details                     │
   └──────┬──────────────────────────────┘
            │
            ▼
   ┌─────────────────────────────────────┐
   │  Click "Mark as Complete"           │
   └──────┬──────────────────────────────┘
            │
            ▼
   ┌─────────────────────────────────────┐
   │  Room Status → "Available"          │
   │  Maintenance Fields Cleared         │
   │  Task Removed from List             │
   └─────────────────────────────────────┘
```

## User Roles & Permissions

```
┌─────────────────────────────────────────────────────────────┐
│                    ROLE PERMISSIONS                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  REPORT MAINTENANCE (Edit Room Status)                      │
│  ✓ Admin                                                     │
│  ✓ Manager                                                   │
│  ✓ Receptionist                                              │
│  ✓ Housekeeping                                              │
│  ✓ Maintenance                                               │
│                                                              │
│  VIEW MAINTENANCE TASKS                                      │
│  ✓ All Roles                                                 │
│                                                              │
│  COMPLETE MAINTENANCE                                        │
│  ✓ Admin                                                     │
│  ✓ Manager                                                   │
│  ✓ Maintenance                                               │
│                                                              │
│  RECEIVE NOTIFICATIONS                                       │
│  ✓ Admin                                                     │
│  ✓ Manager                                                   │
│  ✓ Maintenance                                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Notification Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  NOTIFICATION SYSTEM                         │
└─────────────────────────────────────────────────────────────┘

Room Status Changed to "Maintenance"
         │
         ▼
┌────────────────────────────────────┐
│  Notification Service              │
│  notifyRoomMaintenance()           │
└────────┬───────────────────────────┘
         │
         ├─────────────┬─────────────┬─────────────┐
         ▼             ▼             ▼             ▼
    ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐
    │ Admin  │   │Manager │   │Maint.  │   │ Other  │
    │   ✓    │   │   ✓    │   │   ✓    │   │   ✗    │
    └────────┘   └────────┘   └────────┘   └────────┘

URGENT Maintenance:
┌─────────────────────────────────────┐
│ 🚨 URGENT Room Needs Maintenance    │
│ Room 301: AC not cooling properly   │
│ Priority: HIGH                      │
└─────────────────────────────────────┘

NORMAL Maintenance:
┌─────────────────────────────────────┐
│ Room Needs Maintenance              │
│ Room 205: Light bulb replacement    │
│ Priority: MEDIUM                    │
└─────────────────────────────────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      DATA FLOW                               │
└─────────────────────────────────────────────────────────────┘

FRONTEND (Rooms.tsx)
    │
    │ User fills form:
    │ - status: "maintenance"
    │ - maintenanceReason: "AC issue"
    │ - isUrgent: true
    │
    ▼
API Request: PUT /rooms/:id
    │
    │ {
    │   room_number: "301",
    │   floor: 3,
    │   status: "maintenance",
    │   maintenanceReason: "AC not cooling",
    │   isUrgent: true
    │ }
    │
    ▼
BACKEND (roomRoutes.ts)
    │
    │ 1. Validate reason exists
    │ 2. Get old status
    │ 3. Update database
    │
    ▼
DATABASE (rooms table)
    │
    │ UPDATE rooms SET
    │   status = 'maintenance',
    │   maintenance_reason = 'AC not cooling',
    │   is_urgent = true,
    │   maintenance_reported_at = NOW(),
    │   maintenance_reported_by = user_id
    │
    ▼
NOTIFICATION SERVICE
    │
    │ notifyRoomMaintenance(
    │   roomNumber: "301",
    │   reason: "AC not cooling",
    │   isUrgent: true
    │ )
    │
    ▼
NOTIFICATIONS TABLE
    │
    │ INSERT notifications for:
    │ - All admins
    │ - All managers
    │ - All maintenance staff
    │
    ▼
FRONTEND UPDATES
    │
    ├─ Rooms page refreshes
    ├─ Maintenance page shows new task
    └─ Notifications appear in bell icon
```

## Example Scenarios

### Scenario 1: Urgent AC Repair
```
1. Receptionist notices AC not working in Room 301
2. Goes to Rooms page → Edit Room 301
3. Changes status to "Maintenance"
4. Enters: "AC not cooling, guests complaining"
5. Checks "Mark as Urgent"
6. Saves changes
7. Maintenance team receives urgent notification
8. Maintenance staff goes to Maintenance page
9. Sees Room 301 in "Urgent" section (orange)
10. Completes repair
11. Clicks "Mark as Complete"
12. Room becomes available again
```

### Scenario 2: Routine Light Bulb Replacement
```
1. Housekeeping notices light bulb out in Room 205
2. Reports via Rooms page
3. Enters: "Bathroom light bulb needs replacement"
4. Does NOT mark as urgent
5. Saves changes
6. Maintenance team receives normal notification
7. Task appears in "Normal Priority" section
8. Maintenance completes when convenient
9. Marks as complete
```

## Database Schema

```sql
rooms table:
┌──────────────────────────┬──────────────┬─────────────┐
│ Column                   │ Type         │ Description │
├──────────────────────────┼──────────────┼─────────────┤
│ id                       │ UUID         │ Primary key │
│ room_number              │ VARCHAR(20)  │ Room number │
│ status                   │ VARCHAR(20)  │ Room status │
│ maintenance_reason       │ TEXT         │ Why maint.  │
│ is_urgent                │ BOOLEAN      │ Urgency     │
│ maintenance_reported_at  │ TIMESTAMP    │ When        │
│ maintenance_reported_by  │ UUID         │ Who         │
└──────────────────────────┴──────────────┴─────────────┘
```

## Benefits

✅ **Accountability**: Track who reported maintenance and when
✅ **Prioritization**: Urgent tasks are clearly marked and prioritized
✅ **Communication**: Maintenance team knows exactly what's wrong
✅ **History**: Maintenance reasons are stored for future reference
✅ **Efficiency**: One-click completion of tasks
✅ **Visibility**: Clear dashboard showing all maintenance tasks
✅ **Notifications**: Automatic alerts to relevant staff
