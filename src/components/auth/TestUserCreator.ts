
import { UserRole, supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Define the test users structure
export interface TestUser {
  email: string;
  password: string;
  role: UserRole;
  label: string;
}

// Test users for quick access
export const testUsers: TestUser[] = [
  { email: 'photographer@nichecom.co.uk', password: 'password1', role: UserRole.PHOTOGRAPHER, label: 'Photographer Test User' },
  { email: 'processing@nichecom.co.uk', password: 'password1', role: UserRole.PROCESSING_MANAGER, label: 'Processing Manager Test User' },
  { email: 'manager@nichecom.co.uk', password: 'password1', role: UserRole.MANAGER, label: 'Manager Test User' },
];

// Define interfaces for Supabase user data structures
interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
}

interface SignInResponse {
  data: {
    user: SupabaseUser | null;
    session: any | null;
  } | null;
  error: Error | null;
}

interface UserProfileData {
  user_id: string;
  role: UserRole;
  created_at: string;
  [key: string]: any;
}

interface UserListResponse {
  data: {
    users: SupabaseUser[];
  } | null;
  error: Error | null;
}

interface CreateUserResponse {
  data: {
    user: SupabaseUser | null;
  } | null;
  error: Error | null;
}

interface InsertProfileResponse {
  data: UserProfileData | null;
  error: Error | null;
}

interface SelectProfileResponse {
  data: UserProfileData | null;
  error: Error | null;
}

/**
 * Creates test users for development and testing purposes
 * @returns {Promise<number>} Number of users created
 */
export const createTestUsers = async (): Promise<number> => {
  try {
    let createdUsers = 0;
    
    for (const testUser of testUsers) {
      try {
        // First check if user already exists by trying to sign in
        const { data: signInData, error: signInError }: SignInResponse = await supabase.auth.signInWithPassword({
          email: testUser.email,
          password: testUser.password,
        });
        
        if (signInData?.user) {
          // User exists and can sign in - make sure they have a profile
          const { data: profileData }: SelectProfileResponse = await supabase
            .from('user_profiles')
            .select()
            .eq('user_id', signInData.user.id)
            .single();
            
          if (!profileData) {
            // Create profile if it doesn't exist
            const { error: insertError }: InsertProfileResponse = await supabase
              .from('user_profiles')
              .insert({
                user_id: signInData.user.id,
                role: testUser.role,
                created_at: new Date().toISOString()
              });
              
            if (insertError) throw insertError;
            console.log(`Added profile for existing user: ${testUser.email}`);
          }
          
          continue; // User exists and is confirmed, move to next test user
        }
        
        // User doesn't exist or credentials are wrong - check if the email exists
        const { data: userData, error: listError }: UserListResponse = await supabase.auth.admin.listUsers();
        
        if (listError) throw listError;
        
        const users = userData?.users || [];
        const existingUser = users.find(u => u.email === testUser.email);
        
        if (existingUser) {
          // Email exists but wrong password or other issue - delete the user
          console.log(`Deleting existing user with email: ${testUser.email}`);
          const { error: deleteError } = await supabase.auth.admin.deleteUser(existingUser.id);
          if (deleteError) throw deleteError;
        }
        
        // Create new user
        console.log(`Creating new user: ${testUser.email}`);
        const { data: newUserData, error: createError }: CreateUserResponse = await supabase.auth.admin.createUser({
          email: testUser.email,
          password: testUser.password,
          email_confirm: true, // This ensures the email is confirmed
          user_metadata: { role: testUser.role }
        });
        
        if (createError) throw createError;
        
        if (newUserData?.user) {
          // Create user profile
          const { error: profileError }: InsertProfileResponse = await supabase
            .from('user_profiles')
            .insert({
              user_id: newUserData.user.id,
              role: testUser.role,
              created_at: new Date().toISOString()
            });
            
          if (profileError) throw profileError;
          createdUsers++;
          console.log(`User created successfully: ${testUser.email}`);
        }
      } catch (userError: any) {
        console.error(`Error processing ${testUser.email}:`, userError);
        toast.error(`Error with ${testUser.email}: ${userError.message || JSON.stringify(userError)}`);
      }
    }
    
    // Sign out after creating test users
    await supabase.auth.signOut();
    
    if (createdUsers > 0) {
      toast.success(`${createdUsers} test users created or updated successfully!`);
    } else if (createdUsers === 0 && !toast.error) {
      toast.info('All test users already exist and are configured correctly.');
    }
    
    return createdUsers;
  } catch (error: any) {
    console.error('Error creating test users:', error);
    toast.error(error.message || 'Error creating test users');
    return 0;
  }
};
