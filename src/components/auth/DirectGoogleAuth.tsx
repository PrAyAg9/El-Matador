'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { auth, googleProvider } from '@/lib/firebase/config';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function DirectGoogleAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      // Directly use Firebase auth without extra wrapper
      console.log('Starting Google sign-in directly...');
      const userCredential = await signInWithPopup(auth, googleProvider);
      console.log('Google sign-in successful:', userCredential.user.uid);
      
      // Check if the user document exists
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        console.log('Creating new user document for Google user...');
        await setDoc(userDocRef, {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          createdAt: new Date(),
          lastLogin: new Date(),
          provider: 'google'
        });
      } else {
        // Update last login
        await updateDoc(userDocRef, {
          lastLogin: new Date()
        });
      }
      
      router.push('/dashboard');
    } catch (error: any) {
      // Detailed error handling
      console.error('Google Auth Error:', error.code, error.message);
      
      switch(error.code) {
        case 'auth/popup-blocked':
          setError('Sign-in popup was blocked. Please allow popups for this site.');
          break;
        case 'auth/popup-closed-by-user':
          setError('Sign-in was cancelled. Please try again.');
          break;
        case 'auth/cancelled-popup-request':
          setError('Another popup is already open. Please close it and try again.');
          break;
        case 'auth/account-exists-with-different-credential':
          setError('An account already exists with the same email but different sign-in method.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection and try again.');
          break;
        case 'auth/configuration-not-found':
          setError('Authentication configuration error. Please make sure Google Sign-In is enabled in Firebase Console.');
          break;
        default:
          setError(`Authentication failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-center text-white mb-4">Direct Google Login</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-600 text-white rounded-md text-sm">
          {error}
        </div>
      )}
      
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-200 bg-gray-700 border border-gray-600 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        <FcGoogle className="w-5 h-5 mr-2" />
        {loading ? 'Connecting...' : 'Sign in with Google'}
      </button>
      
      <p className="mt-3 text-sm text-gray-400 text-center">
        This uses direct Firebase authentication
      </p>
    </div>
  );
} 