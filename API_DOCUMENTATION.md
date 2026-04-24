# 📡 Hotel PMS - API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "admin@hotel.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@hotel.com",
    "firstName": "John",
    "lastName": "Admin",
    "role": "admin"
  }
}
```

### Get Profile
```http
GET /api/auth/profile
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",
  "email": "admin@hotel.com",
  "first_name": "John",
  "last_name": "Admin",
  "phone": "+1-305-555-0101",
  "role": "admin"
}
```

---

## 📊 Dashboard Endpoints

### Get Dashboard Statistics
```http
GET /api/dashboard/stats
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "totalBookings": 150,
  "revenue": 45000.00,
  "occupancyRate": 75,
  "availableRooms": 12
}
```

### Get Booking Trends
```http
GET /api/dashboard/booking-trends
```

**Response:**
```json
[
  {
    "date": "2026-04-01",
    "bookings": 5
  },
  {
    "date": "2026-04-02",
    "bookings": 8
  }
]
```

### Get Revenue Analytics
```http
GET /api/dashboard/revenue-analytics
```

**Response:**
```json
[
  {
    "month": "Jan",
    "revenue": 12500.00
  },
  {
    "month": "Feb",
    "revenue": 15000.00
  }
]
```

### Get Recent Activities
```http
GET /api/dashboard/recent-activities
```

**Response:**
```json
[
  {
    "id": "uuid",
    "status": "checked_in",
    "check_in_date": "2026-04-10",
    "check_out_date": "2026-04-15",
    "guest_name": "Emma Wilson",
    "room_number": "102"
  }
]
```

---

## 🛏️ Room Endpoints

### Get All Rooms
```http
GET /api/rooms
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "uuid",
    "hotel_id": "uuid",
    "room_type_id": "uuid",
    "room_number": "101",
    "floor": 1,
    "status": "available",
    "room_type_name": "Single Room",
    "base_price": 89.99
  }
]
```

### Create Room
```http
POST /api/rooms
```

**Headers:** `Authorization: Bearer <token>`

**Permissions:** Admin, Manager

**Request Body:**
```json
{
  "hotelId": "uuid",
  "roomTypeId": "uuid",
  "roomNumber": "105",
  "floor": 1,
  "status": "available"
}
```

**Response:**
```json
{
  "id": "uuid",
  "hotel_id": "uuid",
  "room_type_id": "uuid",
  "room_number": "105",
  "floor": 1,
  "status": "available",
  "created_at": "2026-04-13T10:00:00Z"
}
```

### Update Room
```http
PUT /api/rooms/:id
```

**Headers:** `Authorization: Bearer <token>`

**Permissions:** Admin, Manager

**Request Body:**
```json
{
  "roomNumber": "105",
  "floor": 1,
  "status": "maintenance"
}
```

### Delete Room
```http
DELETE /api/rooms/:id
```

**Headers:** `Authorization: Bearer <token>`

**Permissions:** Admin only

**Response:**
```json
{
  "message": "Room deleted successfully"
}
```

---

## 📅 Booking Endpoints

### Get All Bookings
```http
GET /api/bookings
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "uuid",
    "hotel_id": "uuid",
    "guest_id": "uuid",
    "room_id": "uuid",
    "check_in_date": "2026-04-15",
    "check_out_date": "2026-04-20",
    "number_of_guests": 2,
    "status": "confirmed",
    "total_amount": 649.95,
    "guest_name": "Emma Wilson",
    "guest_phone": "+1-555-0201",
    "room_number": "301"
  }
]
```

### Create Booking
```http
POST /api/bookings
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "hotelId": "uuid",
  "guestId": "uuid",
  "roomId": "uuid",
  "checkInDate": "2026-04-20",
  "checkOutDate": "2026-04-25",
  "numberOfGuests": 2,
  "totalAmount": 649.95,
  "specialRequests": "Late check-in"
}
```

**Response:**
```json
{
  "id": "uuid",
  "hotel_id": "uuid",
  "guest_id": "uuid",
  "room_id": "uuid",
  "check_in_date": "2026-04-20",
  "check_out_date": "2026-04-25",
  "number_of_guests": 2,
  "status": "confirmed",
  "total_amount": 649.95,
  "created_at": "2026-04-13T10:00:00Z"
}
```

### Update Booking Status
```http
PATCH /api/bookings/:id/status
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "checked_in"
}
```

**Valid Status Values:**
- `pending`
- `confirmed`
- `checked_in`
- `checked_out`
- `cancelled`

---

## 👤 Guest Endpoints

### Get All Guests
```http
GET /api/guests
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "uuid",
    "first_name": "Emma",
    "last_name": "Wilson",
    "email": "emma.wilson@email.com",
    "phone": "+1-555-0201",
    "id_type": "Passport",
    "id_number": "P123456",
    "city": "New York",
    "country": "USA"
  }
]
```

### Create Guest
```http
POST /api/guests
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "phone": "+1-555-0999",
  "idType": "Passport",
  "idNumber": "P999999",
  "address": "123 Main St",
  "city": "Boston",
  "country": "USA",
  "dateOfBirth": "1990-01-15"
}
```

### Get Guest Booking History
```http
GET /api/guests/:id/bookings
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "uuid",
    "check_in_date": "2026-04-10",
    "check_out_date": "2026-04-15",
    "status": "checked_out",
    "total_amount": 449.95,
    "room_number": "102"
  }
]
```

---

## 🔒 Role-Based Access Control

### Roles
- **Admin**: Full access to all endpoints
- **Manager**: Can manage rooms, bookings, guests, and view reports
- **Receptionist**: Can manage bookings and guests, view dashboard

### Endpoint Permissions

| Endpoint | Admin | Manager | Receptionist |
|----------|-------|---------|--------------|
| Dashboard | ✅ | ✅ | ✅ |
| View Rooms | ✅ | ✅ | ✅ |
| Create/Edit Rooms | ✅ | ✅ | ❌ |
| Delete Rooms | ✅ | ❌ | ❌ |
| Bookings | ✅ | ✅ | ✅ |
| Guests | ✅ | ✅ | ✅ |
| Staff Management | ✅ | ✅ | ❌ |
| Settings | ✅ | ❌ | ❌ |

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "message": "Room is not available"
}
```

### 401 Unauthorized
```json
{
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error"
}
```

---

## 📝 Notes

- All dates are in ISO 8601 format (YYYY-MM-DD)
- All timestamps are in ISO 8601 format with timezone
- All monetary values are in decimal format (e.g., 99.99)
- UUIDs are used for all entity IDs
- Pagination will be added in future versions

---

## 🧪 Testing with cURL

### Login Example
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hotel.com","password":"password123"}'
```

### Get Dashboard Stats
```bash
curl -X GET http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "hotelId": "550e8400-e29b-41d4-a716-446655440000",
    "guestId": "880e8400-e29b-41d4-a716-446655440001",
    "roomId": "ROOM_UUID",
    "checkInDate": "2026-04-20",
    "checkOutDate": "2026-04-25",
    "numberOfGuests": 2,
    "totalAmount": 649.95
  }'
```

---

For more information, see the main README.md file.
