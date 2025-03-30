import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { aiService } from './services/ai-service';
import { financialService } from './services/financial-service';

// Initialize Firebase Admin
admin.initializeApp();

// Reference to Firestore
const db = admin.firestore();

// Define types for better type safety
interface PortfolioData {
  assets?: any[];
  balances?: Record<string, number>;
  performance?: Record<string, number>;
}

interface UserPreferences {
  riskLevel?: 'low' | 'medium' | 'high';
  investmentGoals?: string[];
  notifications?: boolean;
}

interface ChatMessage {
  message: string;
  response: string;
  timestamp: admin.firestore.Timestamp;
}

interface FinancialProfile {
  incomeRange?: string;
  investmentGoals?: string[];
  riskTolerance?: 'low' | 'medium' | 'high';
}

interface MarketData {
  // Market data interface
  indices?: Record<string, number>;
  trends?: Record<string, string>;
  timestamp?: Date;
}

interface FinancialNews {
  // Financial news interface
  articles?: {
    title: string;
    url: string;
    source: string;
    date: string;
  }[];
}

// Safe type-checking functions
function hasAuth(context: any): context is { auth: { uid: string } } {
  return context && context.auth && typeof context.auth.uid === 'string';
}

function hasPortfolioData(data: any): data is { portfolioData: any; userPreferences: any } {
  return data && typeof data.portfolioData === 'object' && typeof data.userPreferences === 'object';
}

function hasChatData(data: any): data is { history: any[]; newMessage: string } {
  return data && Array.isArray(data.history) && typeof data.newMessage === 'string';
}

function hasFinancialProfile(data: any): data is { financialProfile: any } {
  return data && typeof data.financialProfile === 'object';
}

/**
 * Generate AI-powered financial insights based on user data
 */
export const generateFinancialInsights = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!hasAuth(context)) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to use this feature.'
    );
  }

  // Validate data
  if (!hasPortfolioData(data)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required portfolio data and user preferences.'
    );
  }

  try {
    const { portfolioData, userPreferences } = data;
    
    // Generate insights using the AI service
    const insights = await aiService.generateFinancialInsights(portfolioData, userPreferences);
    
    // Store the insights in Firestore for future reference
    await db.collection('users').doc(context.auth.uid).collection('insights').add({
      content: insights,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      portfolioData,
      userPreferences
    });
    
    return { insights };
  } catch (error) {
    console.error('Error generating financial insights:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to generate financial insights. Please try again later.'
    );
  }
});

/**
 * Generate a response to user's financial questions using AI
 */
export const generateChatResponse = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!hasAuth(context)) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to use this feature.'
    );
  }
  
  // Validate data
  if (!hasChatData(data)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required chat history and message.'
    );
  }
  
  try {
    const { history, newMessage } = data;
    
    // Get user data for context
    const userDoc = await db.collection('users').doc(context.auth.uid).get();
    const userData = userDoc.data();
    
    // Generate response using the AI service
    const response = await aiService.generateChatResponse(history, newMessage, userData);
    
    // Store chat history for future reference
    await db.collection('users')
      .doc(context.auth.uid)
      .collection('chatHistory')
      .add({
        message: newMessage,
        response,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    
    return { response };
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to generate response. Please try again later.'
    );
  }
});

/**
 * Fetch user's portfolio data from financial service
 */
export const getPortfolioData = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!hasAuth(context)) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to use this feature.'
    );
  }
  
  try {
    // For the free tier, we'll use mock data
    // In production, this would connect to real financial data sources
    const portfolioData = await financialService.getPortfolioData(context.auth.uid);
    
    return { portfolioData };
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to fetch portfolio data. Please try again later.'
    );
  }
});

/**
 * Get latest market data
 */
export const getMarketData = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!hasAuth(context)) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to use this feature.'
    );
  }
  
  try {
    // For the free tier, we'll use mock data
    // In production, this would connect to real financial data sources
    const marketData = await financialService.getMarketData();
    
    return { marketData };
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to fetch market data. Please try again later.'
    );
  }
});

/**
 * Get financial news
 */
export const getFinancialNews = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!hasAuth(context)) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to use this feature.'
    );
  }
  
  try {
    // For the free tier, we'll use mock data
    // In production, this would connect to real financial news sources
    const news = await financialService.getFinancialNews();
    
    return { news };
  } catch (error) {
    console.error('Error fetching financial news:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to fetch financial news. Please try again later.'
    );
  }
});

/**
 * Update user's financial profile
 */
export const updateFinancialProfile = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!hasAuth(context)) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to use this feature.'
    );
  }
  
  // Validate data
  if (!hasFinancialProfile(data)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required financial profile data.'
    );
  }
  
  try {
    const { financialProfile } = data;
    
    // Update user's financial profile in Firestore
    await db.collection('users').doc(context.auth.uid).update({
      financialProfile,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating financial profile:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to update financial profile. Please try again later.'
    );
  }
}); 