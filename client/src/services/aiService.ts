import api from './api';

export interface ChatResponse {
  success: boolean;
  message: string;
}

export interface UpgradeRecommendation {
  success: boolean;
  recommendations: string;
  availableRooms: any[];
}

export interface MessageGeneration {
  success: boolean;
  message: string;
  type: string;
}

export interface SentimentAnalysis {
  success: boolean;
  analysis: {
    sentiment: string;
    score: number;
    topics?: any;
    actionItems?: string[];
    summary: string;
  };
}

export interface PredictiveTrends {
  success: boolean;
  predictions: {
    trend: string;
    peakPeriods?: string[];
    roomTypePreferences?: any;
    revenuePrediction?: any;
    pricingRecommendations?: string[];
    marketingSuggestions?: string[];
    summary?: string;
  };
  dataPoints: number;
  currentOccupancy: {
    occupied: number;
    total: number;
  };
}

export const aiService = {
  /**
   * AI Chatbot - Ask questions about hotel services
   */
  async chat(message: string, context?: any): Promise<ChatResponse> {
    const response = await api.post('/ai/chat', { message, context });
    return response.data;
  },

  /**
   * Get personalized room upgrade recommendations
   */
  async getUpgradeRecommendations(
    guestId: string,
    currentRoomType: string
  ): Promise<UpgradeRecommendation> {
    const response = await api.post('/ai/recommend-upgrade', {
      guestId,
      currentRoomType,
    });
    return response.data;
  },

  /**
   * Generate automated messages
   * Types: welcome, checkout_reminder, payment_reminder, booking_confirmation
   */
  async generateMessage(type: string, data: any): Promise<MessageGeneration> {
    const response = await api.post('/ai/generate-message', { type, data });
    return response.data;
  },

  /**
   * Analyze guest review sentiment
   */
  async analyzeReview(review: string, guestId?: string): Promise<SentimentAnalysis> {
    const response = await api.post('/ai/analyze-review', { review, guestId });
    return response.data;
  },

  /**
   * Get predictive analytics and trends
   * Timeframe: 30days, 60days, 90days
   */
  async predictTrends(timeframe: string = '30days'): Promise<PredictiveTrends> {
    const response = await api.get(`/ai/predict-trends?timeframe=${timeframe}`);
    return response.data;
  },
};

export default aiService;
