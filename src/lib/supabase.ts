
import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/types/supabase';

const supabaseUrl = 'https://ovoljdbtmdcxlhrvnaul.supabase.co';
// This should be your public anon key, not the service key
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey || ''
);

export default supabase;
