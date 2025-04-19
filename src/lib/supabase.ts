
/**
 * Supabase integration module
 * Contains types and utilities for working with Supabase
 */

/**
 * User roles in the application
 */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  PHOTOGRAPHER = 'photographer',
  PROCESSING_MANAGER = 'processing_manager',
  USER = 'user'
}

/**
 * Property status in the application
 */
export enum PropertyStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PENDING_REVIEW = 'pending_review',
  COMPLETED = 'completed',
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

/**
 * User profile information
 */
export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  createdAt: string;
}

/**
 * Check if the current connection is secure (HTTPS or localhost)
 * @returns Boolean indicating if the connection is secure
 */
export function isSecureConnection(): boolean {
  if (typeof window === 'undefined') return true;
  
  return window.location.protocol === 'https:' || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1';
}

/**
 * Initialize Supabase client
 * This would normally connect to your Supabase instance
 */
export const initializeSupabase = () => {
  // In a real implementation, this would initialize the Supabase client
  console.info('Supabase client initialized');
};

// Mock Supabase client for development
export const supabase = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => ({ data: null, error: null })
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
        order: () => ({ data: [], error: null })
      }),
      order: () => ({ data: [], error: null }),
      in: () => ({
        order: () => ({ data: [], error: null })
      })
    }),
    insert: () => ({
      select: async () => ({ data: [], error: null })
    }),
    update: () => ({
      eq: async () => ({ data: null, error: null })
    })
  })
};

// Utility function to check if Supabase is configured
export const isSupabaseConfigured = () => true;
