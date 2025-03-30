'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signInUser, registerUser, signInWithGoogle } from '@/lib/firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { 
  HiArrowLeft, 
  HiOutlineArrowRight, 
  HiOutlineMail, 
  HiOutlineLockClosed,
  HiOutlineUser
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInUser(email, password);
      } else {
        // Validate passwords match for signup
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        await registerUser(email, password, displayName);
      }
      
      router.push('/dashboard');
    } catch (error: any) {
      const errorCode = error.code;
      console.error('Auth error:', errorCode);
      
      // Handle common Firebase auth errors
      if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else if (errorCode === 'auth/user-not-found') {
        setError('User not found');
      } else if (errorCode === 'auth/email-already-in-use') {
        setError('Email is already in use');
      } else if (errorCode === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (errorCode === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else if (errorCode === 'auth/network-request-failed') {
        setError('Network error. Please check your connection');
      } else {
        setError('Authentication failed. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      console.log('Attempting Google sign-in...');
      if (typeof signInWithGoogle !== 'function') {
        console.error('signInWithGoogle is not a function', typeof signInWithGoogle);
        throw new Error('Sign-in with Google is currently unavailable. Please try again later or use email login.');
      }
      
      await signInWithGoogle();
      console.log('Google sign-in successful, redirecting...');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      if (error.message) {
        setError(error.message);
      } else if (error.code === 'auth/popup-blocked') {
        setError('Sign-in popup was blocked. Please allow popups for this site.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        setError('Another sign-in request is pending. Please try again.');
      } else if (error.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('Failed to sign in with Google. Please try again later.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg
            viewBox="0 0 1200 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full opacity-20"
          >
            <defs>
              <pattern id="pattern1" patternUnits="userSpaceOnUse" width="200" height="200" patternTransform="scale(0.75)">
                <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(79, 70, 229, 0.2)" strokeWidth="1" />
              </pattern>
              <pattern id="pattern2" patternUnits="userSpaceOnUse" width="100" height="100" patternTransform="scale(1.5)">
                <line x1="0" y1="0" x2="100" y2="100" stroke="rgba(79, 70, 229, 0.1)" strokeWidth="1" />
                <line x1="100" y1="0" x2="0" y2="100" stroke="rgba(79, 70, 229, 0.1)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1200" height="800" fill="url(#pattern1)" />
            <rect width="1200" height="800" fill="url(#pattern2)" />
          </svg>
        </div>
      </div>

      <div className="max-w-md w-full">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24">
              <Image 
                src="/matador.png" 
                alt="El Matador" 
                width={96} 
                height={96}
                priority
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">El Matador</h1>
          <p className="text-gray-400">Your AI-Powered Financial Assistant</p>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'signup'}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={formVariants}
            className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <button
                onClick={handleToggleForm}
                className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
            
            {error && (
              <div className="mb-6 p-3 bg-red-900 bg-opacity-30 border border-red-800 text-red-300 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="name">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                      className="block w-full bg-gray-700 border border-gray-600 rounded-md py-3 pl-10 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full bg-gray-700 border border-gray-600 rounded-md py-3 pl-10 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full bg-gray-700 border border-gray-600 rounded-md py-3 pl-10 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="********"
                  />
                </div>
              </div>
              
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="block w-full bg-gray-700 border border-gray-600 rounded-md py-3 pl-10 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="********"
                    />
                  </div>
                </div>
              )}
              
              {isLogin && (
                <div className="flex justify-end">
                  <Link
                    href="#"
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : (
                  <span className="flex items-center">
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                  </span>
                )}
              </button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full flex justify-center items-center py-3 px-4 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {googleLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FcGoogle className="h-5 w-5 mr-2" />
                      Continue with Google
                    </span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-400 hover:text-indigo-400"
          >
            <HiArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 