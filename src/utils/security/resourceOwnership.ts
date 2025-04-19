
/**
 * Resource Ownership Verification
 * Provides functions to verify user ownership of resources
 */
import { supabase } from '@/lib/supabase';
import logger from '@/utils/logger';
import { toast } from 'sonner';
import { logSecurityEvent, AuditEventType } from '@/utils/audit/auditLogger';

/**
 * Verify that a user owns a specific resource
 * @param userId The ID of the user
 * @param resourceTable The table where the resource is stored
 * @param resourceId The ID of the resource
 * @returns True if the user owns the resource, false otherwise
 */
export async function verifyResourceOwnership(
  userId: string,
  resourceTable: string,
  resourceId: string
): Promise<boolean> {
  try {
    if (!userId || !resourceTable || !resourceId) {
      logger.warn('Missing required parameters for resource ownership verification');
      return false;
    }
    
    logger.info(`Verifying ownership of ${resourceTable}/${resourceId} for user ${userId}`);
    
    // Get the resource and check if user_id matches
    const result = await supabase
      .from(resourceTable)
      .select()
      .match({ id: resourceId });
      
    // Fixed: properly handle the response
    if (result.error) {
      logger.error(`Error fetching resource for ownership verification: ${result.error.message}`);
      return false;
    }
    
    if (!result.data || result.data.length === 0) {
      logger.warn(`Resource ${resourceTable}/${resourceId} not found`);
      return false;
    }
    
    const resource = result.data[0];
    
    // Check if the resource has a user_id field
    if (!resource.user_id) {
      logger.warn(`Resource ${resourceTable}/${resourceId} does not have a user_id field`);
      return false;
    }
    
    const isOwner = resource.user_id === userId;
    
    if (!isOwner) {
      // Log unauthorized access attempt
      await logSecurityEvent(
        AuditEventType.SECURITY_VIOLATION, 
        {
          action: 'unauthorized-resource-access',
          userId,
          resourceTable,
          resourceId,
          ownerUserId: resource.user_id
        }
      );
      
      logger.warn(`User ${userId} attempted to access resource ${resourceTable}/${resourceId} owned by ${resource.user_id}`);
    }
    
    return isOwner;
  } catch (error) {
    logger.error('Error verifying resource ownership:', error);
    return false;
  }
}

/**
 * Enforce resource ownership for an operation
 * @param userId The ID of the user
 * @param resourceTable The table where the resource is stored
 * @param resourceId The ID of the resource
 * @param operation The operation being performed
 * @returns Whether the operation should proceed
 */
export async function enforceResourceOwnership(
  userId: string,
  resourceTable: string,
  resourceId: string,
  operation: 'read' | 'update' | 'delete'
): Promise<boolean> {
  try {
    const isOwner = await verifyResourceOwnership(userId, resourceTable, resourceId);
    
    if (!isOwner) {
      // Show toast message
      toast.error(`Unauthorized: You cannot ${operation} this resource`);
      
      // Log security violation
      await logSecurityEvent(
        AuditEventType.SECURITY_VIOLATION,
        {
          action: `unauthorized-${operation}`,
          userId,
          resourceTable,
          resourceId
        }
      );
      
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error(`Error enforcing resource ownership for ${operation}:`, error);
    toast.error(`Error checking permissions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
}
