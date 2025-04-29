
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);
