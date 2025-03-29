'use client';

import { httpsCallable, getFunctions } from 'firebase/functions';
import { functions } from './config';

// Interface for chat messages
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

/**
 * Client-side service for calling Firebase Functions
 */
export const firebaseFunctions = {
  /**
   * Call the generateFinancialInsights function
   */
  async generateFinancialInsights(portfolioData: any, userPreferences: any): Promise<string> {
    try {
      const generateInsightsFunction = httpsCallable(functions, 'generateFinancialInsights');
      const result = await generateInsightsFunction({ portfolioData, userPreferences });
      return (result.data as any).insights;
    } catch (error) {
      console.error('Error calling generateFinancialInsights function:', error);
      throw error;
    }
  },
  
  /**
   * Call the generateChatResponse function
   */
  async generateChatResponse(history: ChatMessage[], newMessage: string): Promise<string> {
    try {
      const generateResponseFunction = httpsCallable(functions, 'generateChatResponse');
      const result = await generateResponseFunction({ history, newMessage });
      return (result.data as any).response;
    } catch (error) {
      console.error('Error calling generateChatResponse function:', error);
      throw error;
    }
  },
  
  /**
   * Call the getPortfolioData function
   */
  async getPortfolioData(): Promise<any> {
    try {
      const getPortfolioFunction = httpsCallable(functions, 'getPortfolioData');
      const result = await getPortfolioFunction({});
      return (result.data as any).portfolioData;
    } catch (error) {
      console.error('Error calling getPortfolioData function:', error);
      throw error;
    }
  },
  
  /**
   * Call the getMarketData function
   */
  async getMarketData(): Promise<any> {
    try {
      const getMarketDataFunction = httpsCallable(functions, 'getMarketData');
      const result = await getMarketDataFunction({});
      return (result.data as any).marketData;
    } catch (error) {
      console.error('Error calling getMarketData function:', error);
      throw error;
    }
  },
  
  /**
   * Call the getFinancialNews function
   */
  async getFinancialNews(): Promise<any> {
    try {
      const getNewsFunction = httpsCallable(functions, 'getFinancialNews');
      const result = await getNewsFunction({});
      return (result.data as any).news;
    } catch (error) {
      console.error('Error calling getFinancialNews function:', error);
      throw error;
    }
  },
  
  /**
   * Call the updateFinancialProfile function
   */
  async updateFinancialProfile(financialProfile: any): Promise<boolean> {
    try {
      const updateProfileFunction = httpsCallable(functions, 'updateFinancialProfile');
      const result = await updateProfileFunction({ financialProfile });
      return (result.data as any).success;
    } catch (error) {
      console.error('Error calling updateFinancialProfile function:', error);
      throw error;
    }
  }
}; 