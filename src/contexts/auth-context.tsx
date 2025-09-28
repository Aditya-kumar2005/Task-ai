
'use client';

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Import useRouter and usePathname

// Define a simple user type, expand as needed
interface User {
  id: string;
  email: string;
  // Add other user properties like name, avatar, etc.
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // To handle initial auth state loading
  login: (userData: User) => void;
  logout: () => void;
  // signup function could be added here if context manages it post-backend call
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true
  const router = useRouter();
  const pathname = usePathname();

  // Simulate checking auth status on mount (e.g., from localStorage or a token)
  useEffect(() => {
    // In a real app, you'd check for a token, validate it, and fetch user data.
    // For this mock, we'll assume the user is not logged in initially.
    // You could use localStorage to persist a mock session:
    try {
      const storedUser = localStorage.getItem('taskai-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      // Potentially clear corrupted storage
      localStorage.removeItem('taskai-user');
    }
    setIsLoading(false); // Finished loading initial auth state
  }, []);


  const login = (userData: User) => {
    setUser(userData);
    try {
      localStorage.setItem('taskai-user', JSON.stringify(userData));
    } catch (error) {
    }
    // Optionally redirect after login, or let the page handle it
    // router.push('/dashboard'); 
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('taskai-user');
    } catch (error) {
    }
    router.push('/login'); // Redirect to login after logout
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
