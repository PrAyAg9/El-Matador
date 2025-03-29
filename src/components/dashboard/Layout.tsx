'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { signOutUser } from '@/lib/firebase/auth';
import { useAuth } from '@/context/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { currentUser, userData } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiModeEnabled, setAiModeEnabled] = useState(false);
  const [showAIModePrompt, setShowAIModePrompt] = useState(false);

  // Show AI mode prompt on first load
  useEffect(() => {
    const hasSeenAIPrompt = localStorage.getItem('hasSeenAIPrompt');
    if (!hasSeenAIPrompt) {
      setTimeout(() => {
        setShowAIModePrompt(true);
      }, 1000);
    }
  }, []);

  const handleSignOut = async () => {
    try {
      // Check if this is a test user bypass
      const bypassAuth = localStorage.getItem('bypassAuth');
      if (bypassAuth === 'true') {
        console.log('Logging out test user...');
        localStorage.removeItem('bypassAuth');
        localStorage.removeItem('testUser');
        localStorage.removeItem('cachedUserInfo');
        
        // Clear the bypass cookie
        document.cookie = "bypassAuth=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT";
        
        router.push('/');
        return;
      }
      
      // Normal sign out process
      await signOutUser();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const enableAIMode = () => {
    setAiModeEnabled(true);
    setShowAIModePrompt(false);
    localStorage.setItem('hasSeenAIPrompt', 'true');
    localStorage.setItem('aiModeEnabled', 'true');
  };

  const dismissAIPrompt = () => {
    setShowAIModePrompt(false);
    localStorage.setItem('hasSeenAIPrompt', 'true');
  };

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      current: pathname === '/dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      )
    },
    {
      name: 'El Matador Services',
      href: '/dashboard/elmatador',
      current: pathname === '/dashboard/elmatador',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      name: 'Investments', 
      href: '/investments', 
      current: pathname === '/investments',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      )
    },
    { 
      name: 'El Matador Assistant', 
      href: '/assistant', 
      current: pathname === '/assistant',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      name: 'Profile', 
      href: '/profile', 
      current: pathname === '/profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      )
    },
  ];

  // AI Mode Prompt Component
  const AIModePrompt = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="w-full max-w-md p-6 mx-4 bg-gray-800 rounded-lg shadow-xl">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white bg-indigo-600 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-center text-white">Activate El Matador</h3>
        <p className="mb-6 text-sm text-center text-gray-300">
          Would you like to enable the full AI financial advisor experience? El Matador will provide you with personalized insights and recommendations.
        </p>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <button
            onClick={enableAIMode}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Enable El Matador
          </button>
          <button
            onClick={dismissAIPrompt}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Show AI mode prompt */}
      {showAIModePrompt && <AIModePrompt />}

      {/* AI Mode Indicator */}
      {aiModeEnabled && (
        <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M5 11a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0c0 1.677-.345 3.276-.968 4.729a1 1 0 11-1.838-.789A9.964 9.964 0 005 11zm8.921 2.012a1 1 0 01.831 1.145 19.86 19.86 0 01-.545 2.436 1 1 0 11-1.92-.558c.207-.713.371-1.445.49-2.192a1 1 0 011.144-.83z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M10 10a1 1 0 011 1c0 2.236-.46 4.368-1.29 6.304a1 1 0 01-1.838-.789A13.952 13.952 0 009 11a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          El Matador Mode Enabled
        </div>
      )}

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-gray-800 border-r border-gray-700">
              <div className="flex items-center flex-shrink-0 px-4">
                <div className="flex items-center">
                  <img 
                    src="/matador.png" 
                    alt="El Matador Logo" 
                    className="h-10 w-auto mr-3" 
                  />
                  <span className="text-xl font-bold text-indigo-400">El Matador</span>
                </div>
              </div>
              <div className="flex flex-col flex-grow px-4 mt-8">
                <nav className="flex-1 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                        item.current
                          ? 'bg-gray-700 text-indigo-400'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <div className={`mr-3 ${
                        item.current ? 'text-indigo-400' : 'text-gray-400 group-hover:text-gray-300'
                      }`}>
                        {item.icon}
                      </div>
                      {item.name}
                    </Link>
                  ))}
                </nav>
                {!aiModeEnabled && (
                  <div className="p-4 mt-6 bg-gray-700 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-indigo-300">El Matador Mode</h3>
                        <div className="mt-2 text-sm text-gray-300">
                          <p>
                            Enhance your experience with our AI-powered assistant.
                          </p>
                        </div>
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={enableAIMode}
                            className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
                          >
                            Enable El Matador <span aria-hidden="true">&rarr;</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 mt-auto border-t border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-400">
                        {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-300 truncate">
                      {currentUser?.displayName || currentUser?.email}
                    </p>
                    <button
                      onClick={handleSignOut}
                      className="text-xs font-medium text-gray-400 hover:text-gray-300"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile header */}
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          <div className="relative z-10 flex h-16 flex-shrink-0 border-b border-gray-700 bg-gray-800 md:hidden">
            <button
              type="button"
              className="px-4 text-gray-400 border-r border-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex justify-between flex-1 px-4">
              <div className="flex flex-1">
                <div className="flex items-center w-full md:ml-0">
                  <Link href="/dashboard" className="flex items-center">
                    <img 
                      src="/matador.png" 
                      alt="El Matador Logo" 
                      className="h-8 w-auto mr-2" 
                    />
                    <span className="text-xl font-bold text-indigo-400">El Matador</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <main className="relative flex-1 overflow-y-auto focus:outline-none bg-gray-800">
            <div className="py-6">
              <div className="px-4 mx-auto sm:px-6 md:px-8">
                <div className="text-white">{children}</div>
              </div>
            </div>
          </main>
          
          {/* Mobile menu, show/hide based on mobileMenuOpen state */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-40 flex md:hidden">
              {/* Overlay */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-75"
                onClick={() => setMobileMenuOpen(false)}
              />
              
              {/* Sidebar */}
              <div className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-gray-800">
                <div className="absolute top-0 right-0 pt-2 -mr-12">
                  <button
                    type="button"
                    className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center flex-shrink-0 px-4">
                  <div className="flex items-center">
                    <img 
                      src="/matador.png" 
                      alt="El Matador Logo" 
                      className="h-10 w-auto mr-3" 
                    />
                    <span className="text-xl font-bold text-indigo-400">El Matador</span>
                  </div>
                </div>
                <div className="flex flex-col flex-grow px-4 mt-8 overflow-y-auto">
                  <nav className="flex-1 space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                          item.current
                            ? 'bg-gray-700 text-indigo-400'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className={`mr-3 ${
                          item.current ? 'text-indigo-400' : 'text-gray-400 group-hover:text-gray-300'
                        }`}>
                          {item.icon}
                        </div>
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
                
                <div className="p-4 mt-auto border-t border-gray-700">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-400">
                          {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-300 truncate">
                        {currentUser?.displayName || currentUser?.email}
                      </p>
                      <button
                        onClick={handleSignOut}
                        className="text-xs font-medium text-gray-400 hover:text-gray-300"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 