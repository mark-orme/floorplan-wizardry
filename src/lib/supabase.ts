import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Define enum for user roles
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  PHOTOGRAPHER = 'photographer',
  USER = 'user',
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
  // Replace getConfig with correct API
  return supabase.storage.from('assets').getPublicUrl('');
};
