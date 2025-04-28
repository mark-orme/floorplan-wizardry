
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Define environment variables for TypeScript
interface ImportMetaEnv {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
}

interface SupabaseContextValue {
  supabase: SupabaseClient | null;
  user: any | null;
  loading: boolean;
}

const SupabaseContext = createContext<SupabaseContextValue>({
  supabase: null,
  user: null,
  loading: true,
});

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Handle environment variables for different environments
      // Using optional chaining to prevent errors when variables are undefined
      const supabaseUrl = import.meta?.env?.VITE_SUPABASE_URL || '';
      const supabaseAnonKey = import.meta?.env?.VITE_SUPABASE_ANON_KEY || '';
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase credentials not available');
        setLoading(false);
        return;
      }
      
      const client = createClient(supabaseUrl, supabaseAnonKey);
      setSupabase(client);

      // Set up auth state listener
      const { data: authListener } = client.auth.onAuthStateChange(async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      // Initialize user
      const initialSession = async () => {
        const { data } = await client.auth.getSession();
        setUser(data.session?.user ?? null);
        setLoading(false);
      };
      
      initialSession();

      return () => {
        authListener?.subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error initializing Supabase client:', error);
      setLoading(false);
    }
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase, user, loading }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export default SupabaseContext;
