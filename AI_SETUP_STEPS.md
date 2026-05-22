# AI Features Setup Guide

## ✅ What I've Done

I've integrated the AI features into your main server codebase:

1. ✅ Created `server/src/services/aiService.ts` - AI service implementation
2. ✅ Created `server/src/controllers/aiController.ts` - API endpoint controllers
3. ✅ Created `server/src/routes/aiRoutes.ts` - Route definitions
4. ✅ Updated `server/src/routes/index.ts` - Added AI routes
5. ✅ Updated `server/package.json` - Added @google/generative-ai dependency
6. ✅ Updated `server/.env.example` - Added GEMINI_API_KEY placeholder

## 🔧 What You Need to Do

### Step 1: Install Dependencies

Open terminal in the `server` folder and run:

```bash
cd server
npm install
```

This will install the `@google/generative-ai` package.

### Step 2: Add Your API Key Locally

Create a `.env` file in the `server` folder (if it doesn't exist) and add:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="your_supabase_connection_string"
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173

# AI - Google Gemini API
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Replace `your_actual_gemini_api_key_here` with your real Gemini API key.

### Step 3: Add API Key to Render (Production)

1. Go to https://dashboard.render.com
2. Select your backend service
3. Click on "Environment" tab
4. Add a new environment variable:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Your Gemini API key
5. Click "Save Changes" (this will trigger a redeploy)

### Step 4: Create Database Table for Reviews

Run this SQL in your Supabase SQL Editor:

```sql
-- Create guest_reviews table
CREATE TABLE IF NOT EXISTS guest_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
    review_text TEXT NOT NULL,
    sentiment VARCHAR(20) CHECK (sentiment IN ('Positive', 'Neutral', 'Negative', 'Unknown')),
    sentiment_score INTEGER CHECK (sentiment_score >= 0 AND sentiment_score <= 100),
    analysis JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_guest_reviews_guest ON guest_reviews(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_reviews_sentiment ON guest_reviews(sentiment);
CREATE INDEX IF NOT EXISTS idx_guest_reviews_created ON guest_reviews(created_at DESC);

CREATE TRIGGER update_guest_reviews_updated_at 
BEFORE UPDATE ON guest_reviews 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();
```

### Step 5: Test Locally

Start your server:

```bash
cd server
npm run dev
```

The AI endpoints should now be available at:
- `http://localhost:5000/api/ai/chat`
- `http://localhost:5000/api/ai/recommend-upgrade`
- `http://localhost:5000/api/ai/generate-message`
- `http://localhost:5000/api/ai/analyze-review`
- `http://localhost:5000/api/ai/predict-trends`

### Step 6: Test the API

Use this curl command to test (replace YOUR_TOKEN with your actual JWT token):

```bash
# 1. Login first to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@hotel.com\",\"password\":\"your_password\"}"

# 2. Test AI Chatbot
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"message\":\"What time is breakfast?\"}"
```

## 📱 Frontend Integration

To use AI features in your frontend, create a service file:

```typescript
// client/src/services/aiService.ts
import api from './api';

export const aiService = {
  async chat(message: string, context?: any) {
    const response = await api.post('/ai/chat', { message, context });
    return response.data;
  },

  async getUpgradeRecommendations(guestId: string, currentRoomType: string) {
    const response = await api.post('/ai/recommend-upgrade', {
      guestId,
      currentRoomType
    });
    return response.data;
  },

  async generateMessage(type: string, data: any) {
    const response = await api.post('/ai/generate-message', { type, data });
    return response.data;
  },

  async analyzeReview(review: string, guestId?: string) {
    const response = await api.post('/ai/analyze-review', { review, guestId });
    return response.data;
  },

  async predictTrends(timeframe: string = '30days') {
    const response = await api.get(`/ai/predict-trends?timeframe=${timeframe}`);
    return response.data;
  }
};
```

## 🎯 Available AI Features

### 1. AI Chatbot
- **Endpoint:** `POST /api/ai/chat`
- **Use:** Guest inquiries about hotel services
- **Example:** "What time is check-in?"

### 2. Smart Room Recommendations
- **Endpoint:** `POST /api/ai/recommend-upgrade`
- **Use:** Personalized room upgrade suggestions
- **Example:** Suggest upgrades based on guest history

### 3. Automated Message Generation
- **Endpoint:** `POST /api/ai/generate-message`
- **Types:** welcome, checkout_reminder, payment_reminder, booking_confirmation
- **Use:** Generate professional emails automatically

### 4. Sentiment Analysis
- **Endpoint:** `POST /api/ai/analyze-review`
- **Use:** Analyze guest reviews for sentiment and insights
- **Example:** "Great hotel, loved the service!"

### 5. Predictive Analytics
- **Endpoint:** `GET /api/ai/predict-trends`
- **Use:** Predict booking patterns and revenue
- **Example:** Forecast next 30 days occupancy

## 🚨 Troubleshooting

### "Cannot find module '@google/generative-ai'"
- Run `npm install` in the server folder

### "AI features not working"
- Check if GEMINI_API_KEY is set in your .env file
- Verify the API key is valid at https://aistudio.google.com/app/apikey

### "401 Unauthorized"
- Make sure you're sending the JWT token in the Authorization header
- Format: `Authorization: Bearer YOUR_TOKEN`

### "Database error in sentiment analysis"
- Make sure you've run the SQL script to create the guest_reviews table

## 📚 Full Documentation

See `zen_backend/AI_FEATURES_DOCUMENTATION.md` for complete API documentation with examples.

## ✅ Next Steps

1. Install dependencies (`npm install` in server folder)
2. Add GEMINI_API_KEY to local .env file
3. Add GEMINI_API_KEY to Render environment variables
4. Run the SQL script in Supabase
5. Test the endpoints
6. Create frontend components to use the AI features

---

**Need Help?** Check the full documentation in `zen_backend/AI_FEATURES_DOCUMENTATION.md`
