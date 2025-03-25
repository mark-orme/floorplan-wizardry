
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Creates necessary database tables in Supabase if they don't exist
 * This is a temporary solution for development environments
 */
export const setupSupabaseTables = async (): Promise<void> => {
  try {
    console.info('Checking if necessary Supabase tables exist...');
    
    // Check if user_profiles table exists
    const { error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    // If table exists, we're good to go
    if (!checkError) {
      console.info('user_profiles table already exists');
      return;
    }
    
    // If error is not about missing table, something else is wrong
    if (!checkError.message.includes('relation "public.user_profiles" does not exist')) {
      console.error('Error checking for user_profiles table:', checkError.message);
      return;
    }
    
    console.info('Creating user_profiles table...');
    
    // Create user_profiles table with RLS enabled
    const { error: createError } = await supabase.rpc('create_user_profiles_table');
    
    if (createError) {
      // If the RPC method doesn't exist, try direct SQL
      console.info('RPC method not available, trying direct SQL...');
      
      const { error: sqlError } = await supabase.rpc('exec_sql', {
        sql_string: `
          CREATE TABLE IF NOT EXISTS public.user_profiles (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
            role TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
          );
          
          -- Set up Row Level Security
          ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
          
          -- Create policies
          CREATE POLICY "Users can view their own profile"
            ON public.user_profiles
            FOR SELECT
            USING (auth.uid() = user_id);
            
          CREATE POLICY "Users can update their own profile"
            ON public.user_profiles
            FOR UPDATE
            USING (auth.uid() = user_id);
        `
      });
      
      if (sqlError) {
        // Last resort: Let the user know they need to create the table manually
        console.error('Error creating user_profiles table:', sqlError.message);
        toast.error('Could not create necessary database tables. Please contact support.');
        return;
      }
    }
    
    console.info('Successfully created user_profiles table');
    toast.success('Database tables set up successfully');
    
  } catch (error) {
    console.error('Error setting up Supabase tables:', error);
  }
};
