
import { createClient } from '@supabase/supabase-js';

// Supabase client setup
export const supabase = createClient(
  'https://your-project-url.supabase.co',
  'your-anon-key'
);

// Enums for database values
export enum UserRole {
  USER = 'user',
  PHOTOGRAPHER = 'photographer',
  PROCESSING_MANAGER = 'processing_manager',
  MANAGER = 'manager',
  ADMIN = 'admin'
}

export enum PropertyStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

// Add missing exports
export const isSecureConnection = () => {
  return window.location.protocol === 'https:';
};

export const isSupabaseConfigured = () => {
  return supabase.supabaseUrl !== 'https://your-project-url.supabase.co';
};

// This is a mock for development environment
export const mockSupabase = {
  auth: {
    getUser: async () => {
      return {
        data: {
          user: {
            id: 'mock-user-id',
            email: 'user@example.com'
          }
        },
        error: null
      };
    },
    signInWithPassword: async (credentials: { email: string; password: string }) => {
      return {
        data: {
          user: {
            id: 'mock-user-id',
            email: credentials.email
          },
          session: {
            access_token: 'mock-token'
          }
        },
        error: null
      };
    },
    signOut: async () => {
      return { error: null };
    }
  }
};
