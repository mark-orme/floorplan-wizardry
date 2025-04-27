
import { Point } from '@/types/core/Point';

export interface TestUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export function adaptUserWithEmail(user: Partial<TestUser> | null): TestUser {
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
      email: `user-${user.id || 'unknown'}@example.com`
    } as TestUser;
  }
  
  return user as TestUser;
}

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
