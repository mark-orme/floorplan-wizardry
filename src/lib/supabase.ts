
import { createClient } from '@supabase/supabase-js';

// User type definition
export interface User {
  id: string;
  email?: string;
  role?: UserRole;
}

// User role enum
export enum UserRole {
  PHOTOGRAPHER = 'photographer',
  PROCESSING_MANAGER = 'processing_manager',
  MANAGER = 'manager',
  ADMIN = 'admin'
}

// Initialize the Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

// Alias for backwards compatibility
export const supabaseAuth = supabase;
