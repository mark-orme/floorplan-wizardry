
/**
 * Secure Token Storage Utilities
 * Provides more secure methods for storing and retrieving authentication tokens
 * using sessionStorage instead of localStorage for sensitive data
 */

import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import logger from '@/utils/logger';

/**
 * Store auth session securely, avoiding localStorage for sensitive data
 * Uses the Supabase auth.setSession method which is more secure than localStorage
 */
export const storeAuthSession = async (session: Session): Promise<boolean> => {
  try {
    // Use Supabase's built-in method for secure session storage
    await supabase.auth.setSession(session);
    
    // Store non-sensitive session metadata in sessionStorage (not localStorage)
    // This avoids storing tokens in localStorage which is vulnerable to XSS
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('auth_session_active', 'true');
      sessionStorage.setItem('auth_session_expires', session.expires_at?.toString() || '');
    }
    
    return true;
  } catch (error) {
    logger.error('Failed to store auth session securely', { error });
    return false;
  }
};

/**
 * Clear stored authentication data
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    // Use Supabase's built-in method to sign out and clear session data
    await supabase.auth.signOut();
    
    // Clear any session metadata from sessionStorage
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('auth_session_active');
      sessionStorage.removeItem('auth_session_expires');
    }
  } catch (error) {
    logger.error('Error clearing auth data', { error });
  }
};

/**
 * Check if the session is expired
 */
export const isSessionExpired = (): boolean => {
  try {
    const expiryString = sessionStorage.getItem('auth_session_expires');
    if (!expiryString) return true;
    
    const expiry = parseInt(expiryString, 10);
    return Date.now() > expiry * 1000; // Convert to milliseconds
  } catch (error) {
    logger.error('Error checking session expiry', { error });
    return true; // Default to expired for safety
  }
};

/**
 * Create a secure API request with auth headers
 * @param url The URL to fetch from
 * @param options Request options
 * @returns Response from the fetch request
 */
export const secureFetch = async <T = any>(
  url: string, 
  options: RequestInit = {}
): Promise<T> => {
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No valid session found');
    }
    
    // Add authorization header
    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${session.access_token}`);
    
    // Make secure request
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    logger.error('Secure fetch error', { error });
    throw error;
  }
};
