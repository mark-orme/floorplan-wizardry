
/**
 * Utilities for handling user objects
 */

export interface TestUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Adapts a user object to ensure it has email property
 * This is used to fix the TestUserCreator email property errors
 * 
 * @param user A user object that might not have an email property
 * @returns A user object with email property
 */
export function adaptUserWithEmail(user: any): TestUser {
  // If user is undefined or null, return a default user
  if (!user) {
    return {
      id: 'unknown',
      email: 'unknown@example.com'
    };
  }
  
  // If email is missing, add a default one based on id
  if (!user.email) {
    return {
      ...user,
      email: `user-${user.id}@example.com`
    };
  }
  
  return user as TestUser;
}

/**
 * Creates a test user with required properties
 * @param id User ID
 * @param email User email
 * @param role Optional user role
 * @returns A test user object
 */
export function createTestUser(id: string, email: string, role?: string): TestUser {
  return {
    id,
    email,
    name: `Test User ${id}`,
    role,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}
