
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface SupabaseContextType {
  supabase: SupabaseClient;
  isLoading: boolean;
  error: string | null;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Get Supabase URL and key from environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      // If not available, use default test values (should be replaced in production)
      const url = supabaseUrl || 'https://example.supabase.co';
      const key = supabaseKey || 'your-anon-key';

      const client = createClient(url, key);
      setSupabase(client);
      setIsLoading(false);
    } catch (err) {
      console.error('Error initializing Supabase client:', err);
      setError('Failed to connect to database');
      setIsLoading(false);
    }
  }, []);

  // Wait until supabase is initialized before rendering children
  if (isLoading) {
    return <div>Loading Supabase connection...</div>;
  }

  if (error || !supabase) {
    return <div>Error connecting to Supabase: {error}</div>;
  }

  return (
    <SupabaseContext.Provider value={{ supabase, isLoading, error }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  
  return context;
};

// Export the default context for type checking
export default SupabaseContext;
