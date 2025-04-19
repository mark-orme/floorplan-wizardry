
/**
 * Resource Ownership Verification Utilities
 * 
 * Provides functions to verify ownership of resources
 * to prevent unauthorized access.
 */
import { supabase } from '@/lib/supabase';
import logger from '@/utils/logger';
import { logSecurityEvent, AuditEventType } from '@/utils/audit/auditLogger';

/**
 * Verify ownership of a resource
 * 
 * @param userId User ID to check
 * @param resourceType Type of resource (table name)
 * @param resourceId Resource ID
 * @returns Promise<boolean> indicating whether the user owns the resource
 */
export async function verifyResourceOwnership(
  userId: string,
  resourceType: string,
  resourceId: string
): Promise<boolean> {
  try {
    if (!userId) {
      logger.warn('Ownership check attempted with no user ID');
      return false;
    }

    // Generic verification that works across tables
    const { data, error } = await supabase
      .from(resourceType)
      .select('user_id')
      .eq('id', resourceId)
      .single();

    if (error) {
      logger.error(`Error verifying ownership of ${resourceType}/${resourceId}:`, error);
      return false;
    }

    const isOwner = data && data.user_id === userId;
    
    // Log unauthorized access attempts
    if (!isOwner) {
      logSecurityEvent(
        AuditEventType.SECURITY_VIOLATION,
        {
          message: `Unauthorized resource access attempt`,
          resourceType,
          resourceId,
          attemptedBy: userId
        },
        userId
      );
      
      logger.warn(`Unauthorized access attempt: User ${userId} attempted to access ${resourceType}/${resourceId}`);
    }

    return isOwner;
  } catch (error) {
    logger.error('Error in ownership verification:', error);
    return false;
  }
}

/**
 * Check if a user has authorized access to a resource
 * Allows for more complex authorization rules beyond simple ownership
 * 
 * @param userId User ID to check
 * @param resourceType Type of resource
 * @param resourceId Resource ID
 * @param accessType Type of access (read, write, admin)
 * @returns Promise<boolean> indicating whether the user has the specified access
 */
export async function hasResourceAccess(
  userId: string,
  resourceType: string,
  resourceId: string,
  accessType: 'read' | 'write' | 'admin'
): Promise<boolean> {
  try {
    // First check for direct ownership
    const isOwner = await verifyResourceOwnership(userId, resourceType, resourceId);
    
    if (isOwner) {
      return true; // Owner has all access rights
    }
    
    // For non-owners, check shared access (in a real app, you'd have a permissions table)
    // This is a simplified example - implement your specific access rules here
    const { data, error } = await supabase
      .from(`${resourceType}_permissions`)
      .select('access_level')
      .eq('resource_id', resourceId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) {
      // If the table doesn't exist or there's an error, fail safe
      logger.debug(`No ${resourceType}_permissions table or error checking permissions:`, error);
      return false;
    }
    
    // Check if user has required access level
    if (!data) {
      return false; // No permissions record found
    }
    
    // Simple access checking logic - customize as needed
    const accessLevel = data.access_level;
    
    if (accessType === 'read') {
      return ['read', 'write', 'admin'].includes(accessLevel);
    } else if (accessType === 'write') {
      return ['write', 'admin'].includes(accessLevel);
    } else if (accessType === 'admin') {
      return accessLevel === 'admin';
    }
    
    return false;
  } catch (error) {
    logger.error('Error checking resource access:', error);
    return false;
  }
}

/**
 * Create a middleware-style function to verify resource access
 * 
 * @param resourceType Type of resource to check
 * @param accessType Type of access required
 * @returns Function that takes resourceId and returns a promise resolving to boolean
 */
export function createResourceGuard(
  resourceType: string,
  accessType: 'read' | 'write' | 'admin' = 'read'
) {
  return async (resourceId: string, userId: string): Promise<boolean> => {
    return hasResourceAccess(userId, resourceType, resourceId, accessType);
  };
}
