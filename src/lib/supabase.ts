
import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/types/supabase';

const supabaseUrl = 'https://ovoljdbtmdcxlhrvnaul.supabase.co';
// This should be your public anon key, not the service key
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92b2xqZGJ0bWRjeGxocnZuYXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MDMxMjksImV4cCI6MjA1ODQ3OTEyOX0.-ggpCyY0F2zR2MtDN6RaThlZosUc9nr4jL-7tkvSNgs';

export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey
);

export default supabase;
