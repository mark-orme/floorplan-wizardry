
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/lib/supabase';

interface AuthContextType {
  user: any | null;
  userRole: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>; // Add login method
}

const defaultAuthContext: AuthContextType = {
  user: null,
  userRole: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  login: async () => {} // Add login method to default context
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const signIn = async (email: string, password: string) => {
    // This would normally connect to your auth service
    console.log('Sign in with:', email, password);
    // Simulate successful login
    setUser({ id: '1', email });
    setUserRole(UserRole.PHOTOGRAPHER);
  };

  // Add login method as an alias to signIn for backward compatibility
  const login = async (email: string, password: string) => {
    return signIn(email, password);
  };

  const signOut = async () => {
    // This would normally connect to your auth service
    setUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, signIn, signOut, login }}>
      {children}
    </AuthContext.Provider>
  );
};
