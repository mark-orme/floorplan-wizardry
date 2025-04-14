
/**
 * TestUserCreator
 * Utility for creating test users during development
 */
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/lib/supabase';
import { toast } from 'sonner';

export const testUsers = [
  {
    email: 'photographer@example.com',
    password: 'test1234',
    role: UserRole.PHOTOGRAPHER,
    label: 'Photographer'
  },
  {
    email: 'processor@example.com',
    password: 'test1234',
    role: UserRole.PROCESSING_MANAGER,
    label: 'Processor'
  },
  {
    email: 'manager@example.com',
    password: 'test1234',
    role: UserRole.MANAGER,
    label: 'Manager'
  }
];

/**
 * Create test users for development purposes
 */
export const createTestUsers = async (): Promise<void> => {
  if (process.env.NODE_ENV !== 'development') {
    console.log('Test users are only created in development environment');
    return;
  }

  try {
    // Check if users already exist
    for (const testUser of testUsers) {
      const { data: existingUsers, error: fetchError } = await supabase
        .from('users')
        .select()
        .eq('email', testUser.email)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error(`Error checking for existing user ${testUser.email}:`, fetchError);
        continue;
      }

      // Skip if user already exists
      if (existingUsers) {
        console.log(`Test user ${testUser.email} already exists`);
        continue;
      }

      // Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signInWithPassword();

      if (signUpError) {
        console.error(`Error creating auth user ${testUser.email}:`, signUpError);
        continue;
      }

      const userId = authData?.user?.id;
      if (!userId) {
        console.error(`No user ID returned for ${testUser.email}`);
        continue;
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: testUser.email,
          role: testUser.role,
          name: testUser.email.split('@')[0],
          created_at: new Date().toISOString()
        });

      if (profileError) {
        console.error(`Error creating profile for ${testUser.email}:`, profileError);
      } else {
        console.log(`Created test user: ${testUser.email} (${testUser.role})`);
      }
    }

    console.log('Test user creation completed');
  } catch (error) {
    console.error('Error creating test users:', error);
    toast.error('Failed to create test users');
  }
};

/**
 * Verify if test users exist and are accessible
 */
export const verifyTestUsers = async (): Promise<boolean[]> => {
  const results: boolean[] = [];

  for (const testUser of testUsers) {
    try {
      // Try to sign in with each test user
      const { error } = await supabase.auth.signInWithPassword();

      if (error) {
        console.error(`Test user ${testUser.email} verification failed:`, error);
        results.push(false);
      } else {
        console.log(`Test user ${testUser.email} verified successfully`);
        results.push(true);

        // Sign out immediately
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error(`Error verifying test user ${testUser.email}:`, error);
      results.push(false);
    }
  }

  return results;
};
