
/**
 * Resource Ownership Utilities
 * 
 * Provides functions to verify resource ownership and access control
 */
import { supabase } from '@/lib/supabase';
import logger from '@/utils/logger';

/**
 * Verify that a user owns a resource
 * @param resourceTable Database table name
 * @param resourceId Resource ID to check
 * @param userId User ID to check against
 * @returns Promise resolving to boolean indicating ownership
 */
export async function verifyResourceOwnership(
  resourceTable: string,
  resourceId: string,
  userId: string
): Promise<boolean> {
  try {
    if (!resourceId || !userId) {
      return false;
    }
    
    const { data, error } = await supabase
      .from(resourceTable)
      .select('id')
      .eq('id', resourceId)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      logger.warn(`Ownership verification failed: ${error.message}`);
      return false;
    }
    
    return !!data;
  } catch (err) {
    logger.error('Error verifying resource ownership:', err);
    return false;
  }
}

/**
 * Check if a user has access to a resource (ownership or shared access)
 * @param resourceTable Database table name
 * @param resourceId Resource ID to check
 * @param userId User ID to check against
 * @returns Promise resolving to boolean indicating access
 */
export async function checkResourceAccess(
  resourceTable: string,
  resourceId: string,
  userId: string
): Promise<boolean> {
  try {
    // First check direct ownership
    const ownershipResult = await verifyResourceOwnership(resourceTable, resourceId, userId);
    
    if (ownershipResult) {
      return true;
    }
    
    // Then check if there's a shared_resources table and if access is granted
    try {
      const { data, error } = await supabase
        .from('shared_resources')
        .select('id')
        .eq('resource_table', resourceTable)
        .eq('resource_id', resourceId)
        .eq('shared_with_user_id', userId);
      
      if (error) {
        logger.debug('No shared access or shared_resources table may not exist');
        return false;
      }
      
      return data && data.length > 0;
    } catch (err) {
      // Shared resources table might not exist, ignore this error
      logger.debug('Error checking shared resources, table may not exist');
      return false;
    }
  } catch (err) {
    logger.error('Error checking resource access:', err);
    return false;
  }
}

/**
 * Grant access to a resource for another user
 * @param resourceTable Database table name
 * @param resourceId Resource ID
 * @param ownerId Owner user ID
 * @param targetUserId User ID to grant access to
 * @param accessLevel Access level (read, write, admin)
 * @returns Promise resolving to boolean indicating success
 */
export async function grantResourceAccess(
  resourceTable: string,
  resourceId: string,
  ownerId: string,
  targetUserId: string,
  accessLevel: 'read' | 'write' | 'admin' = 'read'
): Promise<boolean> {
  try {
    // Verify ownership first
    const isOwner = await verifyResourceOwnership(resourceTable, resourceId, ownerId);
    
    if (!isOwner) {
      logger.warn(`Access grant failed: User ${ownerId} is not the owner of ${resourceTable}/${resourceId}`);
      return false;
    }
    
    // Grant access by creating shared resource record
    const { error } = await supabase
      .from('shared_resources')
      .insert({
        resource_table: resourceTable,
        resource_id: resourceId,
        owner_user_id: ownerId,
        shared_with_user_id: targetUserId,
        access_level: accessLevel,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      logger.error('Error granting resource access:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    logger.error('Error in grantResourceAccess:', err);
    return false;
  }
}

/**
 * Revoke access to a resource
 * @param resourceTable Database table name
 * @param resourceId Resource ID
 * @param ownerId Owner user ID
 * @param targetUserId User ID to revoke access from
 * @returns Promise resolving to boolean indicating success
 */
export async function revokeResourceAccess(
  resourceTable: string,
  resourceId: string,
  ownerId: string,
  targetUserId: string
): Promise<boolean> {
  try {
    // Verify ownership first
    const isOwner = await verifyResourceOwnership(resourceTable, resourceId, ownerId);
    
    if (!isOwner) {
      logger.warn(`Access revocation failed: User ${ownerId} is not the owner of ${resourceTable}/${resourceId}`);
      return false;
    }
    
    // Revoke access by deleting shared resource record
    const { error } = await supabase
      .from('shared_resources')
      .delete()
      .eq('resource_table', resourceTable)
      .eq('resource_id', resourceId)
      .eq('owner_user_id', ownerId)
      .eq('shared_with_user_id', targetUserId);
    
    if (error) {
      logger.error('Error revoking resource access:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    logger.error('Error in revokeResourceAccess:', err);
    return false;
  }
}
