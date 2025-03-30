
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Mock authentication check - replace with real auth once implemented
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('userRole');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setUserRole(storedRole as UserRole);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Mock login function - replace with real auth once implemented
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user
      const user = { id: '1', email, name: email.split('@')[0] };
      const role = UserRole.PHOTOGRAPHER;
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', role);
      
      setUser(user);
      setUserRole(role);
    } finally {
      setLoading(false);
    }
  };

  // Alias for login
  const signIn = login;

  // Mock logout function - replace with real auth once implemented
  const logout = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      
      setUser(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  // Mock register function - replace with real auth once implemented
  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user
      const user = { id: '1', email, name };
      const role = UserRole.PHOTOGRAPHER;
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', role);
      
      setUser(user);
      setUserRole(role);
    } finally {
      setLoading(false);
    }
  };

  // Handle signup with role
  const signUp = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user
      const user = { id: '1', email, name: email.split('@')[0] };
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', role);
      
      setUser(user);
      setUserRole(role);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userRole, 
      loading, 
      login, 
      logout, 
      register,
      signIn,
      signUp 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
