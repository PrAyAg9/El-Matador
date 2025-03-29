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
  signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider, firestore, db } from './config';

// Import our mock firestore functions instead of the real ones
const { doc, setDoc, getDoc, updateDoc } = firestore;

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

// Register a new user
export const registerUser = async (
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> => {
  if (!auth) {
    console.error('Auth object is not initialized');
    throw new Error('Firebase auth is not initialized');
  }

  console.log('Starting registration with email:', email);
  
  try {
    console.log('Creating user with Firebase Authentication...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User created successfully:', userCredential.user.uid);
    
    // Update display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
      console.log('Display name updated successfully');
    }
    
    // Create user document in mock Firestore
    console.log('Creating user document...');
    await createUserDocument(userCredential.user, { displayName });
    console.log('User document created successfully');
    
    return userCredential;
  } catch (error: any) {
    // Enhanced error handling
    console.error('Error registering user:', error.code, error.message);
    
    // Handle specific Firebase errors
    switch (error.code) {
      case 'auth/email-already-in-use':
        console.error('Email is already in use');
        break;
      case 'auth/invalid-email':
        console.error('Invalid email format');
        break;
      case 'auth/weak-password':
        console.error('Password is too weak');
        break;
      case 'auth/network-request-failed':
        console.error('Network error - check your connection');
        break;
      default:
        console.error('Unspecified error during registration:', error);
    }
    
    throw error;
  }
};

// Sign in existing user
export const signInUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  if (!auth) {
    console.error('Auth object is not initialized');
    throw new Error('Firebase auth is not initialized');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login in mock Firestore
    if (userCredential.user) {
      const userRef = doc(db, 'users', userCredential.user.uid);
      await updateDoc(userRef, {
        lastLogin: new Date()
      }).catch(error => {
        console.warn('Could not update last login time:', error);
      });
    }
    
    return userCredential;
  } catch (error: any) {
    console.error('Error signing in user:', error.code, error.message);
    throw error;
  }
};

// Sign out user
export const signOutUser = async (): Promise<void> => {
  if (!auth) {
    console.error('Auth object is not initialized');
    throw new Error('Firebase auth is not initialized');
  }

  try {
    await signOut(auth);
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
  
  const userRef = doc(db, 'users', user.uid);
  
  try {
    const snapshot = await getDoc(userRef);
    
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
      
      await setDoc(userRef, userData);
      console.log('User document created successfully for UID:', uid);
    } else {
      console.log('User document already exists for UID:', user.uid);
    }
  } catch (error) {
    console.error('Error creating user document:', error);
    // Continue without throwing to not block authentication
  }
};

// Google Sign-In
export const signInWithGoogle = async (): Promise<UserCredential> => {
  if (!auth) {
    console.error('Auth object is not initialized');
    throw new Error('Firebase auth is not initialized');
  }

  try {
    console.log('Starting Google sign-in...');
    const userCredential = await signInWithPopup(auth, googleProvider);
    console.log('Google sign-in successful:', userCredential.user.uid);
    
    // Check if the user document exists in mock Firestore
    try {
      const userRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        console.log('Creating user document for Google user...');
        await createUserDocument(userCredential.user);
        console.log('Google user document created successfully');
      } else {
        // Update last login
        await updateDoc(userRef, {
          lastLogin: new Date()
        }).catch(error => {
          console.warn('Could not update last login time:', error);
        });
      }
    } catch (error) {
      console.error('Error checking/creating user document:', error);
      // Continue without throwing to not block authentication
    }
    
    return userCredential;
  } catch (error: any) {
    console.error('Error signing in with Google:', error.code, error.message);
    throw error;
  }
}; 