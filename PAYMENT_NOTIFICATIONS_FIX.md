# Payment Notifications - Connected

## Problem
Notifications were not being sent when payments were created.

## Solution
Added notification functionality to the payment controller to send notifications when a payment is received.

## Changes Made

### File: `server/src/controllers/paymentController.ts`

**Added:**
1. Import notification service
2. Get booking and guest information after payment creation
3. Send notification to admin, manager, and accountant roles
4. Log notification sent

## How It Works Now

### When Payment is Created
```
1. User creates payment
   ↓
2. Payment saved to database
   ↓
3. System gets guest name and room number
   ↓
4. Notification sent to:
   - Admin
   - Manager
   - Accountant
   ↓
5. Notification appears in their notification list
```

## Notification Details

**Who Receives:**
- Admin
- Manager  
- Accountant

**Notification Type:** payment

**Notification Priority:** low

**Message Format:**
```
Title: Payment Received
Message: Payment of $[amount] received from [guest_name] for Room [room_number]
```

## Example

```
Payment Created:
- Guest: John Doe
- Room: 101
- Amount: $250

Notification Sent:
Title: "Payment Received"
Message: "Payment of 250 received from John Doe for Room 101"
Recipients: Admin, Manager, Accountant
```

## Testing

### Test 1: Create Payment
1. Go to Payments page
2. Click "Record Payment"
3. Select a booking
4. Enter amount and payment method
5. Click "Record Payment"
6. **Expected**: Payment created successfully

### Test 2: Check Notifications
1. Go to Notifications page
2. **Expected**: See new notification "Payment Received"
3. **Expected**: Shows guest name, amount, and room number

### Test 3: Role-Based Notifications
1. Login as Admin
2. Create a payment
3. Check notifications
4. **Expected**: Admin sees the notification

5. Login as Receptionist
6. Check notifications
7. **Expected**: Receptionist does NOT see payment notifications

## Notification Service Function

The notification is sent using:
```typescript
await notificationService.notifyPaymentReceived(
  guestName,    // e.g., "John Doe"
  amount,       // e.g., 250
  roomNumber    // e.g., "101"
);
```

This function (already implemented in `notificationService.ts`):
- Creates notification for admin, manager, accountant roles
- Sets type to 'payment'
- Sets priority to 'low'
- Formats the message with guest name, amount, and room

## Benefits

1. ✅ Accountants notified of payments immediately
2. ✅ Managers can track revenue in real-time
3. ✅ Admin has oversight of all transactions
4. ✅ Better financial tracking
5. ✅ Audit trail of payments

## Related Notifications

The system now sends notifications for:
- ✅ New bookings
- ✅ Check-ins
- ✅ Check-outs
- ✅ Booking cancellations
- ✅ Room status changes
- ✅ Housekeeping updates
- ✅ **Payments** ← NEW!

---

**Status**: Fixed! Restart the server to enable payment notifications.
