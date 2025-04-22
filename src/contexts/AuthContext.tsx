
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  login: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>; // Alias for login
  logout: () => Promise<void>;
  isLoading: boolean;
  loading: boolean; // Added for compatibility
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: UserRole.USER,
  login: async () => {},
  signIn: async () => {},
  logout: async () => {},
  isLoading: false,
  loading: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.USER);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (!error && data.user) {
          // In a real app, we'd fetch the user's profile to get their role
          setUser({
            id: 'mock-user-id',
            email: 'user@example.com',
            name: 'Test User'
          });
          setUserRole(UserRole.USER);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call supabase.auth.signInWithPassword
      // For now, simulating a successful login
      setUser({
        id: 'mock-user-id',
        email: email,
        name: 'Test User'
      });
      setUserRole(UserRole.USER);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call supabase.auth.signOut
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create the context value
  const contextValue: AuthContextType = {
    user,
    userRole,
    login,
    signIn: login, // Alias for login
    logout,
    isLoading,
    loading: isLoading // Added for compatibility
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
