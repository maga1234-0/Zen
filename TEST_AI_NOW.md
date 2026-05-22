# 🧪 Test AI Features Right Now

## Quick 3-Step Test

### Step 1: Check Configuration ⚙️

**Go to Render Dashboard:**
1. Visit https://dashboard.render.com
2. Click on your backend service
3. Go to **Environment** tab
4. Look for `GEMINI_API_KEY`

**If MISSING:**
```
❌ AI will NOT work without this!

To fix:
1. Get API key from: https://aistudio.google.com/app/apikey
2. Click "Add Environment Variable" in Render
3. Name: GEMINI_API_KEY
4. Value: paste your API key
5. Click "Save Changes" (triggers redeploy)
6. Wait 2-3 minutes for deployment
```

**If PRESENT:**
```
✅ Configuration looks good!
Proceed to Step 2
```

---

### Step 2: Access AI Insights 🎯

1. **Open your app**: https://your-app.vercel.app
2. **Login** with:
   - Email: `admin@hotel.com`
   - Password: `admin123`
3. **Go to Dashboard** (should load automatically)
4. **Scroll ALL THE WAY DOWN** to the bottom
5. **Look for**: Purple/pink gradient card titled "AI Insights"

**What you should see:**
```
┌─────────────────────────────────────────┐
│ 🤖 AI Insights                          │
│ Powered by Google Gemini                │
│                                         │
│ [✨ Generate Insights] button           │
│                                         │
│ "No insights generated yet"             │
│ "Click Generate Insights to analyze..." │
└─────────────────────────────────────────┘
```

**If you DON'T see this:**
- Make sure you're logged in as Admin or Manager
- Try refreshing the page (Ctrl+F5)
- Check if Vercel deployed the latest code
- Clear browser cache

---

### Step 3: Generate Insights 🚀

1. **Click** the "Generate Insights" button
2. **Wait** 2-5 seconds (button shows "Analyzing...")
3. **Watch** for results

**Expected Result:**
```
✅ Success toast: "AI insights generated successfully!"

You should see:
┌─────────────────────────────────────────┐
│ Quick Stats:                            │
│ • Trend: Increasing ↗️                  │
│ • Data Points: 150                      │
│ • Occupancy: 8/20                       │
│                                         │
│ [▼ Detailed Analysis]                   │
└─────────────────────────────────────────┘

Click "Detailed Analysis" to expand and see:
• Peak Booking Periods
• Room Type Preferences  
• Revenue Forecast
• Pricing Recommendations
• Marketing Suggestions
```

---

## 🚨 Troubleshooting

### Problem: "Failed to generate insights"

**Check Browser Console:**
1. Press **F12**
2. Go to **Console** tab
3. Look for error messages

**Common Errors:**

#### Error: "API key not configured"
```
❌ GEMINI_API_KEY is missing in Render

Fix: Add it in Render Environment variables
```

#### Error: "401 Unauthorized"
```
❌ You're not logged in or token expired

Fix: Logout and login again
```

#### Error: "Network Error" or "Failed to fetch"
```
❌ Backend is not responding

Fix: 
1. Check Render service status
2. Check Render logs for errors
3. Verify backend URL in Vercel env vars
```

#### Error: "500 Internal Server Error"
```
❌ Backend error (check Render logs)

Fix:
1. Go to Render dashboard
2. Click your service
3. View Logs
4. Look for error messages
```

---

### Problem: Can't see AI Insights card

**Checklist:**
- [ ] Logged in as Admin or Manager? (not receptionist, etc.)
- [ ] On Dashboard page?
- [ ] Scrolled to the very bottom?
- [ ] Latest code deployed to Vercel?
- [ ] Tried hard refresh (Ctrl+Shift+R)?

**Quick Fix:**
```bash
# Clear browser cache
1. Press Ctrl+Shift+Delete
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh page
```

---

### Problem: Button does nothing

**Check Network Tab:**
1. Press **F12**
2. Go to **Network** tab
3. Click "Generate Insights"
4. Look for request to `/api/ai/predict-trends`

**If NO request appears:**
- JavaScript error (check Console tab)
- Button not wired correctly

**If request appears but FAILS:**
- Check the response (click on the request)
- Look at "Response" tab for error message
- Check "Headers" tab for status code

---

## 🧪 Advanced Testing

### Test Other AI Features

Once basic AI Insights works, you can test other features:

#### 1. AI Chatbot
```javascript
// Open browser console (F12) and run:
const response = await fetch('https://your-backend.onrender.com/api/ai/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({
    message: 'What time is breakfast?'
  })
});
const data = await response.json();
console.log(data);
```

#### 2. Message Generation
```javascript
const response = await fetch('https://your-backend.onrender.com/api/ai/generate-message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({
    type: 'welcome',
    data: {
      guestName: 'John Doe',
      roomNumber: '305',
      checkInDate: '2026-06-15',
      checkOutDate: '2026-06-18'
    }
  })
});
const data = await response.json();
console.log(data);
```

#### 3. Sentiment Analysis
```javascript
const response = await fetch('https://your-backend.onrender.com/api/ai/analyze-review', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({
    review: 'The room was clean but the AC was too noisy. Staff were very helpful though!'
  })
});
const data = await response.json();
console.log(data);
```

---

## ✅ Success Criteria

Your AI is working if:

1. ✅ AI Insights card visible on Dashboard
2. ✅ "Generate Insights" button clickable
3. ✅ Button shows "Analyzing..." when clicked
4. ✅ Insights appear after 2-5 seconds
5. ✅ Success toast message appears
6. ✅ Can expand "Detailed Analysis" section
7. ✅ No errors in browser console
8. ✅ No errors in Render logs

---

## 📊 What the AI Actually Does

When you click "Generate Insights", the AI:

1. **Fetches** your last 6 months of booking data
2. **Analyzes** patterns and trends
3. **Identifies** peak booking periods
4. **Calculates** room type preferences
5. **Predicts** revenue for next 30 days
6. **Recommends** pricing strategies
7. **Suggests** marketing tactics
8. **Summarizes** everything in plain English

All powered by Google Gemini AI! 🤖✨

---

## 🎯 Next Steps After Testing

Once AI Insights works:

1. **Generate insights weekly** to track trends
2. **Act on recommendations** to improve revenue
3. **Compare predictions** with actual results
4. **Explore other AI features** (chatbot, sentiment analysis)
5. **Integrate AI** into your workflow

---

**Still stuck?** Check:
- AI_DIAGNOSTIC_CHECKLIST.md (detailed debugging)
- AI_INSIGHTS_TROUBLESHOOTING.md (specific issues)
- Render logs (backend errors)
- Browser console (frontend errors)
