
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/lib/supabase';

export interface TestUser {
  email: string;
  password: string;
  role: UserRole;
  label: string;
}

export const createTestUser = async (user: TestUser) => {
  try {
    // Check if user already exists (using auth API directly)
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail(user.email);
    
    if (authUser) {
      console.log('User already exists:', user.email);
      return authUser;
    }

    // Create new user
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        role: user.role
      }
    });

    if (error) throw error;
    return data;

  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
};

export const deleteTestUser = async (email: string) => {
  try {
    // Find the user by email
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail(email);

    if (authError) {
      console.error('Error fetching user to delete:', authError);
      throw authError;
    }

    if (!authUser) {
      console.log('User not found:', email);
      return;
    }

    // Delete the user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(authUser.id);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      throw deleteError;
    }

    console.log('User deleted successfully:', email);

  } catch (error) {
    console.error('Error deleting test user:', error);
    throw error;
  }
};
