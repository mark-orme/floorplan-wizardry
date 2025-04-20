
/**
 * Wrapper for Supabase API calls to standardize the interface
 */
import { createClient } from '@supabase/supabase-js';
import { getCSRFToken } from '../security/enhancedCsrfProtection';

// Create a Supabase client with error handling
export const createSafeSupabaseClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or key is missing');
    return null;
  }
  
  // Add CSRF token to all fetch requests
  const fetchWithCSRF = (url: RequestInfo | URL, options?: RequestInit) => {
    const csrfToken = getCSRFToken();
    const fetchOptions = {
      ...options,
      headers: {
        ...options?.headers,
        'X-CSRF-Token': csrfToken
      }
    };
    
    return fetch(url, fetchOptions);
  };
  
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      fetch: fetchWithCSRF
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });
};

/**
 * Safe wrapper for Supabase queries
 * @param queryBuilder The Supabase query builder
 * @returns A promise with data and error
 */
export const safeQuery = async (queryBuilder: any) => {
  try {
    // For single() queries
    if (queryBuilder.single && typeof queryBuilder.single === 'function') {
      return await queryBuilder.single();
    }
    
    // For select() queries
    if (queryBuilder.select && typeof queryBuilder.select === 'function') {
      return await queryBuilder.select();
    }
    
    // For other query types
    return await queryBuilder;
  } catch (error) {
    console.error('Supabase query error:', error);
    return { data: null, error };
  }
};

/**
 * Executes a filter query with proper error handling
 * @param table The Supabase table
 * @param column The column to filter on
 * @param value The value to match
 */
export const safeFilterQuery = async (table: any, column: string, value: any) => {
  if (!table || !table.select) {
    return { data: null, error: new Error('Invalid table reference') };
  }
  
  try {
    const query = table.select().eq(column, value);
    return await query;
  } catch (error) {
    console.error('Filter query error:', error);
    return { data: null, error };
  }
};
