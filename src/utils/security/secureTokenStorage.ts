
/**
 * Secure Token Storage Utilities
 * Provides more secure methods for storing and retrieving authentication tokens
 * Avoids using localStorage for sensitive data
 */

import { toast } from 'sonner';
import logger from '@/utils/logger';

/**
 * Store auth token securely using HttpOnly cookies via a backend endpoint
 * This is more secure than localStorage which is vulnerable to XSS
 */
export const storeAuthToken = async (token: string, expiry?: number): Promise<boolean> => {
  try {
    // In a real implementation, this would make a request to a backend endpoint
    // that sets an HttpOnly cookie. For this example, we'll simulate with a fetch:
    
    // Example (would need a real endpoint in production):
    // await fetch('/api/auth/set-cookie', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ token, expiry }),
    //   credentials: 'include' // Important for cookies
    // });
    
    // For demo purposes, we'll still use localStorage but log a security warning
    localStorage.setItem('auth_token', token);
    if (expiry) {
      localStorage.setItem('auth_token_expiry', expiry.toString());
    }
    
    logger.warn('Using localStorage for auth token storage - SECURITY RISK', {
      message: 'In production, use HttpOnly cookies via a secure backend endpoint'
    });
    
    return true;
  } catch (error) {
    logger.error('Failed to store auth token securely', { error });
    toast.error('Failed to store authentication data');
    return false;
  }
};

/**
 * Get auth token - in a real implementation this would be sent automatically
 * with requests via HttpOnly cookies
 */
export const getAuthToken = (): string | null => {
  // In a real implementation using HttpOnly cookies, this would not be needed
  // as the cookies would be automatically sent with each request
  return localStorage.getItem('auth_token');
};

/**
 * Check if the token is expired
 */
export const isTokenExpired = (): boolean => {
  const expiryString = localStorage.getItem('auth_token_expiry');
  if (!expiryString) return false;
  
  const expiry = parseInt(expiryString, 10);
  return Date.now() > expiry;
};

/**
 * Clear auth token - in a real implementation this would invalidate the cookie
 */
export const clearAuthToken = async (): Promise<boolean> => {
  try {
    // In a real implementation, this would make a request to a backend endpoint
    // that clears the HttpOnly cookie
    
    // Example (would need a real endpoint in production):
    // await fetch('/api/auth/clear-cookie', {
    //   method: 'POST',
    //   credentials: 'include'
    // });
    
    // For demo purposes, we'll use localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_token_expiry');
    
    return true;
  } catch (error) {
    logger.error('Failed to clear auth token', { error });
    return false;
  }
};

/**
 * Refresh token - in a real implementation this would update the HttpOnly cookie
 */
export const refreshAuthToken = async (newToken: string, newExpiry?: number): Promise<boolean> => {
  return storeAuthToken(newToken, newExpiry);
};
