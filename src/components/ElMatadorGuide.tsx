'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, LightBulbIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface GuideItem {
  path: string;
  title: string;
  description: string;
  nextStep?: string;
  position: 'top' | 'right' | 'bottom' | 'left';
  element?: string;
}

export default function ElMatadorGuide() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [currentGuide, setCurrentGuide] = useState<GuideItem | null>(null);
  const [elMatadorEnabled, setElMatadorEnabled] = useState(false);

  // Guide configuration for different pages
  const guides: Record<string, GuideItem> = {
    '/dashboard': {
      path: '/dashboard',
      title: 'Your Financial Dashboard',
      description: 'This is your main dashboard showing your financial health, wallet, expenses, goals, and investment opportunities. Check your Financial Health Score to see how you\'re doing.',
      nextStep: '/dashboard/elmatador',
      position: 'top',
      element: '#financial-health-score'
    },
    '/dashboard/elmatador': {
      path: '/dashboard/elmatador',
      title: 'El Matador Services',
      description: 'Here you can access all El Matador financial services. Start by completing your financial profile if you haven\'t already.',
      nextStep: '/profile',
      position: 'top',
      element: '#el-matador-services'
    },
    '/profile': {
      path: '/profile',
      title: 'Your Financial Profile',
      description: 'Complete your financial profile to get personalized recommendations. The more information you provide, the better advice you\'ll receive.',
      nextStep: '/investments',
      position: 'right',
      element: '#financial-profile-form'
    },
    '/investments': {
      path: '/investments',
      title: 'Investment Opportunities',
      description: 'Explore investment opportunities tailored to your risk profile and financial goals. El Matador will help you make informed decisions.',
      nextStep: '/assistant',
      position: 'left',
      element: '#investment-list'
    },
    '/assistant': {
      path: '/assistant',
      title: 'Ask El Matador',
      description: 'Have financial questions? Ask El Matador anything about investing, saving, budgeting, or financial planning.',
      position: 'bottom',
      element: '#chat-input'
    }
  };

  // Check if El Matador is enabled from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const enabled = localStorage.getItem('elMatadorEnabled');
      // Default to enabled if no preference is set
      setElMatadorEnabled(enabled === null ? true : enabled === 'true');
      
      // If it's the first time enabling El Matador, show the guide
      if (enabled === null || enabled === 'true') {
        if (localStorage.getItem('elMatadorFirstTime') !== 'false') {
          setIsOpen(true);
          localStorage.setItem('elMatadorFirstTime', 'false');
        }
      }
    }
  }, []);

  // Update current guide based on pathname
  useEffect(() => {
    if (pathname && guides[pathname]) {
      setCurrentGuide(guides[pathname]);
    } else {
      // Find partial matches (for dynamic routes)
      const matchingPath = Object.keys(guides).find(path => 
        pathname?.startsWith(path) && path !== '/'
      );
      
      if (matchingPath) {
        setCurrentGuide(guides[matchingPath]);
      } else {
        setCurrentGuide(null);
      }
    }
  }, [pathname]);

  // Toggle El Matador mode
  const toggleElMatador = () => {
    const newState = !elMatadorEnabled;
    setElMatadorEnabled(newState);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('elMatadorEnabled', newState.toString());
      
      // If turning on and it's the first time, show the guide
      if (newState && localStorage.getItem('elMatadorFirstTime') !== 'false') {
        setIsOpen(true);
        localStorage.setItem('elMatadorFirstTime', 'false');
      }
    }
  };

  // Handle guide dismissal
  const handleClose = () => {
    setIsOpen(false);
  };

  // Navigate to next step
  const handleNextStep = () => {
    if (currentGuide?.nextStep) {
      router.push(currentGuide.nextStep);
    } else {
      setIsOpen(false);
    }
  };

  if (!elMatadorEnabled) {
    return (
      <button
        onClick={toggleElMatador}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-50"
        title="Enable El Matador Guide"
      >
        <LightBulbIcon className="h-6 w-6" />
      </button>
    );
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={toggleElMatador}
        className={`fixed bottom-4 right-4 ${elMatadorEnabled ? 'bg-yellow-500' : 'bg-indigo-600'} text-white p-3 rounded-full shadow-lg hover:bg-opacity-90 transition-colors z-50`}
        title={elMatadorEnabled ? "Disable El Matador Guide" : "Enable El Matador Guide"}
      >
        <LightBulbIcon className="h-6 w-6" />
      </button>
      
      {/* Guide popup */}
      {isOpen && currentGuide && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-600 sm:mx-0 sm:h-10 sm:w-10">
                    <LightBulbIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-indigo-400" id="modal-title">
                      {currentGuide.title}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-300">
                        {currentGuide.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {currentGuide.nextStep ? (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleNextStep}
                  >
                    Next Step <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleClose}
                  >
                    Got it
                  </button>
                )}
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-500 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleClose}
                >
                  Skip Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Status indicator */}
      {elMatadorEnabled && !isOpen && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center">
          <LightBulbIcon className="h-5 w-5 text-yellow-400 mr-2" />
          <span className="text-sm">El Matador Guide Active</span>
          <button
            onClick={handleClose}
            className="ml-2 text-gray-400 hover:text-gray-300"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  );
} 