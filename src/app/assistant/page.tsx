'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import ChatInterface from '@/components/dashboard/ChatInterface';
import { User } from 'firebase/auth';

// Extended User type with our custom properties
interface ExtendedUser extends User {
  financialProfile?: {
    riskTolerance?: 'low' | 'medium' | 'high';
    investmentGoals?: string[];
    [key: string]: any;
  };
}

export default function AssistantPage() {
  const { user } = useAuth();
  const extendedUser = user as ExtendedUser;
  const [isActivatingAI, setIsActivatingAI] = useState(true);
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeTopic, setActiveTopic] = useState('');
  
  // Reference to artificially trigger events in ChatInterface
  const chatInputRef = useRef<HTMLInputElement>(null);
  
  // Simulate AI mode activation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActivatingAI(false);
      // Ensure the page stays at the top after loading
      if (pageRef.current) {
        window.scrollTo(0, 0);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Force scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Effect to handle topic selection
  useEffect(() => {
    if (activeTopic && !isActivatingAI) {
      // Find the chat input and simulate typing
      const inputElement = document.querySelector('#chat-input') as HTMLInputElement;
      if (inputElement) {
        // Set the value
        switch (activeTopic) {
          case 'retirement':
            inputElement.value = 'How should I plan for retirement?';
            break;
          case 'investment':
            inputElement.value = 'What investment strategies would you recommend?';
            break;
          case 'tax':
            inputElement.value = 'How can I optimize my tax planning?';
            break;
          case 'debt':
            inputElement.value = 'What is the best way to manage my debt?';
            break;
        }
        
        // Trigger the enter key press
        setTimeout(() => {
          const enterEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'Enter',
            code: 'Enter'
          });
          inputElement.dispatchEvent(enterEvent);
          
          // Reset active topic
          setActiveTopic('');
        }, 100);
      }
    }
  }, [activeTopic, isActivatingAI]);

  return (
    <div className="px-4 py-6 sm:px-0" ref={pageRef}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-indigo-400">El Matador Assistant</h1>
        <p className="text-gray-300">Ask me anything about your finances, investments, or planning</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main chat interface */}
        <div className="lg:col-span-2">
          {isActivatingAI ? (
            <div className="flex flex-col items-center justify-center h-[600px] bg-gray-800 rounded-lg shadow p-8">
              <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
              <h2 className="mt-6 text-xl font-semibold text-indigo-400">Activating El Matador</h2>
              <p className="mt-2 text-center text-gray-300">
                Preparing your personalized financial advisor...
              </p>
            </div>
          ) : (
            <ChatInterface />
          )}
        </div>

        {/* Contextual information */}
        <div className="space-y-6">
          {/* Financial profile summary */}
          <div className="p-6 bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-medium text-indigo-400">Your Financial Profile</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Risk Tolerance</h3>
                <p className="mt-1 text-base font-medium text-gray-300">
                  {extendedUser?.financialProfile?.riskTolerance === 'low' && 'Conservative'}
                  {extendedUser?.financialProfile?.riskTolerance === 'medium' && 'Moderate'}
                  {extendedUser?.financialProfile?.riskTolerance === 'high' && 'Aggressive'}
                  {!extendedUser?.financialProfile?.riskTolerance && 'Not set'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400">Investment Goals</h3>
                {extendedUser?.financialProfile?.investmentGoals?.length ? (
                  <ul className="mt-1 text-sm text-gray-300">
                    {extendedUser.financialProfile.investmentGoals.map((goal: string, index: number) => (
                      <li key={index} className="flex items-center mt-1">
                        <svg className="w-4 h-4 mr-1.5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {goal}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-sm text-gray-400">No goals set</p>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="button"
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                Update profile <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
          
          {/* Sample topics */}
          <div className="p-6 bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-medium text-indigo-400">Ask El Matador About</h2>
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => setActiveTopic('retirement')}
                className="block w-full p-3 text-left bg-gray-700 hover:bg-gray-600 rounded-md"
              >
                <span className="text-sm font-medium text-gray-300">Retirement Planning</span>
                <p className="mt-1 text-xs text-gray-400">
                  Get personalized advice on saving for retirement
                </p>
              </button>
              <button
                type="button"
                onClick={() => setActiveTopic('investment')}
                className="block w-full p-3 text-left bg-gray-700 hover:bg-gray-600 rounded-md"
              >
                <span className="text-sm font-medium text-gray-300">Investment Strategies</span>
                <p className="mt-1 text-xs text-gray-400">
                  Learn about different ways to grow your wealth
                </p>
              </button>
              <button
                type="button"
                onClick={() => setActiveTopic('tax')}
                className="block w-full p-3 text-left bg-gray-700 hover:bg-gray-600 rounded-md"
              >
                <span className="text-sm font-medium text-gray-300">Tax Planning</span>
                <p className="mt-1 text-xs text-gray-400">
                  Understand how to minimize your tax burden
                </p>
              </button>
              <button
                type="button"
                onClick={() => setActiveTopic('debt')}
                className="block w-full p-3 text-left bg-gray-700 hover:bg-gray-600 rounded-md"
              >
                <span className="text-sm font-medium text-gray-300">Debt Management</span>
                <p className="mt-1 text-xs text-gray-400">
                  Strategies to pay down debt and boost your credit score
                </p>
              </button>
            </div>
          </div>
          
          {/* Resources */}
          <div className="p-6 bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-medium text-indigo-400">Educational Resources</h2>
            <div className="mt-4 space-y-3">
              <a 
                href="#" 
                className="block"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-300">
                      Introduction to Investing
                    </p>
                    <p className="text-xs text-gray-400">
                      Learn the basics of investing and building wealth
                    </p>
                  </div>
                </div>
              </a>
              <a 
                href="#" 
                className="block"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-300">
                      Budgeting 101
                    </p>
                    <p className="text-xs text-gray-400">
                      Create a personal budget that works for you
                    </p>
                  </div>
                </div>
              </a>
              <a 
                href="#" 
                className="block"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-300">
                      Retirement Calculators
                    </p>
                    <p className="text-xs text-gray-400">
                      Tools to help plan your retirement savings
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 