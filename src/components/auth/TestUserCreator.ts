
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface TestUserCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export async function createTestUser(credentials: TestUserCredentials): Promise<boolean> {
  try {
    // First check if user exists
    const { data: existingUsers, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', credentials.email);
    
    if (fetchError) {
      console.error('Error checking for existing user:', fetchError);
      toast.error('Failed to check for existing user');
      return false;
    }
    
    if (existingUsers && existingUsers.length > 0) {
      console.log('User already exists');
      toast.info('Test user already exists');
      return true;
    }
    
    // Create user with Supabase auth
    // Note: We're using the proper Supabase auth method here
    const { data: authData, error: authError } = await supabase.auth.signUp({
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
    
    if (authError) {
      console.error('Error creating test user auth:', authError);
      toast.error(`Failed to create test user: ${authError.message}`);
      return false;
    }
    
    // Create user profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: authData.user.id,
            role: credentials.role || 'user'
          }
        ]);
      
      if (profileError) {
        console.error('Error creating user profile:', profileError);
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Error logging in as test user:', error);
      toast.error(`Failed to log in: ${error.message}`);
      return false;
    }
    
    if (data.user) {
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
