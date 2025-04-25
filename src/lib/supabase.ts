
/**
 * Supabase client and types
 */

export type UserRole = 'admin' | 'manager' | 'user' | 'guest';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  avatarUrl?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: Error | null;
}

// Mock functions for authentication
export const supabaseAuth = {
  getUser: async (): Promise<User | null> => {
    return null;
  },
  signIn: async (email: string, password: string): Promise<{ user: User | null, error: Error | null }> => {
    return { user: null, error: null };
  },
  signOut: async (): Promise<void> => {}
};
