
/**
 * TestUserCreator component
 * Used for creating and managing test users in development environments
 */
import { adaptUserWithEmail } from './userUtils';

// Export the TestUser interface
export interface TestUser {
  id?: string;
  email: string;
  name?: string;
  password?: string;
  role: string;
  label?: string;
}

interface SortableUser {
  email: string;
  [key: string]: unknown;
}

// Export the TestUserCreator class with static methods
export class TestUserCreator {
  static createDummyUser(overrides: Partial<TestUser> = {}): TestUser {
    const defaultUser: TestUser = {
      id: 'test-user-id',
      email: 'test.user@example.com',
      name: 'Test User',
      role: 'user'
    };

    return {
      ...defaultUser,
      ...overrides
    };
  }

  static validateUserEmail(user: SortableUser): boolean {
    const adaptedUser = adaptUserWithEmail(user);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(adaptedUser.email);
  }

  static getDisplayName(user: SortableUser): string {
    const adaptedUser = adaptUserWithEmail(user);
    return adaptedUser.name || adaptedUser.email.split('@')[0];
  }

  static sortUsersByEmail(users: SortableUser[]): SortableUser[] {
    return [...users].sort((a, b) => {
      const userA = adaptUserWithEmail(a);
      const userB = adaptUserWithEmail(b);
      return userA.email.localeCompare(userB.email);
    });
  }

  static filterUsersByDomain(users: SortableUser[], domain: string): SortableUser[] {
    return users.filter(user => {
      const adaptedUser = adaptUserWithEmail(user);
      return adaptedUser.email.endsWith(`@${domain}`);
    });
  }

  static findUserByEmail(users: SortableUser[], email: string): SortableUser | undefined {
    return users.find(user => {
      const adaptedUser = adaptUserWithEmail(user);
      return adaptedUser.email === email;
    });
  }
}
