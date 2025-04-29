
// Authentication constants and types

export const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
  GUEST: 'guest'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export interface AuthUser {
  id: string;
  email?: string;
  role?: UserRole;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: number;
}
