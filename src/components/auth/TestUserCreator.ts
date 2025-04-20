
/**
 * TestUserCreator component
 * Used for creating and managing test users in development environments
 */
import { adaptUserWithEmail, TestUser } from './userUtils';

export class TestUserCreator {
  static createDummyUser(overrides = {}): TestUser {
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

  static validateUserEmail(user: any): boolean {
    const adaptedUser = adaptUserWithEmail(user);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(adaptedUser.email);
  }

  static getDisplayName(user: any): string {
    const adaptedUser = adaptUserWithEmail(user);
    return adaptedUser.name || adaptedUser.email.split('@')[0];
  }

  static sortUsersByEmail(users: any[]): any[] {
    return [...users].sort((a, b) => {
      const userA = adaptUserWithEmail(a);
      const userB = adaptUserWithEmail(b);
      return userA.email.localeCompare(userB.email);
    });
  }

  static filterUsersByDomain(users: any[], domain: string): any[] {
    return users.filter(user => {
      const adaptedUser = adaptUserWithEmail(user);
      return adaptedUser.email.endsWith(`@${domain}`);
    });
  }

  static findUserByEmail(users: any[], email: string): any {
    return users.find(user => {
      const adaptedUser = adaptUserWithEmail(user);
      return adaptedUser.email === email;
    });
  }
}
