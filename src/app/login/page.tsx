'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TestUserAuth from '@/components/auth/TestUserAuth';
import DirectGoogleAuth from '@/components/auth/DirectGoogleAuth';

export default function LoginPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Check if we already have a route in /auth/login and redirect there
    // This is just a temporary redirect to handle the 404 error
    const checkExistingAuthRoutes = async () => {
      try {
        // Just a simple check to see if we should redirect
        const response = await fetch('/auth/login', { method: 'HEAD' });
        if (response.ok) {
          router.push('/auth/login');
        }
      } catch (error) {
        // If fetch fails, we'll just stay on this page
        console.log('Using backup login page');
      }
    };
    
    checkExistingAuthRoutes();
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Financial Assistant Login
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to access your financial dashboard
          </p>
        </div>
        
        <div className="grid gap-6 mt-8">
          {/* Test User Option */}
          <div className="bg-gray-800 p-6 rounded-lg border border-yellow-500 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">Quick Access</h3>
            <TestUserAuth />
            <p className="mt-3 text-xs text-gray-400">
              This bypasses Firebase authentication for development & testing purposes only.
            </p>
          </div>
          
          {/* Google Auth Option */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">Google Authentication</h3>
            <DirectGoogleAuth />
            <p className="mt-3 text-xs text-gray-400">
              This uses Firebase Google authentication.
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/auth/register" className="font-medium text-indigo-400 hover:text-indigo-300">
              Sign up
            </Link>
          </p>
          
          <p className="mt-2 text-sm text-gray-400">
            <Link href="/" className="font-medium text-indigo-400 hover:text-indigo-300">
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 