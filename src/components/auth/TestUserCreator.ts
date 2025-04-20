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
    const { data: existingUser } = await supabase
      .from('users')
      .select()
      .eq('email', user.email)
      .single();

    if (existingUser) {
      console.log('User already exists:', user.email);
      return existingUser;
    }

    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          role: user.role
        }
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
    const { data: userToDelete, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError) {
      console.error('Error fetching user to delete:', userError);
      throw userError;
    }

    if (!userToDelete) {
      console.log('User not found:', email);
      return;
    }

    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', userToDelete.id);

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
