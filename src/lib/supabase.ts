
import { createClient } from '@supabase/supabase-js';

// Use Vite's import.meta.env instead of process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Define enum for user roles
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  PHOTOGRAPHER = 'photographer',
  USER = 'user',
  PROCESSING_MANAGER = 'processing_manager',
}

// Define a function to get the user role from claims
export const getUserRole = async (): Promise<UserRole | null> => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  // Check if user data exists and has user_claims
  if (data?.user?.app_metadata?.user_claims) {
    const userClaims = data.user.app_metadata.user_claims as { role: UserRole };
    return userClaims?.role || UserRole.USER; // Default to 'user' if role is not defined
  }

  return UserRole.USER; // Default to 'user' if no claims are found
};

// Fixing the getConfig issue
export const getStorageConfig = () => {
  // Use the correct API instead of getConfig
  return supabase.storage.from('assets').getPublicUrl('');
};

// Add missing exports that lib/index.ts expects
export const mockSupabase = supabase;
export enum PropertyStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
export const isSecureConnection = () => window.location.protocol === 'https:';
export const isSupabaseConfigured = () => !!supabaseUrl && !!supabaseKey;
