# Database Migration Guide

## Add User Settings Table

To add the user_settings table to your existing database, run this SQL script in pgAdmin:

1. Open pgAdmin and connect to your `hotel_pms` database
2. Open the Query Tool
3. Copy and paste the contents of `add-user-settings.sql`
4. Click Execute (F5)

Or run from command line:
```bash
psql -U postgres -d hotel_pms -f database/add-user-settings.sql
```

This will create the `user_settings` table that stores user preferences like:
- Hotel name
- Time zone
- Notification preferences (email, booking alerts, payment notifications)
- Theme (Light/Dark/System)
- Language

The table is linked to the `users` table via `user_id` and will automatically delete settings when a user is deleted.
