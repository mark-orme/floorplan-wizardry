
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Checks if the user_profiles table exists in Supabase
 * @returns Promise<boolean> True if the table exists
 */
const checkIfTableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1);
    
    // If no error, table exists
    return !error;
  } catch {
    return false;
  }
};

/**
 * Creates necessary database tables in Supabase if they don't exist
 * This is a temporary solution for development environments
 */
export const setupSupabaseTables = async (): Promise<void> => {
  try {
    console.info('Checking if necessary Supabase tables exist...');
    
    // Check if user_profiles table exists
    const tableExists = await checkIfTableExists('user_profiles');
    
    // If table exists, we're good to go
    if (tableExists) {
      console.info('user_profiles table already exists');
      return;
    }
    
    console.info('user_profiles table does not exist, notifying user...');
    
    // Instead of trying to create the table (which fails due to permission issues),
    // provide clear guidance to the user
    toast.info(
      'The user_profiles table needs to be created in your Supabase dashboard. Please run the SQL provided in the console.',
      { duration: 10000 }
    );
    
    // Log the SQL needed to create the table
    console.info('Please run this SQL in your Supabase dashboard:');
    console.info(`
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Optional: Set up Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Optional: Create policies
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);
`);
    
  } catch (error) {
    console.error('Error checking Supabase tables:', error);
    toast.error('Could not connect to Supabase. Please check your connection settings.');
  }
};
