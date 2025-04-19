
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserRole } from '@/lib/supabase';

export interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  label: string;
}

export async function createTestUser(credentials: TestUser): Promise<boolean> {
  try {
    // First check if user exists
    const { data: existingUsers, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', credentials.email)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 means "no rows returned" which is expected if user doesn't exist
      console.error('Error checking for existing user:', fetchError);
      toast.error('Failed to check for existing user');
      return false;
    }
    
    if (existingUsers) {
      console.log('User already exists');
      toast.info('Test user already exists');
      return true;
    }
    
    // Create user with Supabase auth
    const authResponse = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          first_name: credentials.firstName,
          last_name: credentials.lastName,
          role: credentials.role || 'user'
        }
      }
    });
    
    if (authResponse.error) {
      console.error('Error creating test user auth:', authResponse.error);
      toast.error(`Failed to create test user: ${authResponse.error.message}`);
      return false;
    }
    
    // Create user profile
    if (authResponse.data?.user) {
      const profileResponse = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: authResponse.data.user.id,
            role: credentials.role || 'user'
          }
        ]);
      
      if (profileResponse.error) {
        console.error('Error creating user profile:', profileResponse.error);
        toast.error('Failed to create user profile');
        return false;
      }
      
      toast.success('Test user created successfully');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Unexpected error creating test user:', error);
    toast.error('Unexpected error creating test user');
    return false;
  }
}

export async function loginAsTestUser(email: string, password: string): Promise<boolean> {
  try {
    // Sign in with Supabase auth
    const authResponse = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (authResponse.error) {
      console.error('Error logging in as test user:', authResponse.error);
      toast.error(`Failed to log in: ${authResponse.error.message}`);
      return false;
    }
    
    if (authResponse.data?.user) {
      toast.success(`Logged in as ${email}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Unexpected error logging in:', error);
    toast.error('Unexpected error logging in');
    return false;
  }
}
