
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
    // Check if user already exists
    const { data: existingUser, error: getUserError } = await supabase.auth.admin.listUsers({
      filter: { email: user.email }
    });
    
    if (existingUser?.users && existingUser.users.length > 0) {
      console.log('User already exists:', user.email);
      return existingUser.users[0];
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

export const loginAsTestUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error logging in as test user:', error);
    throw error;
  }
};

export const deleteTestUser = async (email: string) => {
  try {
    // Find the user by email
    const { data: users, error: getUserError } = await supabase.auth.admin.listUsers({
      filter: { email }
    });

    if (getUserError) {
      console.error('Error fetching user to delete:', getUserError);
      throw getUserError;
    }

    if (!users?.users || users.users.length === 0) {
      console.log('User not found:', email);
      return;
    }

    const userId = users.users[0].id;

    // Delete the user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

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
