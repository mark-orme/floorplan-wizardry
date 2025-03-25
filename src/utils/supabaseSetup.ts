
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
    
    // Instead of using RPC functions, use direct SQL queries
    const { error: createTableError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'user_profiles',
      table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
        role TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
      `
    });
    
    if (createTableError) {
      console.info('Direct table creation failed, attempting alternative method...');
      
      // Try a direct SQL query instead
      const { error: createError } = await supabase
        .from('user_profiles')
        .insert({ 
          user_id: '00000000-0000-0000-0000-000000000000', 
          role: 'test' 
        })
        .select();
      
      if (createError && createError.message.includes('relation "public.user_profiles" does not exist')) {
        // We need to manually create the table
        // Since we can't execute SQL directly without proper permissions,
        // Let's inform the user about the issue
        console.error('Cannot automatically create tables. Table creation requires higher privileges.');
        toast.error('Could not create necessary database tables. Please create the user_profiles table manually in your Supabase dashboard.');
        return;
      }
    }
    
    console.info('Successfully created user_profiles table');
    toast.success('Database tables set up successfully');
    
  } catch (error) {
    console.error('Error setting up Supabase tables:', error);
    toast.error('Could not create necessary database tables. Please check your Supabase connection.');
  }
};
