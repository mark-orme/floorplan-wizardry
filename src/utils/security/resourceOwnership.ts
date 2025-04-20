/**
 * Resource Ownership Utilities
 * Functions for verifying ownership of resources
 */
import { supabase } from '@/lib/supabase';
import { AuditEventType, AuditEventSeverity, logAuditEvent } from '@/utils/audit/auditLogger';
import { safeQuery, safeFilterQuery } from '@/utils/supabase/supabaseApiWrapper';

// Define resource types
export enum ResourceType {
  FLOOR_PLAN = 'floor_plan',
  PROPERTY = 'property',
  DOCUMENT = 'document',
  USER_PROFILE = 'user_profile',
  CONFIGURATION = 'configuration'
}

interface ResourceOwnershipCheck {
  resourceType: ResourceType;
  resourceId: string;
  userId: string;
}

/**
 * Check if user owns a resource
 * @param resourceType Type of resource to check
 * @param resourceId ID of the resource
 * @param userId ID of the user
 * @returns Boolean indicating ownership
 */
export async function isResourceOwner(
  resourceType: ResourceType,
  resourceId: string,
  userId: string
): Promise<boolean> {
  if (!userId || !resourceId) return false;
  
  try {
    let isOwner = false;
    
    switch (resourceType) {
      case ResourceType.FLOOR_PLAN:
        const { data: floorPlanData, error: floorPlanError } = await supabase
          .from('floor_plans')
          .select('*')
          .eq('id', resourceId)
          .eq('user_id', userId)
          .maybeSingle();
        
        isOwner = !!floorPlanData && !floorPlanError;
        break;
        
      case ResourceType.PROPERTY:
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', resourceId)
          .eq('user_id', userId)
          .maybeSingle();
        
        isOwner = !!propertyData && !propertyError;
        break;
        
      case ResourceType.USER_PROFILE:
        // For user profile, the resourceId should be the userId
        isOwner = resourceId === userId;
        break;
        
      default:
        // For other resource types, implement specific checks
        isOwner = false;
    }
    
    // Log the ownership check
    await logAuditEvent({
      type: AuditEventType.API_ACCESS,
      userId,
      resourceId,
      description: `Ownership check: user ${userId} ${isOwner ? 'owns' : 'does not own'} ${resourceType} ${resourceId}`,
      severity: isOwner ? AuditEventSeverity.INFO : AuditEventSeverity.WARNING,
      metadata: {
        resourceType,
        isOwner
      }
    });
    
    return isOwner;
  } catch (error) {
    console.error(`Error checking ownership of ${resourceType} ${resourceId}:`, error);
    return false;
  }
}

/**
 * Check if a user has access to a resource (either as owner or through sharing)
 * @param resourceType Type of resource to check
 * @param resourceId ID of the resource
 * @param userId ID of the user
 * @returns Boolean indicating access
 */
export async function hasResourceAccess(
  resourceType: ResourceType,
  resourceId: string,
  userId: string
): Promise<boolean> {
  // First check ownership
  const isOwner = await isResourceOwner(resourceType, resourceId, userId);
  if (isOwner) return true;
  
  // If not owner, check if resource is shared with user
  try {
    let hasAccess = false;
    
    switch (resourceType) {
      case ResourceType.FLOOR_PLAN:
        // Check shared floor plans
        const { data: sharedFloorPlanData, error: sharedFloorPlanError } = await supabase
          .from('shared_floor_plans')
          .select('*')
          .eq('floor_plan_id', resourceId)
          .eq('user_id', userId);
        
        hasAccess = !!sharedFloorPlanData?.length && !sharedFloorPlanError;
        break;
        
      case ResourceType.PROPERTY:
        // Check shared properties
        const { data: sharedPropertyData, error: sharedPropertyError } = await supabase
          .from('shared_properties')
          .select('*')
          .eq('property_id', resourceId)
          .eq('user_id', userId);
        
        hasAccess = !!sharedPropertyData?.length && !sharedPropertyError;
        break;
        
      default:
        // For other resource types, implement specific sharing checks
        hasAccess = false;
    }
    
    // Log the access check
    await logAuditEvent({
      type: AuditEventType.API_ACCESS,
      userId,
      resourceId,
      description: `Access check: user ${userId} ${hasAccess ? 'has access to' : 'does not have access to'} ${resourceType} ${resourceId}`,
      severity: hasAccess ? AuditEventSeverity.INFO : AuditEventSeverity.WARNING,
      metadata: {
        resourceType,
        hasAccess,
        accessType: 'shared'
      }
    });
    
    return hasAccess;
  } catch (error) {
    console.error(`Error checking access to ${resourceType} ${resourceId}:`, error);
    return false;
  }
}

/**
 * Get IDs of all resources owned by a user
 * @param resourceType Type of resources to get
 * @param userId ID of the user
 * @returns Array of resource IDs
 */
export async function getOwnedResourceIds(
  resourceType: ResourceType,
  userId: string
): Promise<string[]> {
  if (!userId) return [];
  
  try {
    let resourceIds: string[] = [];
    
    switch (resourceType) {
      case ResourceType.FLOOR_PLAN:
        const { data: floorPlanData, error: floorPlanError } = await supabase
          .from('floor_plans')
          .select('id')
          .eq('user_id', userId);
        
        if (floorPlanData && !floorPlanError) {
          resourceIds = floorPlanData.map(item => item.id);
        }
        break;
        
      case ResourceType.PROPERTY:
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('id')
          .eq('user_id', userId);
        
        if (propertyData && !propertyError) {
          resourceIds = propertyData.map(item => item.id);
        }
        break;
        
      default:
        // For other resource types, implement specific queries
        resourceIds = [];
    }
    
    return resourceIds;
  } catch (error) {
    console.error(`Error getting owned ${resourceType} IDs for user ${userId}:`, error);
    return [];
  }
}

/**
 * Checks if a user owns a resource
 * @param resourceId Resource ID to check
 * @param resourceType Type of resource (table name)
 * @param userId User ID to check ownership for
 * @returns Promise resolving to boolean
 */
export async function checkResourceOwnership(
  resourceId: string,
  resourceType: string,
  userId: string
): Promise<boolean> {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return false;
  }
  
  try {
    // Use the safe filter query
    const { data, error } = await safeFilterQuery(
      supabase.from(resourceType),
      'id',
      resourceId
    );
    
    if (error || !data || data.length === 0) {
      console.error(`Error checking ${resourceType} ownership:`, error);
      return false;
    }
    
    const resource = data[0];
    return resource.user_id === userId || resource.userId === userId;
  } catch (error) {
    console.error(`Error checking ${resourceType} ownership:`, error);
    return false;
  }
}
