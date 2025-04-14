
import { UserRole } from './supabase';

/**
 * User roles in the application
 */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  PHOTOGRAPHER = 'photographer',
  CLIENT = 'client',
  GUEST = 'guest',
  PROCESSING_MANAGER = 'processing_manager'
}

// Placeholder for actual Supabase client
export const supabase = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    signIn: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    admin: {
      listUsers: async () => ({ data: { users: [] }, error: null }),
      deleteUser: async () => ({ error: null }),
      createUser: async () => ({ data: { user: null }, error: null })
    }
  },
  from: (table: string) => ({
    select: () => ({
      eq: (field: string, value: any) => ({
        single: () => ({ data: null, error: null }),
        maybeSingle: () => ({ data: null, error: null }),
        data: [],
        error: null
      }),
      single: () => ({ data: null, error: null }),
      maybeSingle: () => ({ data: null, error: null }),
      data: [],
      error: null,
      in: (field: string, values: any[]) => ({
        data: [],
        error: null,
        order: (field: string, options: any) => ({
          data: [],
          error: null
        })
      }),
      order: (field: string, options: any) => ({
        data: [],
        error: null
      }),
      limit: (num: number) => ({
        data: [],
        error: null
      })
    }),
    insert: (data: any) => {
      const result = { data: [], error: null };
      return {
        ...result,
        select: () => ({ data: [], error: null })
      };
    },
    update: (data: any) => {
      return {
        data: [],
        error: null,
        eq: (field: string, value: any) => ({
          data: [],
          error: null,
          select: () => ({ data: [], error: null })
        }),
        select: () => ({ data: [], error: null })
      };
    },
    delete: () => ({
      data: null,
      error: null,
      eq: (field: string, value: any) => ({
        data: null,
        error: null
      })
    }),
    eq: (field: string, value: any) => ({
      data: [],
      error: null,
      single: () => ({ data: null, error: null }),
      maybeSingle: () => ({ data: null, error: null })
    })
  })
};

// Define function to check if Supabase is configured
export const isSupabaseConfigured = () => true;

// Function to check if connection is secure
export const isSecureConnection = (): boolean => 
  window.location.protocol === 'https:' ||
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1';

// Define type for authentication
export type AuthResponse = {
  user: {
    id: string;
    email: string;
    role: UserRole;
  } | null;
  session: any | null;
  error: Error | null;
};

