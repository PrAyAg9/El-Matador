'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange } from '@/lib/firebase/auth';
import { useRouter, usePathname } from 'next/navigation';

// Define the Auth context type
interface AuthContextType {
  user: User | null;
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
  '/assistant'
];

// Auth provider component that wraps the app
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
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