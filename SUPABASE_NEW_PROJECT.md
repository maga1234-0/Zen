# New Supabase Project Setup

## Your Supabase Project
**URL**: https://hxvhkhwhhfwtthujkahx.supabase.co
**Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4dmhraHdoaGZ3dHRodWprYWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDU3MzUsImV4cCI6MjA5NDA4MTczNX0.yLZmEIRwy6Yej5zid-I71P-0vYbBc3oxuUufGqKRv78

## Step 1: Get Database Connection Details

1. Go to: https://app.supabase.com
2. Select your project: `hxvhkhwhhfwtthujkahx`
3. Go to Settings → Database
4. Scroll to "Connection string" section

You need to get:
- **Database Password** (if you haven't set one yet, you can reset it)
- **Connection String** (looks like: `postgresql://postgres:[password]@db.hxvhkhwhhfwtthujkahx.supabase.co:5432/postgres`)

## Step 2: Update Environment Variables

### For Local Development
Update `server/.env` with your new Supabase details:

```env
PORT=5000
NODE_ENV=development

# Supabase PostgreSQL Database (Connection Pooler)
DB_HOST=db.hxvhkhwhhfwtthujkahx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=[YOUR_DATABASE_PASSWORD]

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### For Vercel Deployment
Add these environment variables in Vercel dashboard:

1. **DATABASE_URL** (use the full connection string):
   ```
   postgresql://postgres:[YOUR_DATABASE_PASSWORD]@db.hxvhkhwhhfwtthujkahx.supabase.co:5432/postgres
   ```

2. **JWT_SECRET** (generate a secure random string):
   ```
   your-super-secret-jwt-key-minimum-32-characters-long-change-this
   ```

3. **NODE_ENV**:
   ```
   production
   ```

4. **VITE_API_URL** (will be set automatically after first deploy):
   ```
   https://your-app-name.vercel.app/api
   ```

## Step 3: Run SQL Scripts

1. Go to SQL Editor in Supabase
2. Run these scripts in order:
   - `database/schema.sql`
   - `database/seed.sql`
   - `database/update-guests-phone-optional.sql`
   - `database/fix-room-status-constraint.sql`
   - `database/add-maintenance-fields.sql`
   - `database/update-notifications-table.sql`

## Step 4: Test Connection

Test the connection locally:
```bash
cd server
npm run dev
```

You should see: `✅ Database connected successfully`

## Important Notes

- ⚠️ Keep your database password secure
- ⚠️ Never commit `.env` files to GitHub
- ⚠️ The anon key is for client-side operations (if you add Supabase client SDK later)
- ⚠️ The server uses direct PostgreSQL connection, not Supabase SDK

## Troubleshooting

### Connection refused
- Check if you're using the correct port (5432 for direct, 6543 for connection pooler)
- Verify password is correct
- Check if IP is allowed in Supabase dashboard (Settings → Database → Connection Pooler)

### Authentication failed
- Reset database password in Supabase dashboard
- Use connection pooler: `aws-0-eu-west-1.pooler.supabase.com:6543`

### SSL required
Supabase requires SSL. The database config already handles this:
```typescript
ssl: process.env.DB_HOST?.includes('supabase.com') ? {
  rejectUnauthorized: false
} : false,
```

## Next Steps

1. ✅ Get database password from Supabase
2. ⏳ Update environment variables
3. ⏳ Run SQL scripts
4. ⏳ Test connection
5. ⏳ Deploy to Vercel