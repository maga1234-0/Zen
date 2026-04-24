# Vercel Deployment Troubleshooting

## Common Issues and Solutions

### Issue 1: Build Failed

**Error**: "Build failed with exit code 1"

**Solutions**:
1. Check build logs in Vercel dashboard
2. Verify package.json has all dependencies
3. Check Node.js version compatibility
4. Try building locally first: `cd client && npm run build`

**Fix**:
```bash
# In Vercel build settings, use:
Build Command: cd client && npm install && npm run build
Output Directory: client/dist
```

### Issue 2: API Calls Return 404

**Error**: "GET /api/rooms 404 Not Found"

**Solutions**:
1. Check vercel.json routes configuration
2. Verify API files are in correct location
3. Check environment variables

**Fix**: Ensure vercel.json has:
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/src/server.ts"
    }
  ]
}
```

### Issue 3: Database Connection Failed

**Error**: "Error: connect ECONNREFUSED"

**Solutions**:
1. Verify DATABASE_URL is correct
2. Check database allows external connections
3. Verify SSL settings

**Fix**:
```env
# Correct format:
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
```

### Issue 4: Environment Variables Not Working

**Error**: Variables are undefined

**Solutions**:
1. Check variable names (case-sensitive)
2. Redeploy after adding variables
3. Verify variables are in correct environment (Production/Preview)

**Fix**:
1. Go to Vercel → Settings → Environment Variables
2. Add variables
3. Go to Deployments → Redeploy

### Issue 5: CORS Errors

**Error**: "Access-Control-Allow-Origin"

**Solutions**:
1. Add CORS middleware in server
2. Configure allowed origins
3. Check Vercel headers configuration

**Fix**: In server.ts, ensure:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

### Issue 6: Static Files Not Loading

**Error**: 404 on CSS/JS files

**Solutions**:
1. Check output directory setting
2. Verify build completed successfully
3. Check file paths in HTML

**Fix**: Ensure Output Directory is `client/dist`

### Issue 7: Serverless Function Timeout

**Error**: "Function execution timed out"

**Solutions**:
1. Optimize database queries
2. Add indexes to database
3. Reduce payload size
4. Upgrade Vercel plan (if needed)

**Fix**: Add indexes in database:
```sql
CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);
```

### Issue 8: Module Not Found

**Error**: "Cannot find module 'xyz'"

**Solutions**:
1. Check package.json dependencies
2. Verify import paths
3. Check TypeScript configuration

**Fix**:
```bash
# Add missing dependency
npm install xyz
# Update package.json
```

### Issue 9: Authentication Not Working

**Error**: "Invalid token" or "Unauthorized"

**Solutions**:
1. Check JWT_SECRET is set
2. Verify token is being sent
3. Check token expiration

**Fix**: Ensure JWT_SECRET is at least 32 characters

### Issue 10: Database Migrations Not Applied

**Error**: "Column does not exist"

**Solutions**:
1. Run all migration scripts
2. Check script execution order
3. Verify database connection

**Fix**: Run scripts in order:
1. schema.sql
2. seed.sql
3. All migration files

## Debugging Tips

### Check Vercel Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Click on deployment
5. View "Build Logs" and "Function Logs"

### Test Locally First

```bash
# Test client build
cd client
npm run build

# Test server
cd server
npm run build
npm start
```

### Check Environment Variables

In Vercel dashboard:
1. Settings → Environment Variables
2. Verify all required variables are set
3. Check for typos

### Verify Database Connection

Test connection string:
```bash
psql "your-connection-string"
```

## Performance Issues

### Slow Page Load

**Solutions**:
1. Enable caching
2. Optimize images
3. Reduce bundle size
4. Use code splitting

### Slow API Responses

**Solutions**:
1. Add database indexes
2. Optimize queries
3. Use connection pooling
4. Cache frequent queries

## Security Issues

### Exposed Secrets

**If you accidentally committed .env**:
1. Remove from repository
2. Change all secrets
3. Update environment variables
4. Redeploy

### HTTPS Not Working

**Solution**: Vercel automatically provides HTTPS
- Check domain configuration
- Verify DNS settings

## Getting Help

### Vercel Support

- Documentation: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions
- Support: support@vercel.com

### Supabase Support

- Documentation: https://supabase.com/docs
- Community: https://github.com/supabase/supabase/discussions
- Discord: https://discord.supabase.com

## Quick Fixes

### Redeploy

Sometimes a simple redeploy fixes issues:
1. Go to Deployments
2. Click "..." on latest
3. Click "Redeploy"

### Clear Cache

1. Go to Settings
2. Scroll to "Build & Development Settings"
3. Click "Clear Cache"
4. Redeploy

### Check Status

- Vercel Status: https://www.vercel-status.com
- Supabase Status: https://status.supabase.com

## Prevention

### Before Deploying

- [ ] Test locally
- [ ] Check all environment variables
- [ ] Verify database connection
- [ ] Run build command locally
- [ ] Check for console errors

### After Deploying

- [ ] Test all features
- [ ] Check logs for errors
- [ ] Monitor performance
- [ ] Setup alerts

---

**Still having issues? Check the logs first!**
