
/**
 * User role definitions
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MANAGER = 'manager',
  PHOTOGRAPHER = 'photographer',
  PROCESSING_MANAGER = 'processing_manager',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

/**
 * Property status definitions
 * Re-exported from canvas-types for centralizing types
 */
export { PropertyStatus } from './canvas-types';

/**
 * Permission level definitions
 */
export enum PermissionLevel {
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin',
  NONE = 'none'
}

/**
 * Check if a role has specific permissions
 * @param role The user role to check
 * @param minimumPermission The minimum required permission
 * @returns Whether the role has the required permission
 */
export function hasPermission(role: UserRole, minimumPermission: UserRole): boolean {
  const permissionHierarchy = [
    UserRole.VIEWER,
    UserRole.USER, 
    UserRole.PHOTOGRAPHER,
    UserRole.EDITOR,
    UserRole.PROCESSING_MANAGER,
    UserRole.MANAGER,
    UserRole.ADMIN
  ];

  const roleIndex = permissionHierarchy.indexOf(role);
  const requiredIndex = permissionHierarchy.indexOf(minimumPermission);
  
  return roleIndex >= requiredIndex && roleIndex !== -1 && requiredIndex !== -1;
}
