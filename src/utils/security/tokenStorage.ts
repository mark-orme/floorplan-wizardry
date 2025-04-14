
/**
 * Token storage utilities
 * Provides secure methods for storing and retrieving authentication tokens
 */

// Store auth token securely
export const storeAuthToken = (token: string, expiry?: number): void => {
  localStorage.setItem('auth_token', token);
  
  if (expiry) {
    localStorage.setItem('auth_token_expiry', expiry.toString());
  }
};

// Retrieve the stored auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Check if the stored token is expired
export const isTokenExpired = (): boolean => {
  const expiryString = localStorage.getItem('auth_token_expiry');
  if (!expiryString) return false;
  
  const expiry = parseInt(expiryString, 10);
  return Date.now() > expiry;
};

// Clear stored authentication data
export const clearAuthData = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_token_expiry');
  localStorage.removeItem('user_roles');
  localStorage.removeItem('user_permissions');
};

// Refresh the token expiry time
export const refreshTokenExpiry = (newExpiry: number): void => {
  localStorage.setItem('auth_token_expiry', newExpiry.toString());
};
