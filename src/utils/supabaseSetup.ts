
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserRole } from '@/lib/supabase';

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

/**
 * Insert test data directly into Supabase tables
 * This is for development purposes only
 */
export const insertTestData = async (): Promise<void> => {
  try {
    console.info('Inserting test data into Supabase...');
    
    // Check if user is logged in first
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('You must be logged in to insert test data');
      return;
    }

    // 1. Add test properties
    const { data: propertyData, error: propertyError } = await supabase
      .from('properties')
      .insert([
        {
          order_id: 'TEST-001',
          address: '123 Test Street, Test City',
          client_name: 'Test Client 1',
          branch_name: 'Test Branch',
          created_by: session.user.id,
          status: 'draft',
          floor_plans: [
            {
              strokes: [],
              label: 'Ground Floor',
              paperSize: 'infinite',
              id: `floor-${Date.now()}-1`,
              name: 'Ground Floor',
              gia: 0
            }
          ]
        },
        {
          order_id: 'TEST-002',
          address: '456 Sample Avenue, Example Town',
          client_name: 'Test Client 2',
          created_by: session.user.id,
          status: 'pending_review',
          floor_plans: [
            {
              strokes: [],
              label: 'First Floor',
              paperSize: 'infinite',
              id: `floor-${Date.now()}-2`,
              name: 'First Floor',
              gia: 0
            }
          ]
        }
      ])
      .select();

    if (propertyError) {
      throw propertyError;
    }

    // Add current user to user_profiles if they don't exist
    const { data: userExists } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (!userExists) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: session.user.id,
          role: UserRole.PHOTOGRAPHER,
          created_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Error adding user profile:', profileError);
      }
    }

    toast.success('Test data inserted successfully!');
    console.info('Test data inserted:', propertyData);
  } catch (error: any) {
    console.error('Error inserting test data:', error);
    toast.error(`Failed to insert test data: ${error.message}`);
  }
};
