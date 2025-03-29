'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const { currentUser, loading } = useAuth();
  const [animateAI, setAnimateAI] = useState(false);

  useEffect(() => {
    // Animation delay for AI text
    const timer = setTimeout(() => {
      setAnimateAI(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="px-6 py-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">FinAI Assistant</span>
          </div>
          <div>
            {currentUser ? (
              <Link 
                href="/dashboard" 
                className="px-4 py-2 mr-2 text-sm font-medium text-white transition-colors duration-150 bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="px-4 py-2 mr-2 text-sm font-medium text-indigo-600 transition-colors duration-150 border border-indigo-600 rounded-md hover:bg-indigo-50"
                >
                  Log In
                </Link>
                <Link 
                  href="/auth/register" 
                  className="px-4 py-2 text-sm font-medium text-white transition-colors duration-150 bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 mx-auto max-w-7xl lg:py-24">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Your Personal{' '}
              <span className={`text-indigo-600 ${animateAI ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
                AI-Powered
              </span>{' '}
              Financial Assistant
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Get personalized financial advice, manage your investments, and plan your financial future with the help of advanced AI technology.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              {currentUser ? (
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center px-8 py-3 text-base font-medium text-white transition-colors duration-150 bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/auth/register"
                  className="flex items-center justify-center px-8 py-3 text-base font-medium text-white transition-colors duration-150 bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Move with AI
                </Link>
              )}
              <Link
                href="#features"
                className="flex items-center justify-center px-8 py-3 text-base font-medium text-indigo-600 transition-colors duration-150 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="p-4 bg-white rounded-xl shadow-xl">
              <div className="w-full overflow-hidden rounded-lg shadow-sm">
                <div className="p-3 bg-indigo-600 rounded-t-lg">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="p-6 bg-white border-t-0 rounded-b-lg">
                  <div className="space-y-4">
                    <div className="flex justify-start">
                      <div className="max-w-[80%] px-4 py-2 bg-gray-100 rounded-lg">
                        <p className="text-sm">Hello! I'm your AI financial assistant. How can I help you today?</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="max-w-[80%] px-4 py-2 text-white bg-indigo-600 rounded-lg">
                        <p className="text-sm">I want to start investing but I'm not sure where to begin.</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[80%] px-4 py-2 bg-gray-100 rounded-lg">
                        <p className="text-sm">I'd be happy to help! Based on your risk profile and goals, I recommend starting with a diversified ETF portfolio. Would you like me to create a personalized investment plan?</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center px-3 py-2 bg-gray-100 rounded-lg">
                        <input
                          type="text"
                          placeholder="Type your question..."
                          className="flex-1 bg-transparent border-none outline-none"
                          disabled
                        />
                        <button className="p-1 text-white bg-indigo-600 rounded-full disabled:opacity-75" disabled>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -z-10 w-72 h-72 bg-indigo-300 rounded-full blur-3xl opacity-20 -bottom-10 -right-10"></div>
            <div className="absolute -z-10 w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-20 -top-10 -left-10"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-16 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Powered by Advanced AI Technology
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-600">
              Our platform combines the power of AI with financial expertise to provide you with personalized guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 text-white bg-indigo-600 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Personalized Financial Insights</h3>
              <p className="text-gray-600">
                Receive AI-generated insights tailored to your financial situation, goals, and preferences.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 text-white bg-indigo-600 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Investment Recommendations</h3>
              <p className="text-gray-600">
                Get intelligent investment suggestions based on market trends, risk analysis, and your financial goals.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 text-white bg-indigo-600 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Financial Planning</h3>
              <p className="text-gray-600">
                Plan for your future with AI-assisted budgeting, retirement planning, and goal setting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-indigo-600">
        <div className="mx-auto max-w-7xl">
          <div className="px-6 py-10 bg-indigo-700 rounded-3xl">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to transform your financial journey?
              </h2>
              <p className="mt-4 text-lg text-indigo-100">
                Join thousands of users who are already leveraging AI to make smarter financial decisions.
              </p>
              <div className="mt-8">
                {currentUser ? (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-indigo-600 transition-colors duration-150 bg-white border border-transparent rounded-md hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-indigo-600 transition-colors duration-150 bg-white border border-transparent rounded-md hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started Now
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Product</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Features</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Pricing</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Testimonials</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">About</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Careers</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Resources</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Help Center</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Community</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Webinars</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Events</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Privacy</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Terms</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Cookies</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Licenses</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-8 border-t border-gray-200">
            <p className="text-base text-gray-400">
              &copy; 2025 FinAI Assistant. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
