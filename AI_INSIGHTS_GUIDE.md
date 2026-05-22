# AI Insights Feature - User Guide

## 🎉 What's New

I've added an **AI Insights** component to your Dashboard that uses Google Gemini AI to analyze your hotel's booking data and provide intelligent recommendations!

## 📍 Where to Find It

The AI Insights panel is located at the **bottom of the Dashboard** for Admin and Manager roles.

## 🚀 How to Use

### Step 1: Configure the API Key

Before using AI Insights, you need to add your Gemini API key:

**For Production (Render):**
1. Go to https://dashboard.render.com
2. Select your backend service
3. Go to "Environment" tab
4. Add: `GEMINI_API_KEY` = your_api_key
5. Save (triggers auto-deploy)

**For Local Development:**
1. Create `server/.env` file
2. Add: `GEMINI_API_KEY=your_api_key_here`
3. Restart your server

### Step 2: Generate Insights

1. **Login** as Admin or Manager
2. **Navigate** to the Dashboard
3. **Scroll down** to the AI Insights section
4. **Click** the "Generate Insights" button
5. **Wait** 2-5 seconds for AI to analyze your data
6. **View** the insights!

## 📊 What You'll See

### Quick Stats (Always Visible)
- **Trend**: Booking trend (Increasing/Stable/Decreasing)
- **Data Points**: Number of historical bookings analyzed
- **Occupancy**: Current room occupancy ratio

### Detailed Analysis (Expandable)
Click "Detailed Analysis" to expand and see:

#### 📅 Peak Booking Periods
- Identifies when you'll have the most bookings
- Example: "June 15-30, 2026" or "July 1-15, 2026"

#### 🏨 Room Type Preferences
- Shows which room types guests prefer
- Percentage breakdown (e.g., Deluxe: 35%, Standard: 45%)

#### 💰 Revenue Forecast
- Predicts revenue for the next 30 days
- Includes confidence level (high/medium/low)

#### 💡 Pricing Recommendations
- AI-suggested pricing strategies
- Examples:
  - "Increase Deluxe room rates by 10% during peak periods"
  - "Offer early bird discounts for Standard rooms"

#### 🎯 Marketing Suggestions
- Targeted marketing recommendations
- Examples:
  - "Target business travelers for Suite bookings"
  - "Promote weekend packages for families"

#### 📊 Summary
- Overall analysis and key takeaways
- Written in natural language

## 🎨 Features

### Beautiful UI
- Gradient backgrounds with purple, pink, and blue colors
- Smooth animations when loading
- Expandable sections to save space
- Responsive design (works on mobile)

### Smart Analysis
- Analyzes last 6 months of booking data
- Uses current occupancy rates
- Considers room type preferences
- Provides actionable recommendations

### Real-time Generation
- Click button to generate fresh insights
- Loading indicator while AI processes
- Success/error notifications

## 🔧 Troubleshooting

### "Failed to generate insights"
**Cause**: API key not configured or invalid

**Solution**:
1. Check if `GEMINI_API_KEY` is set in Render environment variables
2. Verify the API key is valid at https://aistudio.google.com/app/apikey
3. Make sure the backend is deployed with the new AI code

### "401 Unauthorized"
**Cause**: Not logged in or token expired

**Solution**:
1. Logout and login again
2. Check if your JWT token is valid

### "No data available"
**Cause**: Not enough booking history

**Solution**:
- The AI needs at least some booking data to analyze
- Add test bookings if you're in development
- Wait for real bookings to accumulate in production

### Button doesn't work
**Cause**: Backend not updated or API key missing

**Solution**:
1. Make sure you've pushed the latest code to GitHub
2. Verify Render has deployed the new backend code
3. Check Render logs for any errors
4. Ensure `GEMINI_API_KEY` is in environment variables

## 📱 Mobile Support

The AI Insights component is fully responsive:
- Works on phones, tablets, and desktops
- Expandable sections save screen space
- Touch-friendly buttons and interactions

## 🔐 Security

- Only Admin and Manager roles can see AI Insights
- All API calls require authentication
- API key is stored securely in environment variables
- Never exposed to the frontend

## 💡 Tips for Best Results

1. **More Data = Better Insights**: The AI analyzes the last 6 months of bookings. More data means more accurate predictions.

2. **Regular Updates**: Generate insights weekly or monthly to track trends over time.

3. **Act on Recommendations**: The AI provides actionable suggestions - implement them to improve revenue!

4. **Compare Predictions**: Save insights and compare them with actual results to see how accurate the AI is.

## 🎯 Use Cases

### Revenue Management
- Use pricing recommendations to optimize room rates
- Identify peak periods to maximize revenue
- Adjust rates based on demand predictions

### Marketing Strategy
- Target specific customer segments
- Plan campaigns around peak periods
- Promote underbooked room types

### Operations Planning
- Staff scheduling based on predicted occupancy
- Inventory management for peak periods
- Maintenance scheduling during low-demand periods

### Business Intelligence
- Track booking trends over time
- Understand customer preferences
- Make data-driven decisions

## 🚀 Future Enhancements

Potential features to add:
- Historical insights comparison
- Export insights as PDF
- Email insights to management
- Scheduled automatic insights generation
- Integration with other AI features (chatbot, sentiment analysis)

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for errors (F12)
2. Check Render logs for backend errors
3. Verify API key is configured correctly
4. Ensure you're logged in as Admin or Manager

---

**Enjoy your AI-powered insights!** 🎉

The AI will help you make smarter decisions about pricing, marketing, and operations based on your actual booking data.
