import { GoogleGenerativeAI } from '@google/generative-ai';
import * as functions from 'firebase-functions';

// Interfaces for chat messages
interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

// Initialize the Gemini API client with API key from environment
const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY || functions.config().gemini?.key;
  
  if (!apiKey) {
    throw new Error('Gemini API key is not configured');
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
};

/**
 * AI Service for financial assistant
 * Handles all AI-powered features
 */

// Mock implementation for demo purposes
export const aiService = {
  /**
   * Generate financial insights based on portfolio data
   */
  generateFinancialInsights: async (portfolioData: any, userPreferences: any) => {
    // This would integrate with a real AI service in production
    console.log('Generating insights for portfolio:', portfolioData.id);
    
    // Sample insights based on risk profile
    const riskProfile = userPreferences?.riskTolerance || 'moderate';
    
    const insights = {
      summary: `Your portfolio is aligned with a ${riskProfile} risk profile.`,
      recommendations: [
        "Consider increasing your emergency fund allocation",
        "Your retirement contributions are on track",
        "Diversification across sectors looks appropriate"
      ],
      analysis: {
        strengths: ["Balanced asset allocation", "Regular contributions"],
        weaknesses: ["Limited international exposure", "High cash position"],
        opportunities: ["Consider tax-advantaged accounts", "Review fee structures"]
      }
    };
    
    return insights;
  },
  
  /**
   * Generate chat response to user query
   */
  generateChatResponse: async (history: any[], newMessage: string, userData: any) => {
    console.log('Generating response to:', newMessage);
    
    // Simple response logic based on keywords
    const lowerMessage = newMessage.toLowerCase();
    
    if (lowerMessage.includes('invest') || lowerMessage.includes('stock')) {
      return `Based on your ${userData?.financialProfile?.riskTolerance || 'moderate'} risk profile, I recommend focusing on a diversified portfolio with a mix of stocks and bonds. Would you like specific investment recommendations?`;
    }
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('spend')) {
      return `Looking at your financial profile, you might consider allocating 50% to essentials, 30% to savings/investments, and 20% to discretionary spending. Would you like help creating a detailed budget?`;
    }
    
    if (lowerMessage.includes('retirement') || lowerMessage.includes('401k')) {
      return `Retirement planning is essential. With your current profile, you should aim to save at least 15% of your income for retirement. Have you maxed out your 401(k) contributions this year?`;
    }
    
    // Default response
    return `I understand you're asking about "${newMessage}". To provide the most relevant advice, could you share more details about your specific financial goals?`;
  },
  
  /**
   * Generate a response for a chat message
   */
  async generateChatResponseFromGemini(
    history: ChatMessage[],
    newMessage: string,
    userData?: any
  ): Promise<string> {
    try {
      const model = getGeminiModel();
      
      // Create system prompt with user context if available
      let systemPrompt = `You are an AI-powered financial advisor assistant. Provide helpful, accurate financial advice and insights.`;
      
      if (userData) {
        systemPrompt += `\n\nUser Information:
- Risk Tolerance: ${userData.financialProfile?.riskTolerance || 'Unknown'}
- Investment Goals: ${userData.financialProfile?.investmentGoals?.join(', ') || 'Unknown'}
- Income Range: ${userData.financialProfile?.incomeRange || 'Unknown'}

Please provide personalized advice based on this information when relevant.`;
      }
      
      // Convert history to the format expected by Gemini
      const chatHistory = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));
      
      // Start chat with system prompt
      const chat = model.startChat({
        history: [
          {
            role: 'model',
            parts: [{ text: systemPrompt }]
          },
          ...chatHistory
        ],
      });
      
      const result = await chat.sendMessage(newMessage);
      return result.response.text();
    } catch (error) {
      console.error('Error generating chat response from Gemini:', error);
      throw error;
    }
  },
  
  /**
   * Generate investment recommendations based on user risk profile and market conditions
   */
  async generateInvestmentRecommendations(
    riskProfile: string,
    currentInvestments: any[],
    marketConditions: any
  ): Promise<string> {
    try {
      const model = getGeminiModel();
      
      const prompt = `
        Generate personalized investment recommendations based on the following information:
        
        Risk Profile: ${riskProfile}
        
        Current Investments:
        ${JSON.stringify(currentInvestments, null, 2)}
        
        Market Conditions:
        ${JSON.stringify(marketConditions, null, 2)}
        
        Please provide:
        1. Portfolio allocation recommendations (e.g., stocks, bonds, cash)
        2. Specific investment ideas aligned with the risk profile
        3. Rebalancing suggestions for the existing portfolio
        4. Considerations for current market conditions
      `;
      
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error generating investment recommendations from Gemini:', error);
      throw error;
    }
  }
}; 