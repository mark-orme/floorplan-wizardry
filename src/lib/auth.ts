
// Auth types and constants

export enum USER_ROLES {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}

export interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading?: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}

export const DEFAULT_AUTH_CONTEXT: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
};
