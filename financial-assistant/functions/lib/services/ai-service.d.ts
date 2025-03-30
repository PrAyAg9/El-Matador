interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}
/**
 * AI Service for financial assistant
 * Handles all AI-powered features
 */
export declare const aiService: {
    /**
     * Generate financial insights based on portfolio data
     */
    generateFinancialInsights: (portfolioData: any, userPreferences: any) => Promise<{
        summary: string;
        recommendations: string[];
        analysis: {
            strengths: string[];
            weaknesses: string[];
            opportunities: string[];
        };
    }>;
    /**
     * Generate chat response to user query
     */
    generateChatResponse: (history: any[], newMessage: string, userData: any) => Promise<string>;
    /**
     * Generate a response for a chat message
     */
    generateChatResponseFromGemini(history: ChatMessage[], newMessage: string, userData?: any): Promise<string>;
    /**
     * Generate investment recommendations based on user risk profile and market conditions
     */
    generateInvestmentRecommendations(riskProfile: string, currentInvestments: any[], marketConditions: any): Promise<string>;
};
export {};
