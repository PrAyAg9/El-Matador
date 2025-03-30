'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange } from '@/lib/firebase/auth';
import { useRouter, usePathname } from 'next/navigation';

// Extended User type with custom properties
export interface ExtendedUser extends User {
  financialProfile?: {
    incomeRange?: string;
    investmentGoals?: string[];
    riskTolerance?: 'low' | 'medium' | 'high';
    // Add missing properties
    monthlyIncome?: string;
    monthlyExpenses?: Record<string, string>;
    goals?: string[];
    phone?: string;
  };
}

// Define the Auth context type
interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Protected routes - pages that require authentication
const protectedRoutes = [
  '/dashboard',
  '/dashboard/elmatador',
  '/dashboard/investments',
  '/dashboard/profile',
  '/dashboard/taxes',
  '/assistant'
];

// Auth provider component that wraps the app
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Load financial profile from localStorage
  const loadFinancialProfile = (authUser: User) => {
    if (typeof window !== 'undefined' && authUser) {
      try {
        // Try to get profile from localStorage
        const profileData = localStorage.getItem('userFinancialProfile');
        if (profileData) {
          const extendedUser = authUser as ExtendedUser;
          extendedUser.financialProfile = JSON.parse(profileData);
          
          // Save the enhanced user to localStorage for persistence
          localStorage.setItem('currentUser', JSON.stringify(extendedUser));
          
          return extendedUser;
        }
      } catch (error) {
        console.error('Error loading financial profile:', error);
      }
    }
    return authUser as ExtendedUser;
  };

  useEffect(() => {
    // Make sure we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    let unsubscribeFunction = () => {};
    
    try {
      // Subscribe to auth state changes
      unsubscribeFunction = onAuthStateChange((authUser) => {
        if (authUser) {
          // Load financial profile and set user
          const enrichedUser = loadFinancialProfile(authUser);
          setUser(enrichedUser);
          console.log('User is signed in:', authUser.uid, 'with profile:', enrichedUser.financialProfile ? 'yes' : 'no');
        } else {
          setUser(null);
          console.log('No user is signed in');
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Error setting up auth state listener:', error);
      setLoading(false);
    }

    // Cleanup subscription on unmount
    return () => {
      if (typeof unsubscribeFunction === 'function') {
        unsubscribeFunction();
      }
    };
  }, []);

  // Handle route protection
  useEffect(() => {
    if (!loading) {
      const isProtectedRoute = protectedRoutes.some(route => 
        pathname === route || pathname?.startsWith(`${route}/`)
      );
      
      // Redirect to login if trying to access protected route without authentication
      if (isProtectedRoute && !user) {
        console.log('Access denied: Redirecting to login page');
        router.push('/login');
      }
      
      // Redirect authenticated users away from login/registration pages
      if (user && (pathname === '/login' || pathname === '/auth/register')) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
} 