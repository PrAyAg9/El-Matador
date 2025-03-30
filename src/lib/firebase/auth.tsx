'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, firestoreDb, firestore, db } from './config';

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  lastLogin: Date;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
  };
  financialProfile?: {
    monthlyExpenses: Record<string, string>;
    incomeRange?: string;
    investmentGoals?: string[];
    riskTolerance?: 'low' | 'medium' | 'high';
  };
}

// Extend the User type with our custom properties
export interface ExtendedUser extends User {
  financialProfile?: {
    riskTolerance?: 'low' | 'medium' | 'high';
    investmentGoals?: string[];
    [key: string]: any;
  };
}

// Auth context type
interface AuthContextType {
  user: ExtendedUser | null;
  isTestUser: boolean;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  bypassAuth: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isTestUser: false,
  loading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  bypassAuth: () => {}
});

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isTestUser, setIsTestUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if auth is bypassed (for development/testing)
  useEffect(() => {
    const bypassAuth = localStorage.getItem('bypassAuth');
    if (bypassAuth === 'true') {
      setIsTestUser(true);
      
      // Create fake user object for test mode
      const testUser = {
        uid: 'test-user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: '',
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => 'test-token',
        getIdTokenResult: async () => ({ token: 'test-token', signInProvider: 'password', expirationTime: '', issuedAtTime: '', authTime: '', claims: {} }),
        reload: async () => {},
        toJSON: () => ({}),
        providerId: 'test',
        photoURL: null,
        phoneNumber: null,
      } as ExtendedUser;
      
      // Get financial profile from localStorage if it exists
      const storedProfile = localStorage.getItem('userFinancialProfile');
      if (storedProfile) {
        try {
          testUser.financialProfile = JSON.parse(storedProfile);
        } catch (e) {
          console.error('Error parsing stored financial profile:', e);
        }
      }
      
      setUser(testUser);
      setLoading(false);
    }
  }, []);
  
  // Listen for auth state changes
  useEffect(() => {
    const bypassAuth = localStorage.getItem('bypassAuth');
    if (bypassAuth === 'true') {
      return; // Skip auth listener when in test mode
    }
    
    if (!auth) {
      console.error('Firebase Auth not initialized');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log('Auth state changed: user signed in', firebaseUser.uid);
        
        // Create extended user
        const extendedUser = firebaseUser as ExtendedUser;
        
        // If Firestore is available, try to fetch user's financial profile
        if (firestoreDb) {
          try {
            const userDocRef = firestore.doc(firestoreDb, 'users', firebaseUser.uid);
            const userDoc = await firestore.getDoc(userDocRef);
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              if (userData.financialProfile) {
                extendedUser.financialProfile = userData.financialProfile;
              }
            }
          } catch (err) {
            console.error('Error fetching user data from Firestore:', err);
          }
        } else {
          // If Firestore is not available, check localStorage
          const storedProfile = localStorage.getItem('userFinancialProfile');
          if (storedProfile) {
            try {
              extendedUser.financialProfile = JSON.parse(storedProfile);
            } catch (e) {
              console.error('Error parsing stored financial profile:', e);
            }
          }
        }
        
        setUser(extendedUser);
      } else {
        console.log('Auth state changed: user signed out');
        setUser(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential.user.uid);
    } catch (err: any) {
      console.error('Sign in error:', err.message);
      setError(err.message);
      throw err;
    }
  };
  
  // Sign up with email/password
  const signUp = async (email: string, password: string, displayName: string) => {
    setError(null);
    try {
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up:', userCredential.user.uid);
      
      // Create user document in Firestore
      if (firestoreDb) {
        const userDocRef = firestore.doc(firestoreDb, 'users', userCredential.user.uid);
        await firestore.setDoc(userDocRef, {
          uid: userCredential.user.uid,
          email,
          displayName,
          createdAt: firestore.serverTimestamp(),
        });
      } else {
        // Handle case where Firestore is not available
        console.log('Firestore not available, skipping user document creation');
      }
    } catch (err: any) {
      console.error('Sign up error:', err.message);
      setError(err.message);
      throw err;
    }
  };
  
  // Sign in with Google
  const signInWithGoogle = async () => {
    setError(null);
    try {
      if (!auth || !googleProvider) {
        throw new Error('Firebase Auth or Google provider not initialized');
      }
      
      const userCredential = await signInWithPopup(auth, googleProvider);
      console.log('User signed in with Google:', userCredential.user.uid);
      
      // Check if user document exists in Firestore
      if (firestoreDb) {
        const userDocRef = firestore.doc(firestoreDb, 'users', userCredential.user.uid);
        const userDoc = await firestore.getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          // Create user document if it doesn't exist
          await firestore.setDoc(userDocRef, {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
            createdAt: firestore.serverTimestamp(),
            provider: 'google'
          });
        } else {
          // Update last login time
          await firestore.updateDoc(userDocRef, {
            lastLogin: firestore.serverTimestamp()
          });
        }
      } else {
        // Handle case where Firestore is not available
        console.log('Firestore not available, skipping user document operations');
      }
    } catch (err: any) {
      console.error('Google sign in error:', err.message);
      setError(err.message);
      throw err;
    }
  };
  
  // Sign out
  const signOut = async () => {
    setError(null);
    try {
      const bypassAuth = localStorage.getItem('bypassAuth');
      if (bypassAuth === 'true') {
        localStorage.removeItem('bypassAuth');
        setIsTestUser(false);
        setUser(null);
        window.location.href = '/';
        return;
      }
      
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }
      
      await firebaseSignOut(auth);
      console.log('User signed out');
    } catch (err: any) {
      console.error('Sign out error:', err.message);
      setError(err.message);
      throw err;
    }
  };
  
  // Reset password
  const resetPassword = async (email: string) => {
    setError(null);
    try {
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }
      
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent');
    } catch (err: any) {
      console.error('Password reset error:', err.message);
      setError(err.message);
      throw err;
    }
  };
  
  // Bypass auth for testing
  const bypassAuth = () => {
    localStorage.setItem('bypassAuth', 'true');
    setIsTestUser(true);
    
    // Create fake user
    const testUser = {
      uid: 'test-user-123',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: true,
      isAnonymous: false,
      metadata: {},
      providerData: [],
      refreshToken: '',
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => 'test-token',
      getIdTokenResult: async () => ({ token: 'test-token', signInProvider: 'password', expirationTime: '', issuedAtTime: '', authTime: '', claims: {} }),
      reload: async () => {},
      toJSON: () => ({}),
      providerId: 'test',
      photoURL: null,
      phoneNumber: null,
      financialProfile: {
        riskTolerance: 'medium',
        investmentGoals: ['retirement', 'growth'],
        monthlyIncome: 5000,
        monthlySavings: 1000
      }
    } as ExtendedUser;
    
    setUser(testUser);
    
    // Store in localStorage for persistence
    localStorage.setItem('userFinancialProfile', JSON.stringify(testUser.financialProfile));
    
    console.log('Auth bypassed for testing');
  };
  
  const value = {
    user,
    isTestUser,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    bypassAuth
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Create a test user for development
export const createTestUser = async () => {
  if (!auth) {
    console.error('Auth is not initialized');
    throw new Error('Firebase auth is not initialized');
  }

  try {
    console.log('Creating test user...');
    // First, try to sign in with test credentials
    // If successful, it means the user already exists
    const testEmail = 'USER123@GMAIL.COM';
    const testPassword = 'USER123';
    
    try {
      return await signInWithEmailAndPassword(auth, testEmail, testPassword);
    } catch (error: any) {
      // If user doesn't exist, create a new one
      if (error.code === 'auth/user-not-found') {
        const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
        
        // Add display name
        await updateProfile(userCredential.user, {
          displayName: 'Test User'
        });
        
        console.log('Test user created:', userCredential.user.uid);
        return userCredential;
      } else {
        console.error('Error signing in test user:', error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
};

/**
 * Register a new user with email and password
 */
export const registerUser = async (email: string, password: string, displayName?: string) => {
  if (!auth) {
    console.error('Auth is not initialized');
    throw new Error('Firebase auth is not initialized');
  }
  
  try {
    console.log('Registering new user...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name if provided
    if (displayName) {
      await updateProfile(userCredential.user, {
        displayName
      });
    }
    
    console.log('User registered successfully:', userCredential.user.uid);
    
    // Create user document in Firestore
    if (firestoreDb) {
      try {
        await firestore.setDoc(
          firestore.doc(firestoreDb, 'users', userCredential.user.uid), 
          {
            email: userCredential.user.email,
            displayName: displayName || userCredential.user.displayName,
            createdAt: firestore.serverTimestamp(),
            lastLogin: firestore.serverTimestamp(),
          }
        );
      } catch (error) {
        console.error('Error creating user document:', error);
        // Don't block registration if Firestore fails
      }
    } else {
      // Store in mock DB if Firestore not available
      db.users.set(userCredential.user.uid, {
        email: userCredential.user.email,
        displayName: displayName || userCredential.user.displayName,
        createdAt: new Date(),
        lastLogin: new Date(),
      });
    }
    
    return userCredential.user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Sign in an existing user with email and password
 */
export const signInUser = async (email: string, password: string) => {
  if (!auth) {
    console.error('Auth is not initialized');
    throw new Error('Firebase auth is not initialized');
  }
  
  try {
    console.log('Signing in user...');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update lastLogin time in Firestore
    if (firestoreDb) {
      try {
        await firestore.updateDoc(
          firestore.doc(firestoreDb, 'users', userCredential.user.uid),
          {
            lastLogin: firestore.serverTimestamp(),
          }
        );
      } catch (error) {
        console.error('Error updating lastLogin:', error);
        // Don't block sign-in if Firestore update fails
      }
    }
    
    console.log('User signed in successfully:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in user:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOutUser = async () => {
  if (!auth) {
    console.error('Auth is not initialized');
    throw new Error('Firebase auth is not initialized');
  }
  
  try {
    await firebaseSignOut(auth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out user:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  if (!auth) {
    console.error('Auth object is not initialized');
    throw new Error('Firebase auth is not initialized');
  }

  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Create a user document in mock Firestore
export const createUserDocument = async (
  user: User,
  additionalData?: { displayName?: string }
): Promise<void> => {
  if (!user) {
    console.error('No user provided to createUserDocument');
    return;
  }
  
  // Create a local backup of user data
  if (typeof window !== 'undefined') {
    try {
      const { email, photoURL, uid } = user;
      const displayName = additionalData?.displayName || user.displayName || '';
      
      const userData: UserData = {
        uid,
        email: email || '',
        displayName,
        photoURL: photoURL || '',
        createdAt: new Date(),
        lastLogin: new Date(),
        preferences: {
          theme: 'dark',
          notifications: true
        },
        financialProfile: {
          riskTolerance: 'medium',
          investmentGoals: ['retirement'],
          incomeRange: '50k-100k'
        }
      };
      
      localStorage.setItem('userData_' + uid, JSON.stringify(userData));
      console.log('User data backed up to localStorage');
    } catch (e) {
      console.warn('Could not save user data to localStorage:', e);
    }
  }
  
  // Now try to save to Firestore
  try {
    const userRef = firestore.doc(firestoreDb || db, 'users', user.uid);
    
    try {
      const snapshot = await firestore.getDoc(userRef);
      
      if (!snapshot.exists()) {
        const { email, photoURL, uid } = user;
        const displayName = additionalData?.displayName || user.displayName || '';
        
        const userData: UserData = {
          uid,
          email: email || '',
          displayName,
          photoURL: photoURL || '',
          createdAt: new Date(),
          lastLogin: new Date(),
          preferences: {
            theme: 'dark',
            notifications: true
          },
          financialProfile: {
            riskTolerance: 'medium',
            investmentGoals: ['retirement'],
            incomeRange: '50k-100k'
          }
        };
        
        await firestore.setDoc(userRef, userData);
        console.log('User document created successfully for UID:', uid);
      } else {
        console.log('User document already exists for UID:', user.uid);
      }
    } catch (error: any) {
      // Check for permission errors
      if (error.code === 'permission-denied') {
        console.warn('Permission denied when trying to create user document. Using local data only.');
      } else {
        console.error('Error creating user document:', error);
      }
      // Continue without throwing to not block authentication
    }
  } catch (error) {
    console.error('Error in createUserDocument:', error);
    // Continue without throwing to not block authentication
  }
};

// Get the current authenticated user
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    if (!auth) {
      console.error('Auth is not initialized');
      resolve(null);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    console.error('Auth is not initialized');
    callback(null);
    return () => {};
  }
  
  return onAuthStateChanged(auth, callback);
}; 