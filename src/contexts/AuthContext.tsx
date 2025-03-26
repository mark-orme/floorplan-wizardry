
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, UserRole, getUserRole } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { setupSupabaseTables } from '@/utils/supabaseSetup';

/**
 * Auth context type definition
 */
export interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  hasAccess: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId: string): Promise<void> => {
    if (!userId) return;
    try {
      const role = await getUserRole(userId);
      console.log('Fetched user role:', role);
      setUserRole(role);
    } catch (error: any) {
      console.error('Error fetching user role:', error);
      
      if (error.message && error.message.includes("relation \"public.user_profiles\" does not exist")) {
        console.warn("The user_profiles table doesn't exist. Check the console for SQL to create it.");
        
        // Try to determine a role based on email for testing purposes
        if (user?.email) {
          if (user.email.includes('photographer')) {
            setUserRole(UserRole.PHOTOGRAPHER);
            console.info(`Added temporary profile for user: ${user.email}`);
          } else if (user.email.includes('processing')) {
            setUserRole(UserRole.PROCESSING_MANAGER);
            console.info(`Added temporary profile for user: ${user.email}`);
          } else if (user.email.includes('manager')) {
            setUserRole(UserRole.MANAGER);
            console.info(`Added temporary profile for user: ${user.email}`);
          } else {
            setUserRole(UserRole.PHOTOGRAPHER);
          }
        }
      }
    }
  };

  useEffect(() => {
    // Run the Supabase table setup
    setupSupabaseTables();
    
    const initializeAuth = async (): Promise<void> => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user?.id) {
        await fetchUserRole(session.user.id);
      }
      
      setLoading(false);
    };
    
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('Auth state changed:', _event, session ? 'session exists' : 'no session');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user?.id) {
          await fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // Fetch user role after successful sign in
      if (data.user) {
        await fetchUserRole(data.user.id);
      }
      
      toast.success('Signed in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, role: UserRole = UserRole.PHOTOGRAPHER): Promise<void> => {
    try {
      const { error, data } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: data.user.id,
            role: role,
            created_at: new Date().toISOString()
          });
          
        if (profileError) throw profileError;
        
        // Set the user role immediately after signup
        setUserRole(role);
      }
      
      toast.success('Sign up successful! Check your email for confirmation.');
    } catch (error: any) {
      toast.error(error.message || 'Error signing up');
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setUserRole(null);
      toast.info('Signed out');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
    }
  };

  const hasAccess = (requiredRoles: UserRole[]): boolean => {
    return !!userRole && requiredRoles.includes(userRole);
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      userRole,
      loading, 
      signIn, 
      signUp, 
      signOut,
      hasAccess
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
