# Settings Implementation

## Overview
The system now fully respects and applies user settings changes in real-time.

## Features Implemented

### 1. Settings Store (Zustand)
- **Location**: `client/src/store/settingsStore.ts`
- **Persisted**: Settings are saved to localStorage and persist across sessions
- **Settings Tracked**:
  - Theme (Light/Dark/System)
  - Language
  - Hotel Name
  - Time Zone
  - Email Notifications
  - Booking Alerts
  - Payment Notifications

### 2. Theme System
- **Real-time Application**: Theme changes apply immediately when saved
- **System Theme Support**: "System" option respects OS dark/light mode preference
- **Automatic Detection**: Listens for OS theme changes and updates accordingly
- **Toggle in Navbar**: Quick theme toggle button syncs with settings

### 3. Hotel Name Display
- **Navbar**: Shows hotel name next to the date
- **Dynamic**: Updates immediately when changed in settings
- **Default**: "Grand Seafoam Hotel"

### 4. Settings Persistence
- **Database**: User settings stored in `user_settings` table
- **API Endpoints**:
  - GET `/api/users/settings` - Fetch user settings
  - PUT `/api/users/settings` - Save/update settings
- **Local Storage**: Settings cached locally for instant access
- **Sync**: Database and local storage stay in sync

### 5. User Experience
- **Change Detection**: Save/Cancel buttons only enabled when changes are made
- **Instant Feedback**: Toast notifications for success/error/info
- **Visual Updates**: Theme changes apply immediately without page refresh
- **Discard Changes**: Cancel button reverts to last saved state

## How It Works

1. **On App Load**:
   - Settings store loads from localStorage
   - Theme is applied to document root
   - System theme listener is set up

2. **When User Changes Settings**:
   - Local state tracks changes
   - Save button becomes enabled
   - User clicks "Save Changes"
   - API call updates database
   - Settings store is updated
   - Theme is applied immediately
   - Toast notification confirms success

3. **Theme Application**:
   - Dark mode: Adds `dark` class to `<html>` element
   - Light mode: Removes `dark` class
   - System mode: Checks `prefers-color-scheme` media query

4. **Navbar Theme Toggle**:
   - Toggles between Light and Dark
   - Updates settings store
   - Syncs with Settings page

## Database Migration

Run this SQL in pgAdmin to add the settings table:

```sql
-- File: database/add-user-settings.sql
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hotel_name VARCHAR(255) DEFAULT 'Grand Seafoam Hotel',
    time_zone VARCHAR(100) DEFAULT 'UTC-5 (Eastern Time)',
    email_notifications BOOLEAN DEFAULT true,
    booking_alerts BOOLEAN DEFAULT true,
    payment_notifications BOOLEAN DEFAULT true,
    theme VARCHAR(50) DEFAULT 'Dark',
    language VARCHAR(50) DEFAULT 'English',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);
```

## Files Modified

### Frontend
- `client/src/store/settingsStore.ts` (NEW) - Settings state management
- `client/src/App.tsx` - Theme application on mount
- `client/src/pages/Settings.tsx` - Settings UI and save functionality
- `client/src/components/layout/Navbar.tsx` - Hotel name display and theme toggle

### Backend
- `server/src/routes/userRoutes.ts` - Settings API endpoints

### Database
- `database/schema.sql` - Added user_settings table
- `database/add-user-settings.sql` (NEW) - Migration script

## Testing

1. Change theme in Settings → Should apply immediately
2. Change hotel name → Should appear in Navbar
3. Toggle theme in Navbar → Should sync with Settings page
4. Refresh page → Settings should persist
5. Change to System theme → Should follow OS preference
6. Toggle checkboxes → Should save and persist
