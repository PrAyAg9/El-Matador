"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const functions = __importStar(require("firebase-functions"));
// Initialize the Gemini API client with API key from environment
const getGeminiModel = () => {
    var _a;
    const apiKey = process.env.GEMINI_API_KEY || ((_a = functions.config().gemini) === null || _a === void 0 ? void 0 : _a.key);
    if (!apiKey) {
        throw new Error('Gemini API key is not configured');
    }
    const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
};
/**
 * AI Service for financial assistant
 * Handles all AI-powered features
 */
// Mock implementation for demo purposes
exports.aiService = {
    /**
     * Generate financial insights based on portfolio data
     */
    generateFinancialInsights: async (portfolioData, userPreferences) => {
        // This would integrate with a real AI service in production
        console.log('Generating insights for portfolio:', portfolioData.id);
        // Sample insights based on risk profile
        const riskProfile = (userPreferences === null || userPreferences === void 0 ? void 0 : userPreferences.riskTolerance) || 'moderate';
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
    generateChatResponse: async (history, newMessage, userData) => {
        var _a;
        console.log('Generating response to:', newMessage);
        // Simple response logic based on keywords
        const lowerMessage = newMessage.toLowerCase();
        if (lowerMessage.includes('invest') || lowerMessage.includes('stock')) {
            return `Based on your ${((_a = userData === null || userData === void 0 ? void 0 : userData.financialProfile) === null || _a === void 0 ? void 0 : _a.riskTolerance) || 'moderate'} risk profile, I recommend focusing on a diversified portfolio with a mix of stocks and bonds. Would you like specific investment recommendations?`;
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
    async generateChatResponseFromGemini(history, newMessage, userData) {
        var _a, _b, _c, _d;
        try {
            const model = getGeminiModel();
            // Create system prompt with user context if available
            let systemPrompt = `You are an AI-powered financial advisor assistant. Provide helpful, accurate financial advice and insights.`;
            if (userData) {
                systemPrompt += `\n\nUser Information:
- Risk Tolerance: ${((_a = userData.financialProfile) === null || _a === void 0 ? void 0 : _a.riskTolerance) || 'Unknown'}
- Investment Goals: ${((_c = (_b = userData.financialProfile) === null || _b === void 0 ? void 0 : _b.investmentGoals) === null || _c === void 0 ? void 0 : _c.join(', ')) || 'Unknown'}
- Income Range: ${((_d = userData.financialProfile) === null || _d === void 0 ? void 0 : _d.incomeRange) || 'Unknown'}

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
        }
        catch (error) {
            console.error('Error generating chat response from Gemini:', error);
            throw error;
        }
    },
    /**
     * Generate investment recommendations based on user risk profile and market conditions
     */
    async generateInvestmentRecommendations(riskProfile, currentInvestments, marketConditions) {
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
        }
        catch (error) {
            console.error('Error generating investment recommendations from Gemini:', error);
            throw error;
        }
    }
};
//# sourceMappingURL=ai-service.js.map