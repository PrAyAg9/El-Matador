'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { auth, db, firestore } from '@/lib/firebase/config';
import { UserData } from '@/lib/firebase/auth';

// Import our mock firestore functions
const { doc, setDoc, getDoc } = firestore;

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  user: UserData | null;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
  loading: true,
  user: null,
  logout: async () => {},
  isAuthenticated: false
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserData(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Create a default user document if none exists
  const createDefaultUserDocument = async (user: User): Promise<UserData> => {
    const defaultUserData: UserData = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: new Date(),
      lastLogin: new Date(),
      preferences: {
        theme: 'dark',
        notifications: true,
      },
      financialProfile: {
        incomeRange: '50k-100k',
        investmentGoals: ['retirement', 'wealth'],
        riskTolerance: 'medium',
      }
    };
    
    try {
      await setDoc(doc(db, 'users', user.uid), defaultUserData);
      console.log('Created default user document');
    } catch (error) {
      console.error('Error creating default user document:', error);
    }
    
    return defaultUserData;
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? `User: ${user.uid}` : 'No user');
      setCurrentUser(user);
      
      if (user) {
        try {
          // Get user data from mock Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            console.log('User document found');
            const data = userDoc.data();
            setUserData(data);
          } else {
            console.log('No user document found, creating default');
            const newUserData = await createDefaultUserDocument(user);
            setUserData(newUserData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // If there's an error getting the document, create a local user object
          const fallbackUserData: UserData = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            createdAt: new Date(),
            lastLogin: new Date()
          };
          setUserData(fallbackUserData);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    user: userData,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 