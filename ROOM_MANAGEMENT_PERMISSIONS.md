# Room Management Permissions

## Overview
Only Admin and Manager roles can add or delete rooms. Other staff can view and edit room details (like status), but cannot create or remove rooms from the system.

## Permission Rules

### ✅ Admin and Manager Can:
- View all rooms
- Add new rooms
- Edit room details (number, floor, status)
- Delete rooms
- Quick book rooms

### ✅ Other Staff (Receptionist, Housekeeping, Maintenance, Accountant) Can:
- View all rooms
- Edit room details (number, floor, status)
- Quick book rooms

### ❌ Other Staff Cannot:
- Add new rooms
- Delete rooms

## Implementation

### Backend (API) Protection

**File**: `server/src/routes/roomRoutes.ts`

Added `authorize` middleware to restrict endpoints:

```typescript
// Create room (Admin and Manager only)
router.post('/', authorize(['admin', 'manager']), async (req, res) => {
  // ... room creation logic
});

// Delete room (Admin and Manager only)
router.delete('/:id', authorize(['admin', 'manager']), async (req, res) => {
  // ... room deletion logic
});
```

If a non-admin/manager tries to call these endpoints, they get:
- **Status**: 403 Forbidden
- **Message**: "Access denied. Insufficient permissions."

### Frontend (UI) Protection

**File**: `client/src/pages/Rooms.tsx`

Added role-based UI hiding:

```typescript
const { user } = useAuthStore();
const canManageRooms = user?.role === 'admin' || user?.role === 'manager';
```

**"Add Room" button** - Only visible to admin/manager:
```typescript
{canManageRooms && (
  <Button onClick={() => setShowAddModal(true)}>
    <Plus className="w-4 h-4 mr-2" />
    Add Room
  </Button>
)}
```

**Delete button** - Only visible to admin/manager:
```typescript
{canManageRooms && (
  <button onClick={() => handleDelete(room)}>
    <Trash2 className="w-4 h-4" />
  </button>
)}
```

## What Each Role Sees

### Admin / Manager View
```
┌─────────────────────────────────┐
│ Rooms                [+ Add Room]│
├─────────────────────────────────┤
│ Room 100                         │
│ Floor: 1, Type: Double          │
│ $200/night                       │
│                    [Edit] [Delete]│
└─────────────────────────────────┘
```

### Receptionist / Other Staff View
```
┌─────────────────────────────────┐
│ Rooms                            │
├─────────────────────────────────┤
│ Room 100                         │
│ Floor: 1, Type: Double          │
│ $200/night                       │
│                    [Edit]        │
└─────────────────────────────────┘
```

## Testing

### Test as Admin/Manager
1. Login as admin@hotel.com (password: admin123)
2. Go to Rooms page
3. ✅ You should see "Add Room" button
4. Hover over a room card
5. ✅ You should see both Edit and Delete buttons

### Test as Receptionist
1. Login as receptionist@hotel.com (password: password123)
2. Go to Rooms page
3. ❌ "Add Room" button should be hidden
4. Hover over a room card
5. ✅ You should see Edit button only
6. ❌ Delete button should be hidden

### Test API Protection
Try to create a room as receptionist:
```bash
# This should fail with 403 Forbidden
curl -X POST http://localhost:5000/api/rooms \
  -H "Authorization: Bearer {receptionist_token}" \
  -H "Content-Type: application/json" \
  -d '{"roomNumber":"999","floor":1,"roomTypeId":"...","hotelId":"..."}'
```

Expected response:
```json
{
  "message": "Access denied. Insufficient permissions."
}
```

## Security Notes

### Double Protection
The system has two layers of protection:

1. **Frontend (UI)**: Hides buttons from unauthorized users
   - Improves user experience
   - Prevents confusion
   - Not a security measure (can be bypassed)

2. **Backend (API)**: Enforces permissions on the server
   - Real security layer
   - Cannot be bypassed
   - Returns 403 Forbidden for unauthorized attempts

### Why Both Layers?

- **Frontend hiding**: Better UX - users don't see options they can't use
- **Backend enforcement**: Real security - even if someone bypasses the UI, the API blocks them

## Files Modified

1. `server/src/routes/roomRoutes.ts`
   - Added `authorize` middleware to POST and DELETE routes
   - Imported `authorize` from auth middleware

2. `client/src/pages/Rooms.tsx`
   - Added `useAuthStore` import
   - Added `canManageRooms` permission check
   - Conditionally render "Add Room" button
   - Conditionally render Delete button

## Error Messages

### When Non-Admin Tries to Add Room
- **Frontend**: Button is hidden, can't click
- **Backend**: If they bypass UI: "Access denied. Insufficient permissions."

### When Non-Admin Tries to Delete Room
- **Frontend**: Button is hidden, can't click
- **Backend**: If they bypass UI: "Access denied. Insufficient permissions."

## Summary

✅ **Backend protected** - API enforces admin/manager-only access
✅ **Frontend hidden** - UI hides buttons from unauthorized users
✅ **Double security** - Both layers work together
✅ **All other operations** - Still available to all staff (view, edit status, quick book)

Only Admin and Manager can add or delete rooms!
