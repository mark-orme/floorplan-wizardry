
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name?: string;
  isAuthenticated: boolean;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        // This would typically be an API call to check the session
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          // Parse stored user and set the state
          const parsedUser: User = JSON.parse(storedUser);
          setUser({
            ...parsedUser,
            isAuthenticated: true // Ensure this property exists
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to check authentication status'));
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // This would be an API call in a real app
      if (email && password) {
        const newUser: User = {
          id: 'user-123',
          email,
          isAuthenticated: true
        };
        
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
      } else {
        throw new Error('Email and password are required');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to login'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // This would be an API call in a real app
      localStorage.removeItem('user');
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to logout'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      setIsLoading(true);
      
      // This would be an API call in a real app
      if (email && password) {
        const newUser: User = {
          id: 'user-' + Date.now(),
          email,
          name,
          isAuthenticated: true
        };
        
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
      } else {
        throw new Error('Email and password are required');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to signup'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      
      // This would be an API call in a real app
      if (!email) {
        throw new Error('Email is required');
      }
      
      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to reset password'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    logout,
    signup,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
