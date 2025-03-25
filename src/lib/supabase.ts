
import { createClient } from "@supabase/supabase-js";
import { getEnvVars } from "@/utils/fabric";

// Get environment variables
const { SUPABASE_URL, SUPABASE_ANON_KEY } = getEnvVars();

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
