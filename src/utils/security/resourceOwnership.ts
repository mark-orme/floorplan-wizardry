
/**
 * Resource Ownership Validation
 * 
 * Utilities for verifying if a user owns or has access to a resource
 */
import { supabase } from '@/lib/supabase';
import logger from '@/utils/logger';

/**
 * Verify if a user owns a resource
 * 
 * @param userId User ID
 * @param resourceId Resource ID
 * @param resourceType Type of resource (table name)
 * @returns Boolean indicating if the user owns the resource
 */
export async function verifyResourceOwnership(
  userId: string,
  resourceId: string,
  resourceType: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from(resourceType)
      .select()
      .eq('id', resourceId)
      .eq('user_id', userId);
    
    if (error) {
      logger.error(`Error verifying ownership of ${resourceType}:`, error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (err) {
    logger.error(`Error in resource ownership verification for ${resourceType}:`, err);
    return false;
  }
}

/**
 * Check if a user has access to a specific resource
 * 
 * @param userId User ID
 * @param resourceId Resource ID
 * @param resourceType Type of resource (table name)
 * @param accessLevel Required access level
 * @returns Boolean indicating if the user has access
 */
export async function checkResourceAccess(
  userId: string,
  resourceId: string,
  resourceType: string,
  accessLevel: 'read' | 'write' | 'admin' = 'read'
): Promise<boolean> {
  try {
    // First check direct ownership
    const isOwner = await verifyResourceOwnership(userId, resourceId, resourceType);
    
    if (isOwner) {
      return true;
    }
    
    // Then check shared access through resource_access table
    const { data, error } = await supabase
      .from('resource_access')
      .select()
      .eq('resource_id', resourceId)
      .eq('resource_type', resourceType)
      .eq('user_id', userId);
    
    if (error) {
      logger.error(`Error checking resource access for ${resourceType}:`, error);
      return false;
    }
    
    if (!data || data.length === 0) {
      return false;
    }
    
    // Check access level
    const accessRecord = data[0];
    
    switch (accessLevel) {
      case 'read':
        return true; // Any access record grants read access
      case 'write':
        return ['write', 'admin'].includes(accessRecord.access_level);
      case 'admin':
        return accessRecord.access_level === 'admin';
      default:
        return false;
    }
  } catch (err) {
    logger.error(`Error in resource access check for ${resourceType}:`, err);
    return false;
  }
}
