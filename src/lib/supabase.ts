
import { createClient } from "@supabase/supabase-js";
import { getEnvVars } from "@/utils/fabric";
import { toast } from "sonner";

// Get environment variables
const { SUPABASE_URL, SUPABASE_ANON_KEY } = getEnvVars();

// Check if required environment variables are set
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.");
}

// Create Supabase client with fallback handling
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Add a method to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!SUPABASE_URL && !!SUPABASE_ANON_KEY;
};

// User roles
export enum UserRole {
  PHOTOGRAPHER = 'photographer',
  PROCESSING_MANAGER = 'processing_manager',
  MANAGER = 'manager'
}

// Get user role from Supabase profile
export const getUserRole = async (userId: string): Promise<UserRole | null> => {
  if (!isSupabaseConfigured() || !userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', userId)
      .single();
      
    if (error) throw error;
    return data?.role || null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
};

// Check if user has required role
export const hasRole = async (userId: string, requiredRoles: UserRole[]): Promise<boolean> => {
  const role = await getUserRole(userId);
  return !!role && requiredRoles.includes(role);
};
