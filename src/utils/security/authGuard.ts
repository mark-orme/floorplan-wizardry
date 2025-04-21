/**
 * Authentication guard utilities
 * Provides functions for protecting routes and components based on authentication state
 */

// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
  // Simple check for token existence - in a real app, you would validate the token
  return localStorage.getItem('auth_token') !== null;
};

// Redirect unauthorized users
export const redirectUnauthorized = (redirectPath: string = '/login'): void => {
  if (!isAuthenticated()) {
    window.location.href = redirectPath;
  }
};

// Role-based access control checker
export const hasRole = (requiredRole: string): boolean => {
  try {
    const userRoles = JSON.parse(localStorage.getItem('user_roles') || '[]');
    return userRoles.includes(requiredRole);
  } catch (error) {
    console.error('Error parsing user roles:', error);
    return false;
  }
};

// Check if user has required permissions
export const hasPermission = (requiredPermission: string): boolean => {
  try {
    const userPermissions = JSON.parse(localStorage.getItem('user_permissions') || '[]');
    return userPermissions.includes(requiredPermission);
  } catch (error) {
    console.error('Error parsing user permissions:', error);
    return false;
  }
};

// Validate user authorization for a specific resource or action
export const validateAuthorization = (
  requiredRoles: string[] = [], 
  requiredPermissions: string[] = []
): boolean => {
  // If no roles or permissions required, allow access
  if (requiredRoles.length === 0 && requiredPermissions.length === 0) {
    return true;
  }
  
  // User must be authenticated first
  if (!isAuthenticated()) {
    return false;
  }
  
  // Check roles if specified
  if (requiredRoles.length > 0 && !requiredRoles.some(role => hasRole(role))) {
    return false;
  }
  
  // Check permissions if specified
  if (requiredPermissions.length > 0 && !requiredPermissions.some(perm => hasPermission(perm))) {
    return false;
  }
  
  return true;
};

// Create an auth guard function for a specific set of roles/permissions
export const createAuthGuard = (
  options: { 
    roles?: string[], 
    permissions?: string[],
    redirectPath?: string
  }
) => {
  const { roles = [], permissions = [], redirectPath = '/login' } = options;
  
  return () => {
    const isAuthorized = validateAuthorization(roles, permissions);
    
    if (!isAuthorized) {
      redirectUnauthorized(redirectPath);
    }
    
    return isAuthorized;
  };
};
