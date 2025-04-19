
/**
 * TestUserCreator
 * Utility for creating test users during development
 */
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/lib/supabase';
import { toast } from 'sonner';
import logger from '@/utils/logger';

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
    logger.warn('Test users are only created in development environment');
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
        logger.error(`Error checking for existing user ${testUser.email}:`, fetchError);
        continue;
      }

      // Skip if user already exists
      if (existingUsers) {
        logger.info(`Test user ${testUser.email} already exists`);
        continue;
      }

      // Create auth user with proper parameters - Fix by using signInWithPassword instead of signUp
      const { data: authData, error: signUpError } = await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: testUser.password
      });

      if (signUpError) {
        logger.error(`Error creating auth user ${testUser.email}:`, signUpError);
        continue;
      }

      const userId = authData?.user?.id;
      if (!userId) {
        logger.error(`No user ID returned for ${testUser.email}`);
        continue;
      }

      // Create user profile
      const result = await supabase
        .from('users')
        .insert({
          id: userId,
          email: testUser.email,
          role: testUser.role,
          name: testUser.email.split('@')[0],
          created_at: new Date().toISOString()
        });
        
      if (result.error) {
        logger.error(`Error creating profile for ${testUser.email}:`, result.error);
      } else {
        logger.info(`Created test user: ${testUser.email} (${testUser.role})`);
      }
    }

    logger.info('Test user creation completed');
  } catch (error) {
    logger.error('Error creating test users:', error);
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
      // Try to sign in with each test user with proper parameters
      const { error } = await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: testUser.password
      });

      if (error) {
        logger.error(`Test user ${testUser.email} verification failed:`, error);
        results.push(false);
      } else {
        logger.info(`Test user ${testUser.email} verified successfully`);
        results.push(true);

        // Sign out immediately
        await supabase.auth.signOut();
      }
    } catch (error) {
      logger.error(`Error verifying test user ${testUser.email}:`, error);
      results.push(false);
    }
  }

  return results;
};
