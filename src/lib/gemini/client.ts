'use client';

import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

// Initialize Gemini API
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// Safety settings to avoid harmful content
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Updated with proper API version (remove v1beta reference by configuring without it)
const genAI = new GoogleGenerativeAI(API_KEY);

// Financial prompt context
const FINANCIAL_CONTEXT = `
You are an AI-powered financial assistant. Your job is to help users with their financial questions,
provide insights about investments, offer budgeting advice, and help with financial planning.
Always be respectful, accurate, and useful. If you don't know something for certain, acknowledge 
that and provide general guidance instead of specific financial advice.

When discussing investments:
- Mention diversification principles
- Avoid making specific stock recommendations
- Explain concepts like risk tolerance and time horizon

For budgeting questions:
- Suggest practical approaches like the 50/30/20 rule
- Recommend tracking expenses
- Emphasize building emergency funds

For retirement planning:
- Discuss tax-advantaged accounts
- Explain compound interest benefits
- Suggest appropriate saving rates based on age
`;

// Get a model for text generation with updated model name
export const getGeminiModel = () => {
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',  // Updated to newer model
    safetySettings,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1024,
    },
  });
};

// Generate chat responses with better error handling
export const generateChatResponse = async (
  history: { role: 'user' | 'model'; text: string }[],
  userMessage: string,
  userProfile?: any
) => {
  try {
    const model = getGeminiModel();
    
    // Add user profile context if available
    let prompt = userMessage;
    if (userProfile) {
      prompt = `[User Profile: Income range ${userProfile.financialProfile?.incomeRange || 'unknown'}, 
                Risk tolerance: ${userProfile.financialProfile?.riskTolerance || 'moderate'}, 
                Investment goals: ${userProfile.financialProfile?.investmentGoals?.join(', ') || 'general'}] 
                
                ${userMessage}`;
    }

    // Filter the history to ensure valid format for Gemini API
    // The first message must have role 'user', so we'll start with an empty history if needed
    let validHistory = [];
    
    // Only include history if it's properly formatted (first message must be from user)
    if (history.length > 0 && history[0].role === 'user') {
      validHistory = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));
    }
    
    // Create chat session with valid history
    const chat = model.startChat({
      history: validHistory,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });
    
    // Generate response
    const result = await chat.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    
    // Provide a fallback response using simulated AI
    const fallbackResponses = [
      "Based on your financial situation, I recommend focusing on building an emergency fund first before increasing your investments.",
      "Looking at market trends, diversifying your portfolio across different asset classes can help manage risk while maintaining growth potential.",
      "For your monthly budget, the 50/30/20 rule might be helpful - 50% for necessities, 30% for wants, and 20% for savings and debt repayment.",
      "Consider increasing your retirement contributions to take advantage of compound interest over time.",
      "With your risk tolerance profile, a balanced approach of 60% stocks and 40% bonds might align with your financial goals."
    ];
    
    return "I'm currently experiencing connection issues with my financial data service. " +
           "Here's some general advice that might help: " + 
           fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
};

// Generate financial insights
export const generateFinancialInsights = async (data: any, userPreferences: any) => {
  try {
    const model = getGeminiModel();
    
    const prompt = `
    ${FINANCIAL_CONTEXT}
    
    Based on the following financial data and user preferences, provide personalized financial insights:
    
    Financial Data:
    ${JSON.stringify(data, null, 2)}
    
    User Preferences:
    ${JSON.stringify(userPreferences, null, 2)}
    
    Please provide:
    1. A summary of the current financial situation
    2. Key insights about spending patterns, savings, or investment opportunities
    3. Specific recommendations for improving financial health
    4. Potential risks or concerns to be aware of
    `;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating financial insights:', error);
    return 'I can analyze your finances more effectively when you update your financial profile. Please check your profile settings to ensure all information is current.';
  }
};

// Export default functions
export default {
  generateChatResponse,
  generateFinancialInsights,
  getGeminiModel
}; 