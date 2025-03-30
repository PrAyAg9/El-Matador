import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize admin SDK
admin.initializeApp();

// Example function that responds with a greeting
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from El Matador Financial Assistant!");
});

// Add your AI service here
export const aiService = {
  // Placeholder for future implementation
  generateResponse: async (prompt: string): Promise<string> => {
    return `AI response to: ${prompt}`;
  }
}; 