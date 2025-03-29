'use client';

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNy2xVAi0hrL-cibdilQ4ODsLNUresBzQ",
  authDomain: "financeassistant-986c4.firebaseapp.com",
  projectId: "financeassistant-986c4",
  storageBucket: "financeassistant-986c4.appspot.com",
  messagingSenderId: "227208128187",
  appId: "1:227208128187:web:0ca2034c932c9e86abab9e",
  measurementId: "G-E7Y7EKK12E"
};

// Initialize Firebase
let app: any = null;
try {
  if (isBrowser) {
    console.log('Initializing Firebase app...');
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    console.log('Firebase app initialized successfully');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw new Error('Failed to initialize Firebase');
}

// Initialize Firebase services
const auth = isBrowser && app ? getAuth(app) : null;
const firestoreDb = isBrowser && app ? getFirestore(app) : null;
const functions = isBrowser && app ? getFunctions(app) : null;

// For debugging
if (isBrowser) {
  console.log('Firebase initialization status:');
  console.log('- Auth initialized:', auth ? 'Yes' : 'No');
  console.log('- Firestore initialized:', firestoreDb ? 'Yes' : 'No');
  console.log('- Functions initialized:', functions ? 'Yes' : 'No');
}

// Initialize Google Auth Provider
const googleProvider = isBrowser ? new GoogleAuthProvider() : null;
if (isBrowser && googleProvider) {
  googleProvider.setCustomParameters({
    prompt: 'select_account',
  });
}

// Mock Firestore implementation for local development
const mockDb = {
  users: new Map(),

  // Methods to mimic Firestore functionality
  collection: (collectionName: string) => {
    return {
      doc: (docId: string) => {
        return {
          get: async () => {
            const users = mockDb.users;
            if (users.has(docId)) {
              return {
                exists: () => true,
                data: () => users.get(docId)
              };
            }
            return { exists: () => false };
          },
          set: async (data: any) => {
            mockDb.users.set(docId, data);
            console.log('Mock Firestore: Document set', { collection: collectionName, docId, data });
            return { id: docId };
          },
          update: async (data: any) => {
            if (mockDb.users.has(docId)) {
              const existingData = mockDb.users.get(docId);
              mockDb.users.set(docId, { ...existingData, ...data });
              console.log('Mock Firestore: Document updated', { collection: collectionName, docId, data });
            }
            return { id: docId };
          }
        };
      }
    };
  }
};

// Simple helper functions to mimic Firestore functions
const mockFirestore = {
  collection,
  doc: (db: any, collection: string, docId: string) => {
    return mockDb.collection(collection).doc(docId);
  },
  getDoc: async (docRef: any) => {
    return await docRef.get();
  },
  setDoc: async (docRef: any, data: any) => {
    return await docRef.set(data);
  },
  updateDoc: async (docRef: any, data: any) => {
    return await docRef.update(data);
  },
  serverTimestamp: () => new Date()
};

// Export the real functions if available, otherwise use mock
const firestore = {
  collection: firestoreDb ? collection : mockFirestore.collection,
  doc: firestoreDb ? doc : mockFirestore.doc,
  getDoc: firestoreDb ? getDoc : mockFirestore.getDoc, 
  setDoc: firestoreDb ? setDoc : mockFirestore.setDoc,
  updateDoc: firestoreDb ? updateDoc : mockFirestore.updateDoc,
  serverTimestamp: firestoreDb ? serverTimestamp : mockFirestore.serverTimestamp
};

export { 
  app, 
  auth, 
  googleProvider, 
  mockDb as db, 
  firestore,
  firestoreDb,
  functions
}; 