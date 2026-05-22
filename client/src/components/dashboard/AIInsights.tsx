import { useState } from 'react';
import { Sparkles, TrendingUp, MessageSquare, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AIIcon } from '@/components/icons/AIIcon';
import aiService from '@/services/aiService';
import { useToast } from '@/hooks/useToast';

export const AIInsights = () => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);
  const toast = useToast();

  const generateInsights = async () => {
    setLoading(true);
    try {
      const result = await aiService.predictTrends('30days');
      
      if (result.success) {
        setInsights(result);
        setExpanded(true);
        toast.success('AI insights generated successfully!');
      } else {
        toast.error('Failed to generate insights');
      }
    } catch (error: any) {
      console.error('AI Insights Error:', error);
      toast.error(
        error.response?.data?.message || 'Failed to generate AI insights. Make sure the API key is configured.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (trend: string) => {
    switch (trend?.toLowerCase()) {
      case 'increasing':
        return 'text-green-600 dark:text-green-400';
      case 'decreasing':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 opacity-50" />
      
      {/* Decorative Elements */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gradient-to-tr from-blue-400/20 to-purple-500/20 rounded-full blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <AIIcon size={20} className="text-white" animate={false} />
            </div>
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
                AI Insights
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Powered by Google Gemini
              </p>
            </div>
          </div>

          <Button
            onClick={generateInsights}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Insights
              </>
            )}
          </Button>
        </div>

        {/* Insights Display */}
        {insights && (
          <div className="space-y-4 mt-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-medium text-gray-600 dark:text-slate-300">Trend</span>
                </div>
                <p className={`text-lg font-bold capitalize ${getSentimentColor(insights.predictions.trend)}`}>
                  {insights.predictions.trend || 'Stable'}
                </p>
              </div>

              <div className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-medium text-gray-600 dark:text-slate-300">Data Points</span>
                </div>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {insights.dataPoints}
                </p>
              </div>

              <div className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-lg p-3 border border-pink-200 dark:border-pink-800">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                  <span className="text-xs font-medium text-gray-600 dark:text-slate-300">Occupancy</span>
                </div>
                <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
                  {insights.currentOccupancy.occupied}/{insights.currentOccupancy.total}
                </p>
              </div>
            </div>

            {/* Expandable Details */}
            <div className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-slate-600">
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
              >
                <span className="font-semibold text-gray-800 dark:text-white">
                  Detailed Analysis
                </span>
                {expanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {expanded && (
                <div className="p-4 pt-0 space-y-4 text-sm">
                  {/* Peak Periods */}
                  {insights.predictions.peakPeriods && insights.predictions.peakPeriods.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                        📅 Peak Booking Periods
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-slate-300">
                        {insights.predictions.peakPeriods.map((period: string, idx: number) => (
                          <li key={idx}>{period}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Room Preferences */}
                  {insights.predictions.roomTypePreferences && (
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                        🏨 Room Type Preferences
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(insights.predictions.roomTypePreferences).map(([type, percentage]) => (
                          <div key={type} className="bg-gray-50 dark:bg-slate-600 rounded p-2">
                            <span className="text-gray-600 dark:text-slate-300">{type}:</span>
                            <span className="font-semibold text-gray-800 dark:text-white ml-2">{String(percentage)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Revenue Prediction */}
                  {insights.predictions.revenuePrediction && (
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                        💰 Revenue Forecast
                      </h4>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded p-3">
                        <p className="text-gray-700 dark:text-slate-200">
                          <span className="font-semibold">Next 30 days:</span>{' '}
                          {insights.predictions.revenuePrediction.next30days}
                        </p>
                        {insights.predictions.revenuePrediction.confidence && (
                          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                            Confidence: {insights.predictions.revenuePrediction.confidence}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Pricing Recommendations */}
                  {insights.predictions.pricingRecommendations && insights.predictions.pricingRecommendations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                        💡 Pricing Recommendations
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-slate-300">
                        {insights.predictions.pricingRecommendations.map((rec: string, idx: number) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Marketing Suggestions */}
                  {insights.predictions.marketingSuggestions && insights.predictions.marketingSuggestions.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                        🎯 Marketing Suggestions
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-slate-300">
                        {insights.predictions.marketingSuggestions.map((sug: string, idx: number) => (
                          <li key={idx}>{sug}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Summary */}
                  {insights.predictions.summary && (
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                        📊 Summary
                      </h4>
                      <p className="text-gray-600 dark:text-slate-300 whitespace-pre-wrap">
                        {insights.predictions.summary}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!insights && !loading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-4">
              <AIIcon size={32} className="text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-gray-600 dark:text-slate-300 mb-2">
              No insights generated yet
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Click "Generate Insights" to analyze booking trends and get AI-powered recommendations
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AIInsights;
