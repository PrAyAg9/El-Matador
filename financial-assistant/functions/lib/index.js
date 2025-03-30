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
exports.updateFinancialProfile = exports.getFinancialNews = exports.getMarketData = exports.getPortfolioData = exports.generateChatResponse = exports.generateFinancialInsights = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const ai_service_1 = require("./services/ai-service");
const financial_service_1 = require("./services/financial-service");
// Initialize Firebase Admin
admin.initializeApp();
// Reference to Firestore
const db = admin.firestore();
// Safe type-checking functions
function hasAuth(context) {
    return context && context.auth && typeof context.auth.uid === 'string';
}
function hasPortfolioData(data) {
    return data && typeof data.portfolioData === 'object' && typeof data.userPreferences === 'object';
}
function hasChatData(data) {
    return data && Array.isArray(data.history) && typeof data.newMessage === 'string';
}
function hasFinancialProfile(data) {
    return data && typeof data.financialProfile === 'object';
}
/**
 * Generate AI-powered financial insights based on user data
 */
exports.generateFinancialInsights = functions.https.onCall(async (data, context) => {
    // Ensure user is authenticated
    if (!hasAuth(context)) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use this feature.');
    }
    // Validate data
    if (!hasPortfolioData(data)) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required portfolio data and user preferences.');
    }
    try {
        const { portfolioData, userPreferences } = data;
        // Generate insights using the AI service
        const insights = await ai_service_1.aiService.generateFinancialInsights(portfolioData, userPreferences);
        // Store the insights in Firestore for future reference
        await db.collection('users').doc(context.auth.uid).collection('insights').add({
            content: insights,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            portfolioData,
            userPreferences
        });
        return { insights };
    }
    catch (error) {
        console.error('Error generating financial insights:', error);
        throw new functions.https.HttpsError('internal', 'Failed to generate financial insights. Please try again later.');
    }
});
/**
 * Generate a response to user's financial questions using AI
 */
exports.generateChatResponse = functions.https.onCall(async (data, context) => {
    // Ensure user is authenticated
    if (!hasAuth(context)) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use this feature.');
    }
    // Validate data
    if (!hasChatData(data)) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required chat history and message.');
    }
    try {
        const { history, newMessage } = data;
        // Get user data for context
        const userDoc = await db.collection('users').doc(context.auth.uid).get();
        const userData = userDoc.data();
        // Generate response using the AI service
        const response = await ai_service_1.aiService.generateChatResponse(history, newMessage, userData);
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
    }
    catch (error) {
        console.error('Error generating chat response:', error);
        throw new functions.https.HttpsError('internal', 'Failed to generate response. Please try again later.');
    }
});
/**
 * Fetch user's portfolio data from financial service
 */
exports.getPortfolioData = functions.https.onCall(async (data, context) => {
    // Ensure user is authenticated
    if (!hasAuth(context)) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use this feature.');
    }
    try {
        // For the free tier, we'll use mock data
        // In production, this would connect to real financial data sources
        const portfolioData = await financial_service_1.financialService.getPortfolioData(context.auth.uid);
        return { portfolioData };
    }
    catch (error) {
        console.error('Error fetching portfolio data:', error);
        throw new functions.https.HttpsError('internal', 'Failed to fetch portfolio data. Please try again later.');
    }
});
/**
 * Get latest market data
 */
exports.getMarketData = functions.https.onCall(async (data, context) => {
    // Ensure user is authenticated
    if (!hasAuth(context)) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use this feature.');
    }
    try {
        // For the free tier, we'll use mock data
        // In production, this would connect to real financial data sources
        const marketData = await financial_service_1.financialService.getMarketData();
        return { marketData };
    }
    catch (error) {
        console.error('Error fetching market data:', error);
        throw new functions.https.HttpsError('internal', 'Failed to fetch market data. Please try again later.');
    }
});
/**
 * Get financial news
 */
exports.getFinancialNews = functions.https.onCall(async (data, context) => {
    // Ensure user is authenticated
    if (!hasAuth(context)) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use this feature.');
    }
    try {
        // For the free tier, we'll use mock data
        // In production, this would connect to real financial news sources
        const news = await financial_service_1.financialService.getFinancialNews();
        return { news };
    }
    catch (error) {
        console.error('Error fetching financial news:', error);
        throw new functions.https.HttpsError('internal', 'Failed to fetch financial news. Please try again later.');
    }
});
/**
 * Update user's financial profile
 */
exports.updateFinancialProfile = functions.https.onCall(async (data, context) => {
    // Ensure user is authenticated
    if (!hasAuth(context)) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use this feature.');
    }
    // Validate data
    if (!hasFinancialProfile(data)) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required financial profile data.');
    }
    try {
        const { financialProfile } = data;
        // Update user's financial profile in Firestore
        await db.collection('users').doc(context.auth.uid).update({
            financialProfile,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error updating financial profile:', error);
        throw new functions.https.HttpsError('internal', 'Failed to update financial profile. Please try again later.');
    }
});
//# sourceMappingURL=index.js.map