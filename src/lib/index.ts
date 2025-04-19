
/**
 * Lib barrel file
 * Re-exports services and utilities
 * @module lib
 */

// Export supabase client and types
export { 
  supabase, 
  UserRole, 
  isSecureConnection,
  isSupabaseConfigured
} from './supabase';

// Export utility functions
export { cn, formatDate } from './utils';

// Export any other library functions or services here
