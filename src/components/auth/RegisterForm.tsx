'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, signInWithGoogle, signInUser } from '@/lib/firebase/auth';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { HiArrowLeft } from 'react-icons/hi';

// Risk tolerance options
const RISK_OPTIONS = [
  { id: 'low', label: 'Conservative', description: 'I prefer stability and minimal risk' },
  { id: 'medium', label: 'Moderate', description: 'I can accept some fluctuations for growth potential' },
  { id: 'high', label: 'Aggressive', description: 'I seek maximum growth and can tolerate volatility' },
];

// Investment goals options
const GOAL_OPTIONS = [
  { id: 'retirement', label: 'Retirement' },
  { id: 'house', label: 'Buying a home' },
  { id: 'education', label: 'Education' },
  { id: 'wealth', label: 'Building wealth' },
  { id: 'income', label: 'Generating income' },
];

// Income range options
const INCOME_OPTIONS = [
  { id: 'under50k', label: 'Under $50,000' },
  { id: '50k-100k', label: '$50,000 - $100,000' },
  { id: '100k-200k', label: '$100,000 - $200,000' },
  { id: 'over200k', label: 'Over $200,000' },
];

export default function RegisterForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  // Step 1: Account details - hardcoded for test user
  const [email, setEmail] = useState('USER123@GMAIL.COM');
  const [password, setPassword] = useState('USER123');
  const [confirmPassword, setConfirmPassword] = useState('USER123');
  const [displayName, setDisplayName] = useState('Test User');
  
  // Step 2: Financial profile - default values
  const [incomeRange, setIncomeRange] = useState('50k-100k');
  const [riskTolerance, setRiskTolerance] = useState('medium');
  const [investmentGoals, setInvestmentGoals] = useState<string[]>(['retirement', 'wealth']);

  useEffect(() => {
    // Automatically register the test user when component mounts
    const createTestUser = async () => {
      try {
        console.log('Checking if test user exists...');
        try {
          // First try to sign in
          await signInUser('USER123@GMAIL.COM', 'USER123');
          console.log('Test user already exists');
        } catch (signInError: any) {
          if (signInError.code === 'auth/invalid-credential' || signInError.code === 'auth/user-not-found') {
            // Create the user if they don't exist
            console.log('Test user does not exist, creating account...');
            await registerUser('USER123@GMAIL.COM', 'USER123', 'Test User');
            console.log('Test user account created successfully');
          } else {
            console.error('Error checking test user:', signInError);
          }
        }
      } catch (error) {
        console.error('Error during automatic test user creation:', error);
      }
    };

    createTestUser();
  }, []);

  const handleNextStep = () => {
    setError('');
    
    if (currentStep === 1) {
      // No validation needed for hardcoded values
      setCurrentStep(2);
    } else if (currentStep === 2) {
      handleRegister();
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    setError('');
  };

  const toggleInvestmentGoal = (goalId: string) => {
    setInvestmentGoals(prev => 
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Using test account...');
      await signInUser('USER123@GMAIL.COM', 'USER123');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Registration error details:', error);
      
      // Handle Firebase auth errors
      const errorCode = error.code;
      
      if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/user-not-found') {
        try {
          // Try to create the account
          console.log('Test user does not exist, creating now...');
          await registerUser('USER123@GMAIL.COM', 'USER123', 'Test User');
          
          // Log in with the new account
          await signInUser('USER123@GMAIL.COM', 'USER123');
          router.push('/dashboard');
        } catch (registerError: any) {
          console.error('Failed to create test account:', registerError);
          setError('Could not create test account. Please check Firebase configuration.');
        }
      } else if (errorCode === 'auth/email-already-in-use') {
        setError('Email is already in use');
      } else if (errorCode === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (errorCode === 'auth/weak-password') {
        setError('Password is too weak');
      } else if (errorCode === 'auth/configuration-not-found') {
        setError('Firebase configuration error. Please contact support.');
        console.error('Firebase configuration not found. Check your Firebase config in .env.local file.');
      } else if (errorCode === 'auth/network-request-failed') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(`Failed to register: ${error.message || 'Unknown error'}`);
        console.error('Registration error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error: any) {
      const errorCode = error.code;
      if (errorCode === 'auth/popup-closed-by-user') {
        setError('Sign-up was cancelled');
      } else if (errorCode === 'auth/popup-blocked') {
        setError('Sign-up popup was blocked by your browser');
      } else {
        setError('Failed to sign up with Google. Please try again later.');
        console.error('Google sign-up error:', error);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Progress indicator
  const ProgressBar = () => (
    <div className="mb-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-between">
          <div>
            <span
              className={`relative flex items-center justify-center w-8 h-8 text-sm font-medium rounded-full ${
                currentStep >= 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border-2 border-gray-300 text-gray-600'
              }`}
            >
              1
            </span>
          </div>
          <div>
            <span
              className={`relative flex items-center justify-center w-8 h-8 text-sm font-medium rounded-full ${
                currentStep >= 2
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border-2 border-gray-300 text-gray-600'
              }`}
            >
              2
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-sm font-medium text-gray-300">Account Details</span>
        <span className="text-sm font-medium text-gray-300">Financial Profile</span>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-lg">
      {/* Back Button */}
      <Link href="/" className="flex items-center text-gray-300 hover:text-indigo-400 mb-4">
        <HiArrowLeft className="mr-2" /> Back to Home
      </Link>
      
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
        <p className="mt-2 text-gray-300">
          {currentStep === 1
            ? 'Using test account with preset credentials'
            : 'Confirm test account financial profile'}
        </p>
      </div>

      <ProgressBar />

      {error && (
        <div className="p-3 text-sm text-white bg-red-500 rounded-md">
          {error}
        </div>
      )}

      {currentStep === 1 ? (
        // Step 1: Account Details
        <form className="mt-8 space-y-6">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-300">
              Full Name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              required
              disabled
              value={displayName}
              className="block w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled
              value={email}
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
              required
              disabled
              value={password}
              className="block w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              disabled
              value={confirmPassword}
              className="block w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-between">
            <div className="text-sm">
              <Link href="/auth/login" className="font-medium text-indigo-400 hover:text-indigo-300">
                Already have an account? Sign in
              </Link>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleNextStep}
              disabled={loading}
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Continue
            </button>
          </div>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-400 bg-gray-800">Or sign up with</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={googleLoading}
                className="flex justify-center items-center w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {googleLoading ? (
                  'Signing up...'
                ) : (
                  <>
                    <FcGoogle className="w-5 h-5 mr-2" />
                    Sign up with Google
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        // Step 2: Financial Profile - Simplified with preselected values
        <form className="mt-8 space-y-6">
          <div>
            <fieldset>
              <legend className="block text-sm font-medium text-white">Income Range</legend>
              <div className="mt-2 space-y-2">
                {INCOME_OPTIONS.map((option) => (
                  <div key={option.id} className="flex items-center">
                    <input
                      id={`income-${option.id}`}
                      name="income"
                      type="radio"
                      checked={incomeRange === option.id}
                      onChange={() => setIncomeRange(option.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor={`income-${option.id}`} className="ml-3 text-sm text-gray-300">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>

          <div>
            <fieldset>
              <legend className="block text-sm font-medium text-white">Investment Goals</legend>
              <div className="mt-2 space-y-2">
                {GOAL_OPTIONS.map((option) => (
                  <div key={option.id} className="flex items-center">
                    <input
                      id={`goal-${option.id}`}
                      name={`goal-${option.id}`}
                      type="checkbox"
                      checked={investmentGoals.includes(option.id)}
                      onChange={() => toggleInvestmentGoal(option.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor={`goal-${option.id}`} className="ml-3 text-sm text-gray-300">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>

          <div>
            <fieldset>
              <legend className="block text-sm font-medium text-white">Risk Tolerance</legend>
              <div className="mt-2 space-y-2">
                {RISK_OPTIONS.map((option) => (
                  <div key={option.id} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id={`risk-${option.id}`}
                        name="risk"
                        type="radio"
                        checked={riskTolerance === option.id}
                        onChange={() => setRiskTolerance(option.id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor={`risk-${option.id}`} className="font-medium text-gray-300">
                        {option.label}
                      </label>
                      <p className="text-gray-400">{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 