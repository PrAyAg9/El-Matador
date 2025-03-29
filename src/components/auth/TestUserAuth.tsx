'use client';

import { useState } from 'react';

export default function TestUserAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const handleTestUserLogin = () => {
    setIsLoading(true);
    
    // Create a test user object with requested credentials
    const testUser = {
      uid: 'test-user-123',
      email: 'test@gmail.com', // Updated email
      displayName: 'Test User',
      photoURL: null,
      password: 'test123' // Added password
    };
    
    // Set localStorage values for persistent test user session
    localStorage.setItem('bypassAuth', 'true');
    localStorage.setItem('testUser', JSON.stringify(testUser));
    
    // Cache some user financial info for the test user
    localStorage.setItem('cachedUserInfo', JSON.stringify({
      riskTolerance: 'Moderate',
      investmentGoals: ['Retirement', 'Major Purchase'],
      incomeRange: '$75,000 - $100,000'
    }));
    
    // Set a cookie for middleware authentication
    document.cookie = 'bypassAuth=true; path=/; max-age=86400';

    // Force reload to ensure context updates
    window.location.href = '/dashboard';
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleTestUserLogin}
        disabled={isLoading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </span>
        ) : (
          "Login as Test User (test@gmail.com / test123)"
        )}
      </button>
      <p className="text-xs text-center mt-2 text-gray-400">
        Use this option to explore without creating an account
      </p>
    </div>
  );
} 