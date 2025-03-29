'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInUser, registerUser, signInWithGoogle } from '@/lib/firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { HiArrowLeft } from 'react-icons/hi';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('USER123@GMAIL.COM');
  const [password, setPassword] = useState('USER123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);

  useEffect(() => {
    // Try to ensure the test user exists when component mounts
    const ensureTestUser = async () => {
      try {
        console.log('Attempting to sign in with test credentials...');
        await signInUser('USER123@GMAIL.COM', 'USER123');
        console.log('Test user exists and login successful');
      } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
          console.log('Test user does not exist, creating...');
          try {
            await registerUser('USER123@GMAIL.COM', 'USER123', 'Test User');
            console.log('Test user created successfully');
          } catch (registerError: any) {
            if (registerError.code === 'auth/email-already-in-use') {
              console.log('User already exists but credentials wrong');
            } else {
              console.error('Failed to create test user:', registerError);
            }
          }
        } else {
          console.error('Error checking test user:', error);
        }
      }
    };

    ensureTestUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInUser('USER123@GMAIL.COM', 'USER123');
      router.push('/dashboard');
    } catch (error: any) {
      const errorCode = error.code;
      console.error('Login error:', errorCode);
      
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-credential') {
        // Try to create the user and then sign in
        try {
          await registerUser('USER123@GMAIL.COM', 'USER123', 'Test User');
          await signInUser('USER123@GMAIL.COM', 'USER123');
          router.push('/dashboard');
        } catch (registerError: any) {
          setError('Failed to create or sign in with test account');
          console.error('Registration error:', registerError);
        }
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setError('Failed to sign in with Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-lg">
      {/* Back Button */}
      <Link href="/" className="flex items-center text-gray-300 hover:text-indigo-400 mb-4">
        <HiArrowLeft className="mr-2" /> Back to Home
      </Link>
      
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Sign In</h1>
        <p className="mt-2 text-gray-300">
          Using pre-configured test account
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm text-white bg-red-600 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            disabled
            className="block w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            disabled
            className="block w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in with Test Account'}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-300 bg-gray-800">Or continue with</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="flex justify-center items-center w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {googleLoading ? (
              'Signing in...'
            ) : (
              <>
                <FcGoogle className="w-5 h-5 mr-2" />
                Sign in with Google
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 