
/**
 * Authorization Checks Utilities
 * Provides utilities for checking permissions and roles
 * @module utils/security/authorizationChecks
 */

import { UserRole } from '@/lib/supabase';

/**
 * Check if a user has any of the required roles
 * @param userRole The user's role
 * @param allowedRoles Array of allowed roles
 * @returns Whether the user has permission
 */
export function hasRequiredRole(userRole: UserRole | null, allowedRoles: UserRole[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

/**
 * Check if a user owns a resource
 * @param userId The user's ID
 * @param resourceUserId The resource owner's ID
 * @returns Whether the user owns the resource
 */
export function isResourceOwner(userId: string | null, resourceUserId: string): boolean {
  if (!userId) return false;
  return userId === resourceUserId;
}

/**
 * Verify if user can perform a specific action on a resource
 * @param userId The user's ID
 * @param userRole The user's role
 * @param resourceUserId The resource owner's ID
 * @param requiredRoles Roles allowed to access resources they don't own
 * @returns Whether the user can perform the action
 */
export function canPerformAction(
  userId: string | null, 
  userRole: UserRole | null, 
  resourceUserId: string,
  requiredRoles: UserRole[] = []
): boolean {
  // User is the owner of the resource
  if (isResourceOwner(userId, resourceUserId)) {
    return true;
  }
  
  // User has a role that allows them to access others' resources
  return hasRequiredRole(userRole, requiredRoles);
}

/**
 * Validate authorization for API endpoints
 * @param userId The user's ID
 * @param userRole The user's role
 * @param resourceUserId The resource owner's ID
 * @param requiredRoles Roles that can access this resource
 * @returns Object containing auth result and error message
 */
export function validateAuthorization(
  userId: string | null,
  userRole: UserRole | null,
  resourceUserId: string | null,
  requiredRoles: UserRole[] = []
): { authorized: boolean; message?: string } {
  if (!userId) {
    return { 
      authorized: false, 
      message: 'Authentication required' 
    };
  }
  
  if (!resourceUserId) {
    return { 
      authorized: false, 
      message: 'Invalid resource' 
    };
  }
  
  if (!canPerformAction(userId, userRole, resourceUserId, requiredRoles)) {
    return { 
      authorized: false, 
      message: 'You do not have permission to perform this action' 
    };
  }
  
  return { authorized: true };
}

/**
 * Create an authorization guard for sensitive actions
 * @param onUnauthorized Function to call when unauthorized
 * @returns Authorization guard function
 */
export function createAuthGuard(onUnauthorized: (message: string) => void) {
  return (
    userId: string | null,
    userRole: UserRole | null,
    resourceUserId: string | null,
    requiredRoles: UserRole[] = []
  ): boolean => {
    const { authorized, message } = validateAuthorization(
      userId, 
      userRole, 
      resourceUserId, 
      requiredRoles
    );
    
    if (!authorized && message) {
      onUnauthorized(message);
    }
    
    return authorized;
  };
}
