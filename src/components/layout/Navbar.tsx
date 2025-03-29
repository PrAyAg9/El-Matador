'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  HiOutlineMenuAlt3, 
  HiOutlineX, 
  HiOutlineLogout,
  HiOutlineUser
} from 'react-icons/hi';
import { signOutUser } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { onAuthStateChange } from '@/lib/firebase/auth';
import { User } from 'firebase/auth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChange((authUser) => {
      setUser(authUser);
    });
    
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <div className="relative w-10 h-10 mr-2">
                  <Image
                    src="/matador.png"
                    alt="El Matador"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <span className="text-white font-bold text-xl">El Matador</span>
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Home
              </Link>
              
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/dashboard') 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              
              {user ? (
                <div className="flex items-center ml-6 space-x-2">
                  <div className="text-gray-300 text-sm flex items-center">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-2">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full" />
                      ) : (
                        <HiOutlineUser className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="hidden lg:inline">{user.displayName || user.email}</span>
                  </div>
                  
                  <button
                    onClick={handleSignOut}
                    className="ml-2 flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600"
                  >
                    <HiOutlineLogout className="mr-1" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <HiOutlineX className="block h-6 w-6" />
              ) : (
                <HiOutlineMenuAlt3 className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${isOpen ? 'block' : 'hidden'} md:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/') 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            onClick={closeMenu}
          >
            Home
          </Link>
          
          <Link
            href="/dashboard"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/dashboard') 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            onClick={closeMenu}
          >
            Dashboard
          </Link>
          
          {user ? (
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  {user.photoURL ? (
                    <img 
                      className="h-10 w-10 rounded-full" 
                      src={user.photoURL} 
                      alt="User profile"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">
                    {user.displayName || 'User'}
                  </div>
                  <div className="text-sm font-medium leading-none text-gray-400 mt-1">
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={() => {
                    handleSignOut();
                    closeMenu();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="block w-full mt-4 text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              onClick={closeMenu}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 