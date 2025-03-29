'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { signOutUser } from '@/lib/firebase/auth';
import { useAuth } from '@/components/auth/AuthProvider';
import dynamic from 'next/dynamic';

// Dynamically import ElMatadorModal with no SSR
const ElMatadorModal = dynamic(
  () => import('./ElMatadorModal'),
  { ssr: false }
);

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiModeEnabled, setAiModeEnabled] = useState(false);
  const [showAIModePrompt, setShowAIModePrompt] = useState(false);
  const [showElMatadorModal, setShowElMatadorModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show AI mode prompt on first load
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    const hasSeenAIPrompt = localStorage.getItem('hasSeenAIPrompt');
    if (!hasSeenAIPrompt) {
      setTimeout(() => {
        setShowAIModePrompt(true);
      }, 1000);
    }

    // Check if AI mode was previously enabled
    const aiModeEnabledString = localStorage.getItem('aiModeEnabled');
    if (aiModeEnabledString === 'true') {
      setAiModeEnabled(true);
    }
  }, []);

  // Show El Matador modal on dashboard load
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    if (pathname === '/dashboard') {
      const hasSeenElMatadorModal = localStorage.getItem('hasSeenElMatadorModal');
      if (!hasSeenElMatadorModal) {
        setShowElMatadorModal(true);
      }
    }
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const enableAIMode = () => {
    setAiModeEnabled(true);
    setShowAIModePrompt(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenAIPrompt', 'true');
      localStorage.setItem('aiModeEnabled', 'true');
    }
  };

  const dismissAIPrompt = () => {
    setShowAIModePrompt(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenAIPrompt', 'true');
    }
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
      href: '/dashboard/investments', 
      current: pathname === '/dashboard/investments',
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
      href: '/dashboard/profile', 
      current: pathname === '/dashboard/profile',
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
      {/* Show El Matador modal */}
      {showElMatadorModal && <ElMatadorModal />}
      
      {/* Show AI mode prompt */}
      {showAIModePrompt && <AIModePrompt />}

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-gray-800 border-r border-gray-700">
              <div className="flex items-center flex-shrink-0 px-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 relative mr-3">
                    <Image 
                      src="/matador.png" 
                      alt="El Matador Logo" 
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
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
              </div>

              {/* User Profile & Logout */}
              <div className="flex flex-shrink-0 p-4 border-t border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="User avatar" className="w-8 h-8 rounded-full" />
                      ) : (
                        <span className="text-white text-sm font-medium">
                          {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.displayName || user?.email || 'User'}
                    </p>
                    <button
                      onClick={handleSignOut}
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center mt-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm4.707 5.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 12H12a1 1 0 100-2H6.414l1.293-1.293z" clipRule="evenodd" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sidebar toggle */}
        <div className="md:hidden fixed top-0 left-0 z-20 p-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-10 flex md:hidden">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="relative flex flex-col flex-1 w-full max-w-xs bg-gray-800">
              <div className="absolute top-0 right-0 p-1">
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 relative mr-3">
                      <Image 
                        src="/matador.png" 
                        alt="El Matador Logo" 
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xl font-bold text-indigo-400">El Matador</span>
                  </div>
                </div>
                <nav className="px-2 mt-8 space-y-1">
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
              
              {/* User Profile & Logout on mobile */}
              <div className="flex flex-shrink-0 p-4 border-t border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="User avatar" className="w-8 h-8 rounded-full" />
                      ) : (
                        <span className="text-white text-sm font-medium">
                          {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.displayName || user?.email || 'User'}
                    </p>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center mt-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm4.707 5.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 12H12a1 1 0 100-2H6.414l1.293-1.293z" clipRule="evenodd" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          <main className="relative flex-1 overflow-y-auto focus:outline-none">
            {/* Show the El Matador logo for mobile users at the top of the content */}
            <div className="md:hidden flex items-center justify-center pt-6 pb-2">
              <div className="flex items-center">
                <div className="h-10 w-10 relative mr-2">
                  <Image 
                    src="/matador.png" 
                    alt="El Matador Logo" 
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-indigo-400">El Matador</span>
              </div>
            </div>
            
            <div className="py-6">
              <div className="px-4 mx-auto sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 