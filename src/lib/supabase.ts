
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
