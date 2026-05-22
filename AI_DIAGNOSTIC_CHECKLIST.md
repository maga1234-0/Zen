# AI Feature Diagnostic Checklist

## ✅ Code Implementation Status

### Backend
- ✅ **AI Service** (`server/src/services/aiService.ts`) - Implemented with 5 features
- ✅ **AI Controller** (`server/src/controllers/aiController.ts`) - All endpoints created
- ✅ **AI Routes** (`server/src/routes/aiRoutes.ts`) - Routes defined
- ✅ **Routes Registration** (`server/src/routes/index.ts`) - AI routes registered at `/api/ai`
- ✅ **Package Installed** - `@google/generative-ai` v0.1.3 in package.json

### Frontend
- ✅ **AI Service** (`client/src/services/aiService.ts`) - API client implemented
- ✅ **AI Insights Component** (`client/src/components/dashboard/AIInsights.tsx`) - UI component created
- ✅ **Dashboard Integration** - AIInsights component added to Dashboard

## 🔍 How to Check if AI is Working

### Step 1: Check Backend Deployment
1. Go to https://dashboard.render.com
2. Select your backend service
3. Check the **Logs** tab
4. Look for any errors related to AI or Gemini

### Step 2: Verify API Key Configuration
1. In Render dashboard, go to **Environment** tab
2. Check if `GEMINI_API_KEY` exists
3. If missing, add it:
   - Key: `GEMINI_API_KEY`
   - Value: Your API key from https://aistudio.google.com/app/apikey
4. Save (this will trigger a redeploy)

### Step 3: Test in Browser
1. Login to your app as **Admin** or **Manager**
2. Go to **Dashboard**
3. **Scroll down** to the bottom
4. Look for the **AI Insights** card with purple/pink gradient
5. Click **"Generate Insights"** button
6. Wait 2-5 seconds

### Step 4: Check Browser Console
1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Click "Generate Insights" again
4. Look for any error messages

## 🚨 Common Issues and Solutions

### Issue 1: "Failed to generate insights"
**Symptoms:**
- Button shows error toast
- No insights appear

**Possible Causes:**
1. API key not configured
2. API key invalid
3. Backend not deployed with AI code

**Solutions:**
```
✅ Check Render environment variables
✅ Verify API key at https://aistudio.google.com/app/apikey
✅ Ensure latest code is deployed to Render
✅ Check Render logs for errors
```

### Issue 2: "Cannot see AI Insights section"
**Symptoms:**
- Dashboard doesn't show AI Insights card

**Possible Causes:**
1. Not logged in as Admin or Manager
2. Frontend not deployed with latest code
3. Need to scroll down on Dashboard

**Solutions:**
```
✅ Login as admin@hotel.com or manager@hotel.com
✅ Scroll to bottom of Dashboard page
✅ Check Vercel deployment status
✅ Clear browser cache and refresh
```

### Issue 3: "401 Unauthorized"
**Symptoms:**
- API call fails with 401 error

**Possible Causes:**
1. Not logged in
2. JWT token expired

**Solutions:**
```
✅ Logout and login again
✅ Check if token is valid in localStorage
```

### Issue 4: "Network Error"
**Symptoms:**
- Cannot connect to backend

**Possible Causes:**
1. Backend is down
2. CORS issue
3. Wrong API URL

**Solutions:**
```
✅ Check if backend is running on Render
✅ Verify VITE_API_URL in Vercel environment variables
✅ Check Render service status
```

## 🧪 Manual API Test

You can test the AI endpoint directly using curl or Postman:

### Get Your JWT Token
1. Login to your app
2. Open Browser DevTools (F12)
3. Go to **Application** > **Local Storage**
4. Copy the value of `token`

### Test Predict Trends Endpoint
```bash
curl -X GET "https://your-backend.onrender.com/api/ai/predict-trends?timeframe=30days" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "predictions": {
    "trend": "increasing",
    "peakPeriods": ["June 15-30", "July 1-15"],
    "roomTypePreferences": {
      "Deluxe": "35%",
      "Standard": "45%"
    },
    "revenuePrediction": {
      "next30days": "$45,000",
      "confidence": "high"
    },
    "pricingRecommendations": [
      "Increase Deluxe rates by 10% during peak periods"
    ],
    "marketingSuggestions": [
      "Target business travelers for Suite bookings"
    ],
    "summary": "Booking trends show steady growth..."
  },
  "dataPoints": 150,
  "currentOccupancy": {
    "occupied": 8,
    "total": 20
  }
}
```

## 📊 Verification Checklist

Run through this checklist:

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] `GEMINI_API_KEY` added to Render environment variables
- [ ] Logged in as Admin or Manager
- [ ] Can see Dashboard page
- [ ] Scrolled to bottom of Dashboard
- [ ] Can see AI Insights card with purple/pink gradient
- [ ] "Generate Insights" button is visible
- [ ] Clicked button and waited 5 seconds
- [ ] No errors in browser console (F12)
- [ ] Insights appear after clicking button

## 🔧 Quick Fix Commands

### Redeploy Backend (if needed)
```bash
cd c:\Users\aubin\Downloads\kiro1
git add .
git commit -m "Verify AI implementation"
git push origin main
```

This will trigger automatic deployment on Render.

### Check Backend Logs
1. Go to https://dashboard.render.com
2. Select your backend service
3. Click **Logs** tab
4. Look for:
   - "Server running on port 5000" ✅
   - Any errors with "AI" or "Gemini" ❌

### Test Locally (Optional)
If you want to test locally:

1. Create `server/.env` file:
```env
GEMINI_API_KEY=your_api_key_here
DATABASE_URL=your_supabase_url
JWT_SECRET=your_jwt_secret
```

2. Start backend:
```bash
cd server
npm run dev
```

3. Start frontend:
```bash
cd client
npm run dev
```

4. Open http://localhost:5174

## 📞 Still Not Working?

If you've tried everything and it's still not working, check:

1. **Render Logs** - Look for specific error messages
2. **Browser Console** - Check for JavaScript errors
3. **Network Tab** - See if API calls are being made
4. **API Key** - Verify it's valid and has quota remaining

### Get API Key Status
Visit: https://aistudio.google.com/app/apikey
- Check if your key is active
- Check if you have API quota remaining
- Generate a new key if needed

## ✨ Expected Behavior When Working

When everything is working correctly:

1. **Dashboard loads** with AI Insights card at bottom
2. **Click "Generate Insights"** button
3. **Button shows** "Analyzing..." with spinner
4. **After 2-5 seconds**, insights appear:
   - Quick stats (Trend, Data Points, Occupancy)
   - "Detailed Analysis" expandable section
   - Peak periods, room preferences, revenue forecast
   - Pricing and marketing recommendations
5. **Success toast** appears: "AI insights generated successfully!"

## 📝 Notes

- AI Insights only visible to **Admin** and **Manager** roles
- Requires at least some booking data in database
- First generation may take 5-10 seconds
- Subsequent generations are faster (2-3 seconds)
- API key must be valid and have quota

---

**Need more help?** Check the AI_INSIGHTS_TROUBLESHOOTING.md file for detailed debugging steps.
