# Fix Front Desk Check-ins - Step by Step

## Step 1: Run Debug Query

Open pgAdmin and run this query:

```sql
-- File: database/debug-front-desk.sql
-- This will show you what's in your database
```

Copy the entire content of `database/debug-front-desk.sql` and run it in pgAdmin.

**Look at the results:**
- What is `database_today`? (Should be today's date)
- How many `total_bookings` do you have?
- How many `today_bookings` do you have?

## Step 2: Create Booking via UI (Easiest Method)

1. **Open the application** in your browser
2. **Login** as admin (admin@hotel.c