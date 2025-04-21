
/**
 * Resource ownership utilities
 * Provides functions to check if a user owns a resource
 */
import { createClient } from '@supabase/supabase-js';

// Simple logging implementation
const log = {
  error: (message: string) => console.error(message),
  info: (message: string) => console.info(message)
};

// Simple authorization check
function checkAuthorization(userId: string, role: string): Promise<boolean> {
  // In a real implementation, this would check against roles in the database
  return Promise.resolve(role === 'user' || role === 'admin');
}

// Create a supabase client with appropriate configuration
const supabaseClient = createClient(
  process.env.SUPABASE_URL || 'https://example.supabase.co',
  process.env.SUPABASE_KEY || 'public-anon-key'
);

/**
 * Get the owner ID of a resource
 * @param table Database table name
 * @param resourceId Resource ID
 * @returns Owner user ID or null if not found
 */
export async function getResourceOwner(
  table: string, 
  resourceId: string
): Promise<string | null> {
  try {
    const { data, error } = await supabaseClient
      .from(table)
      .select('user_id')
      .eq('id', resourceId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data?.user_id || null;
  } catch (err) {
    log.error(`Error getting resource owner: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

/**
 * Check if a user owns a resource
 * @param userId User ID
 * @param table Database table name
 * @param resourceId Resource ID
 * @returns True if the user owns the resource
 */
export async function isResourceOwner(
  userId: string, 
  table: string, 
  resourceId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabaseClient
      .from(table)
      .select('user_id')
      .eq('id', resourceId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data?.user_id === userId;
  } catch (err) {
    log.error(`Error checking resource ownership: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
}

/**
 * Check if user is authorized to access a resource
 * @param userId User ID
 * @param table Database table name
 * @param resourceId Resource ID
 * @param requiredRole Required role level
 * @returns True if user is authorized
 */
export async function canAccessResource(
  userId: string, 
  table: string, 
  resourceId: string, 
  requiredRole: string = 'user'
): Promise<boolean> {
  if (!userId || !table || !resourceId) {
    return false;
  }
  
  try {
    // First check if user has the required role
    const hasRole = await checkAuthorization(userId, requiredRole);
    if (!hasRole) {
      return false;
    }
    
    // For admin role, allow access without ownership check
    if (requiredRole === 'admin') {
      return true;
    }
    
    // Check if user is the owner of the resource
    const { data, error } = await supabaseClient
      .from(table)
      .select('user_id')
      .eq('id', resourceId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data?.user_id === userId;
  } catch (err) {
    log.error(`Error checking resource access: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
}

/**
 * Get all resources owned by a user
 * @param userId User ID
 * @param table Database table name
 * @returns Array of resources
 */
export async function getUserResources(
  userId: string, 
  table: string
): Promise<any[]> {
  try {
    const { data, error } = await supabaseClient
      .from(table)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (err) {
    log.error(`Error getting user resources: ${err instanceof Error ? err.message : String(err)}`);
    return [];
  }
}
