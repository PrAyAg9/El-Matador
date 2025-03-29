'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { auth, db, firestore, firestoreDb } from '@/lib/firebase/config';
import { UserData } from '@/lib/firebase/auth';
import { firebaseFunctions } from '@/lib/firebase/functions';

// Import functions directly from Firestore
import { 
  doc, 
  getDoc as getFirestoreDoc, 
  setDoc as setFirestoreDoc 
} from 'firebase/firestore';

// Use real Firestore functions when available
const getDoc = firestore ? getFirestoreDoc : firestore.getDoc;
const setDoc = firestore ? setFirestoreDoc : firestore.setDoc;

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  user: UserData | null;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isTestUser: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
  loading: true,
  user: null,
  logout: async () => {},
  isAuthenticated: false,
  isTestUser: false
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTestUser, setIsTestUser] = useState(false);

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserData(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get data from localStorage if available
  const getLocalUserData = (userId: string): UserData | null => {
    if (typeof window !== 'undefined') {
      try {
        // Try to get financial profile first
        const financialProfileString = localStorage.getItem('userFinancialProfile');
        if (financialProfileString) {
          const financialProfile = JSON.parse(financialProfileString);
          return {
            uid: userId,
            email: currentUser?.email || '',
            displayName: currentUser?.displayName || financialProfile.name || '',
            photoURL: currentUser?.photoURL || '',
            createdAt: new Date(),
            lastLogin: new Date(),
            financialProfile: financialProfile
          };
        }

        // Try backup userData
        const userDataString = localStorage.getItem('userData_' + userId);
        if (userDataString) {
          return JSON.parse(userDataString);
        }
      } catch (error) {
        console.warn('Error parsing local user data:', error);
      }
    }
    return null;
  };

  // Create a default user document if none exists
  const createDefaultUserDocument = async (user: User): Promise<UserData> => {
    const defaultUserData: UserData = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: new Date(),
      lastLogin: new Date(),
      preferences: {
        theme: 'dark',
        notifications: true,
      },
      financialProfile: {
        incomeRange: '50k-100k',
        investmentGoals: ['retirement', 'wealth'],
        riskTolerance: 'medium',
      }
    };
    
    try {
      // Save to localStorage for offline/permissions fallback
      if (typeof window !== 'undefined') {
        localStorage.setItem('userData_' + user.uid, JSON.stringify(defaultUserData));
      }

      // Try to save to Firestore
      try {
        const userDocRef = firestore.doc(firestoreDb || db, 'users', user.uid);
        await firestore.setDoc(userDocRef, defaultUserData);
        console.log('Created default user document in Firestore');
      } catch (firestoreError) {
        console.warn('Could not save to Firestore, using localStorage instead:', firestoreError);
        // Already saved to localStorage, so we can continue
      }
    } catch (error) {
      console.error('Error creating default user document:', error);
    }
    
    return defaultUserData;
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Check if this is a test user from localStorage before auth state changes
    if (typeof window !== 'undefined') {
      const bypassAuth = localStorage.getItem('bypassAuth');
      if (bypassAuth === 'true') {
        console.log('Test user detected from localStorage');
        setIsTestUser(true);
        
        // Get test user data if available
        const testUserData = localStorage.getItem('testUser');
        if (testUserData) {
          try {
            const parsedUser = JSON.parse(testUserData);
            
            // Check for financial profile in localStorage first
            const localFinancialProfile = firebaseFunctions.getFinancialProfileData(parsedUser.uid);

            // Set up basic user data for test user
            const testUserProfile: UserData = {
              uid: parsedUser.uid,
              email: parsedUser.email,
              displayName: parsedUser.displayName,
              photoURL: parsedUser.photoURL,
              createdAt: new Date(),
              lastLogin: new Date(),
              preferences: {
                theme: 'dark',
                notifications: true,
              },
              financialProfile: localFinancialProfile || {
                incomeRange: '50k-100k',
                investmentGoals: ['retirement', 'wealth'],
                riskTolerance: 'medium',
              }
            };
            
            setUserData(testUserProfile);
            setCurrentUser(parsedUser as any);
            setLoading(false);
          } catch (error) {
            console.error('Error parsing test user data:', error);
          }
        }
      }
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? `User: ${user.uid}` : 'No user');
      
      // Don't override the currentUser if we're in test mode
      if (!isTestUser) {
        setCurrentUser(user);
        
        // Check if this is a test user - safely access localStorage
        if (typeof window !== 'undefined') {
          const bypassAuth = localStorage.getItem('bypassAuth');
          if (bypassAuth === 'true') {
            console.log('Test user detected');
            setIsTestUser(true);
          } else {
            setIsTestUser(false);
          }
        }
        
        if (user) {
          try {
            // First check if we have data in localStorage
            const localUserData = getLocalUserData(user.uid);
            
            // Try to get from Firestore if no localStorage data
            if (!localUserData) {
              try {
                // Get user data from Firestore
                const userDocRef = firestore.doc(firestoreDb || db, 'users', user.uid);
                const userDoc = await firestore.getDoc(userDocRef);
                
                if (userDoc.exists()) {
                  console.log('User document found in Firestore');
                  const data = userDoc.data();
                  
                  // Update localStorage with latest Firestore data
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('userData_' + user.uid, JSON.stringify(data));
                  }
                  
                  setUserData(data);
                } else {
                  console.log('No user document found, creating default');
                  const newUserData = await createDefaultUserDocument(user);
                  setUserData(newUserData);
                }
              } catch (firestoreError: any) {
                console.warn('Firestore error:', firestoreError);
                
                // Check if this is a permissions error
                if (firestoreError.code === 'permission-denied') {
                  console.log('Firestore permissions error, using default data');
                  // Create and use default data if we couldn't read from Firestore
                  const newUserData = await createDefaultUserDocument(user);
                  setUserData(newUserData);
                } else {
                  // For other errors, create a fallback local user
                  const fallbackUserData: UserData = {
                    uid: user.uid,
                    email: user.email || '',
                    displayName: user.displayName || '',
                    photoURL: user.photoURL || '',
                    createdAt: new Date(),
                    lastLogin: new Date()
                  };
                  
                  // Try to get local financial profile to merge with fallback
                  const localProfile = firebaseFunctions.getFinancialProfileData(user.uid);
                  if (localProfile) {
                    fallbackUserData.financialProfile = localProfile;
                  }
                  
                  setUserData(fallbackUserData);
                }
              }
            } else {
              // Use the data from localStorage
              console.log('Using cached user data from localStorage');
              setUserData(localUserData);
            }
          } catch (error) {
            console.error('Error in auth flow:', error);
            // Create minimal fallback user data if everything else fails
            const minimalUserData: UserData = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || '',
              photoURL: user.photoURL || '',
              createdAt: new Date(),
              lastLogin: new Date()
            };
            setUserData(minimalUserData);
          }
        } else {
          setUserData(null);
        }
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [isTestUser]);

  const value = {
    currentUser,
    userData,
    loading,
    user: userData,
    logout,
    isAuthenticated: !!currentUser,
    isTestUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 