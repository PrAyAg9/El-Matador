'use client';

import { httpsCallable, getFunctions } from 'firebase/functions';
import { functions, firestore, firestoreDb } from './config';
import { collection, getDocs } from 'firebase/firestore';

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
    if (!functions) {
      return "Firebase Functions not available. Please try again later.";
    }
    
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
    if (!functions) {
      return "Firebase Functions not available. Please try again later.";
    }
    
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
    if (!functions) {
      return { error: "Firebase Functions not available" };
    }
    
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
    if (!functions) {
      return { error: "Firebase Functions not available" };
    }
    
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
    if (!functions) {
      return { error: "Firebase Functions not available" };
    }
    
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
    if (!functions) {
      return false;
    }
    
    try {
      const updateProfileFunction = httpsCallable(functions, 'updateFinancialProfile');
      const result = await updateProfileFunction({ financialProfile });
      return (result.data as any).success;
    } catch (error) {
      console.error('Error calling updateFinancialProfile function:', error);
      throw error;
    }
  },
  
  /**
   * Update user's El Matador financial profile
   */
  async updateElMatadorProfile(userId: string, profileData: any): Promise<boolean> {
    try {
      // Always save to localStorage as a backup
      if (typeof window !== 'undefined') {
        localStorage.setItem('userFinancialProfile', JSON.stringify(profileData));
        console.log('Saved profile data to localStorage as backup');
      }
      
      // If this is a test user, just mock the save
      const bypassAuth = typeof window !== 'undefined' ? localStorage.getItem('bypassAuth') : null;
      if (bypassAuth === 'true') {
        console.log('Mock saving El Matador profile for test user:', profileData);
        return true;
      }
      
      // Check if Firestore is available
      if (!firestoreDb) {
        console.log('Firestore not initialized, using localStorage instead');
        return true; // Return success since we saved to localStorage
      }
      
      // Validate userId
      if (!userId) {
        console.error('Invalid user ID provided');
        return true; // Still return true since we saved to localStorage
      }
      
      try {
        // Create a ref to the user document
        const userDocRef = firestore.doc(firestoreDb, 'users', userId);
        
        // Check if user document exists
        const userSnap = await firestore.getDoc(userDocRef);
        
        if (userSnap.exists()) {
          // Update existing document
          await firestore.updateDoc(userDocRef, {
            'financialProfile': profileData,
            'lastUpdated': firestore.serverTimestamp()
          });
        } else {
          // Create new document
          await firestore.setDoc(userDocRef, {
            'uid': userId,
            'financialProfile': profileData,
            'createdAt': firestore.serverTimestamp(),
            'lastUpdated': firestore.serverTimestamp()
          });
        }
        
        console.log('Successfully updated El Matador profile in Firestore');
        return true;
      } catch (error: any) {
        console.error('Error updating El Matador profile:', error);
        
        // Provide more specific error information
        const errorMessage = error.message || 'Unknown database error';
        const errorCode = error.code || 'unknown';
        
        // Log detailed error info for debugging
        console.error(`Firebase error (${errorCode}): ${errorMessage}`);
        
        // For permissions errors, return true since we saved to localStorage
        if (errorCode === 'permission-denied') {
          console.log('Firestore permissions error - using localStorage data');
          return true;
        }
        
        // For any other error, we'll still return true as we saved to localStorage
        if (typeof window !== 'undefined' && localStorage.getItem('userFinancialProfile')) {
          console.log('Using localStorage data due to Firebase error');
          return true;
        }
        
        throw new Error(`Database error (${errorCode}): ${errorMessage}`);
      }
    } catch (error: any) {
      console.error('Error in updateElMatadorProfile:', error);
      
      // If data is in localStorage, consider it a success
      if (typeof window !== 'undefined' && localStorage.getItem('userFinancialProfile')) {
        console.log('Using localStorage data despite error');
        return true;
      }
      
      throw error;
    }
  },
  
  /**
   * Get user's financial profile data (with localStorage fallback)
   */
  getFinancialProfileData(userId: string): any {
    // Try to get from localStorage first
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('userFinancialProfile');
      if (localData) {
        try {
          const profile = JSON.parse(localData);
          
          // If we have a user object, enhance it with the profile
          if (typeof window !== 'undefined') {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            if (currentUser && currentUser.uid === userId) {
              currentUser.financialProfile = profile;
              localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
          }
          
          return profile;
        } catch (e) {
          console.error('Error parsing localStorage data:', e);
        }
      }
    }
    
    // If no localStorage data or error parsing, return null
    // Firebase data would be fetched through the AuthContext
    return null;
  }
}; 