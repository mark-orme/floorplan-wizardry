
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, UserRole, getUserRole } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userRole: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  hasAccess: (requiredRoles: UserRole[]) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user role from profile
  const fetchUserRole = async (userId: string) => {
    if (!userId) return;
    try {
      const role = await getUserRole(userId);
      setUserRole(role);
    } catch (error: any) {
      console.error('Error fetching user role:', error);
      
      // TEMPORARY FIX: If the user_profiles table doesn't exist yet,
      // we'll set a default role based on the email domain
      // This is just for development purposes
      if (error.message && error.message.includes("relation \"public.user_profiles\" does not exist")) {
        // Create a temporary user profile in memory based on email
        if (user?.email) {
          if (user.email.includes('photographer')) {
            setUserRole(UserRole.PHOTOGRAPHER);
            console.info(`Added profile for existing user: ${user.email}`);
          } else if (user.email.includes('processing')) {
            setUserRole(UserRole.PROCESSING_MANAGER);
            console.info(`Added profile for existing user: ${user.email}`);
          } else if (user.email.includes('manager')) {
            setUserRole(UserRole.MANAGER);
            console.info(`Added profile for existing user: ${user.email}`);
          } else {
            // Default fallback
            setUserRole(UserRole.PHOTOGRAPHER);
          }
        }
      }
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user?.id) {
        fetchUserRole(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user?.id) {
          fetchUserRole(session.user.id);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Signed in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, role: UserRole = UserRole.PHOTOGRAPHER) => {
    try {
      // Create user in auth
      const { error, data } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      
      // Create user profile with role
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: data.user.id,
            role: role,
            created_at: new Date().toISOString()
          });
          
        if (profileError) throw profileError;
      }
      
      toast.success('Sign up successful! Check your email for confirmation.');
    } catch (error: any) {
      toast.error(error.message || 'Error signing up');
      throw error;
    }
  };

  const signOut = async () => {
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
