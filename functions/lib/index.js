"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFinancialNews = exports.getMarketData = exports.getPortfolioData = exports.generateChatResponse = exports.generateFinancialInsights = exports.updateFinancialProfile = exports.processAiQuery = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const ai_service_1 = require("./services/ai-service");
const financial_service_1 = require("./services/financial-service");
// Initialize Firebase Admin
admin.initializeApp();
// Reference to Firestore (will be used by other modules)
const firestore = admin.firestore();
/**
 * Process AI query
 */
exports.processAiQuery = functions.https.onCall(async (data, context) => {
    // Check authentication
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to use this feature.');
    }
    try {
        return await ai_service_1.aiService.processQuery(data.query, context.auth.uid);
    }
    catch (error) {
        console.error('Error processing AI query:', error);
        throw new functions.https.HttpsError('internal', 'Error processing AI query');
    }
});
/**
 * Update financial profile
 */
exports.updateFinancialProfile = functions.https.onCall(async (data, context) => {
    // Check authentication
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to use this feature.');
    }
    try {
        return await financial_service_1.financialService.updateProfile(data.profile, context.auth.uid);
    }
    catch (error) {
        console.error('Error updating financial profile:', error);
        throw new functions.https.HttpsError('internal', 'Error updating financial profile');
    }
});
/**
 * Generate financial insights
 */
exports.generateFinancialInsights = functions.https.onCall(async (data, context) => {
    // Ensure user is authenticated
    if (context && !context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use this feature.');
    }
    try {
        // Using the data directly in aiService call instead of destructuring
        return {
            insights: await ai_service_1.aiService.generateFinancialInsights(data.portfolioData || {}, data.userPreferences || {})
        };
    }
    catch (error) {
        console.error('Error generating financial insights:', error);
        throw new functions.https.HttpsError('internal', 'Failed to generate financial insights. Please try again later.');
    }
});
/**
 * Generate chat response
 */
exports.generateChatResponse = functions.https.onCall(async (data, context) => {
    // Ensure user is authenticated
    if (context && !context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use this feature.');
    }
    try {
        // Get user data from Firestore for context if needed
        let userData = {};
        if (context && context.auth) {
            const userDoc = await firestore.collection('users').doc(context.auth.uid).get();
            if (userDoc.exists) {
                userData = userDoc.data() || {};
            }
        }
        // Using the data directly in aiService call
        const response = await ai_service_1.aiService.generateChatResponse(data.history || [], data.newMessage || '', userData);
        return { response };
    }
    catch (error) {
        console.error('Error generating chat response:', error);
        throw new functions.https.HttpsError('internal', 'Failed to generate response. Please try again later.');
    }
});
/**
 * Get portfolio data
 */
exports.getPortfolioData = functions.https.onCall(async (data, context) => {
    // Ensure user is authenticated
    if (context && !context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use this feature.');
    }
    try {
        // Mock portfolio data
        const portfolioData = await financial_service_1.financialService.getPortfolioData(context && context.auth ? context.auth.uid : '');
        return { portfolioData };
    }
    catch (error) {
        console.error('Error fetching portfolio data:', error);
        throw new functions.https.HttpsError('internal', 'Failed to fetch portfolio data. Please try again later.');
    }
});
/**
 * Get market data
 */
exports.getMarketData = functions.https.onCall(async (data, context) => {
    // Ensure user is authenticated
    if (context && !context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use this feature.');
    }
    try {
        // Mock market data
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
    if (context && !context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use this feature.');
    }
    try {
        // Mock news data
        const news = await financial_service_1.financialService.getFinancialNews();
        return { news };
    }
    catch (error) {
        console.error('Error fetching financial news:', error);
        throw new functions.https.HttpsError('internal', 'Failed to fetch financial news. Please try again later.');
    }
});
//# sourceMappingURL=index.js.map