'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
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
    incomeRange?: string;
    investmentGoals?: string[];
    riskTolerance?: 'low' | 'medium' | 'high';
  };
}

// Create a test user for development
const createTestUser = async () => {
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
const registerUser = async (email: string, password: string, displayName?: string) => {
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
const signInUser = async (email: string, password: string) => {
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
 * Sign in with Google
 */
const signInWithGoogle = async (): Promise<User> => {
  if (!auth) {
    console.error('Auth is not initialized');
    throw new Error('Firebase auth is not initialized');
  }
  
  if (!googleProvider) {
    console.error('Google provider is not initialized');
    throw new Error('Google provider is not initialized');
  }
  
  try {
    console.log('Starting Google sign-in process...');
    
    // Try to sign in with popup
    const userCredential = await signInWithPopup(auth, googleProvider);
    console.log('Google sign-in successful:', userCredential.user.uid);
    
    // Create or update user document in Firestore
    if (firestoreDb) {
      try {
        const userRef = firestore.doc(firestoreDb, 'users', userCredential.user.uid);
        const userSnap = await firestore.getDoc(userRef);
        
        if (!userSnap.exists()) {
          // Create new user document
          await firestore.setDoc(userRef, {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
            createdAt: firestore.serverTimestamp(),
            lastLogin: firestore.serverTimestamp(),
            authProvider: 'google',
          });
          console.log('Created new user document in Firestore');
        } else {
          // Update existing user document
          await firestore.updateDoc(userRef, {
            lastLogin: firestore.serverTimestamp(),
            photoURL: userCredential.user.photoURL, // Make sure photo URL is updated
          });
          console.log('Updated existing user document in Firestore');
        }
      } catch (error) {
        console.error('Error updating Firestore user document:', error);
        // Don't block sign-in if Firestore fails
      }
    } else {
      console.log('Firestore not available, skipping user document creation');
    }
    
    return userCredential.user;
  } catch (error: any) {
    console.error('Error with Google sign-in:', error);
    
    // Add more specific error handling
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled. Please try again.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Sign-in popup was blocked by your browser. Please allow popups for this site.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Another sign-in request is pending. Please try again.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection and try again.');
    } else {
      throw new Error(`Google sign-in failed: ${error.message || 'Unknown error'}`);
    }
  }
};

/**
 * Sign out the current user
 */
const signOutUser = async () => {
  if (!auth) {
    console.error('Auth is not initialized');
    throw new Error('Firebase auth is not initialized');
  }
  
  try {
    await signOut(auth);
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
const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    console.error('Auth is not initialized');
    callback(null);
    return () => {};
  }
  
  return onAuthStateChanged(auth, callback);
};

// Export all named auth functions
export {
  createTestUser,
  registerUser,
  signInUser,
  signInWithGoogle,
  signOutUser,
  onAuthStateChange
}; 