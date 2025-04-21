
/**
 * Role-Based Access Control (RBAC) Utilities
 * Implements access control based on user roles
 */
import logger from '@/utils/logger';

/**
 * User role definition
 */
export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  EDITOR = 'editor',
  ADMIN = 'admin'
}

/**
 * Permission definition
 */
export enum Permission {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  SHARE = 'share',
  EXPORT = 'export',
  ADMIN = 'admin'
}

/**
 * Resource types in the application
 */
export enum Resource {
  FLOOR_PLAN = 'floor_plan',
  ROOM = 'room',
  WALL = 'wall',
  FURNITURE = 'furniture',
  USER = 'user',
  SETTINGS = 'settings'
}

/**
 * Role-permission mapping
 */
const rolePermissions: Record<UserRole, Record<Resource, Permission[]>> = {
  [UserRole.GUEST]: {
    [Resource.FLOOR_PLAN]: [Permission.READ],
    [Resource.ROOM]: [Permission.READ],
    [Resource.WALL]: [Permission.READ],
    [Resource.FURNITURE]: [Permission.READ],
    [Resource.USER]: [],
    [Resource.SETTINGS]: []
  },
  [UserRole.USER]: {
    [Resource.FLOOR_PLAN]: [Permission.READ, Permission.CREATE, Permission.UPDATE],
    [Resource.ROOM]: [Permission.READ, Permission.CREATE, Permission.UPDATE],
    [Resource.WALL]: [Permission.READ, Permission.CREATE, Permission.UPDATE],
    [Resource.FURNITURE]: [Permission.READ, Permission.CREATE, Permission.UPDATE],
    [Resource.USER]: [Permission.READ],
    [Resource.SETTINGS]: [Permission.READ, Permission.UPDATE]
  },
  [UserRole.EDITOR]: {
    [Resource.FLOOR_PLAN]: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE, Permission.SHARE, Permission.EXPORT],
    [Resource.ROOM]: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE],
    [Resource.WALL]: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE],
    [Resource.FURNITURE]: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE],
    [Resource.USER]: [Permission.READ],
    [Resource.SETTINGS]: [Permission.READ, Permission.UPDATE]
  },
  [UserRole.ADMIN]: {
    [Resource.FLOOR_PLAN]: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE, Permission.SHARE, Permission.EXPORT, Permission.ADMIN],
    [Resource.ROOM]: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE, Permission.ADMIN],
    [Resource.WALL]: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE, Permission.ADMIN],
    [Resource.FURNITURE]: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE, Permission.ADMIN],
    [Resource.USER]: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE, Permission.ADMIN],
    [Resource.SETTINGS]: [Permission.READ, Permission.UPDATE, Permission.ADMIN]
  }
};

/**
 * Check if a role has a specific permission on a resource
 * @param role User role
 * @param resource Resource type
 * @param permission Permission to check
 * @returns Boolean indicating if role has permission
 */
export function hasPermission(
  role: UserRole,
  resource: Resource,
  permission: Permission
): boolean {
  try {
    // Check if role exists
    if (!rolePermissions[role]) {
      logger.warn(`Unknown role: ${role}`);
      return false;
    }
    
    // Check if resource is defined for this role
    if (!rolePermissions[role][resource]) {
      logger.warn(`Resource ${resource} not defined for role ${role}`);
      return false;
    }
    
    // Check if permission is granted
    return rolePermissions[role][resource].includes(permission);
  } catch (error) {
    logger.error('Error checking permission', { error, role, resource, permission });
    return false;
  }
}

/**
 * Get all permissions for a role on a resource
 * @param role User role
 * @param resource Resource type
 * @returns Array of permissions
 */
export function getPermissions(
  role: UserRole,
  resource: Resource
): Permission[] {
  try {
    // Check if role exists
    if (!rolePermissions[role]) {
      logger.warn(`Unknown role: ${role}`);
      return [];
    }
    
    // Check if resource is defined for this role
    if (!rolePermissions[role][resource]) {
      logger.warn(`Resource ${resource} not defined for role ${role}`);
      return [];
    }
    
    return [...rolePermissions[role][resource]];
  } catch (error) {
    logger.error('Error getting permissions', { error, role, resource });
    return [];
  }
}

/**
 * Check if a user has a specific permission on a resource
 * @param user User object
 * @param resource Resource type
 * @param permission Permission to check
 * @returns Boolean indicating if user has permission
 */
export function userHasPermission(
  user: { role: string } | null,
  resource: Resource,
  permission: Permission
): boolean {
  if (!user) {
    // No user, use guest role
    return hasPermission(UserRole.GUEST, resource, permission);
  }
  
  try {
    // Convert role string to enum
    const role = user.role as UserRole;
    
    // Invalid role, fallback to guest
    if (!Object.values(UserRole).includes(role)) {
      logger.warn(`Invalid role: ${role}, using guest role`);
      return hasPermission(UserRole.GUEST, resource, permission);
    }
    
    return hasPermission(role, resource, permission);
  } catch (error) {
    logger.error('Error checking user permission', { error, user, resource, permission });
    return false;
  }
}

/**
 * Get highest available role for a user
 * @param roles Array of role strings
 * @returns Highest role from UserRole enum
 */
export function getHighestRole(roles: string[]): UserRole {
  const roleValues = {
    [UserRole.ADMIN]: 3,
    [UserRole.EDITOR]: 2,
    [UserRole.USER]: 1,
    [UserRole.GUEST]: 0
  };
  
  try {
    let highestRole = UserRole.GUEST;
    
    roles.forEach(role => {
      if (role in roleValues && roleValues[role as UserRole] > roleValues[highestRole]) {
        highestRole = role as UserRole;
      }
    });
    
    return highestRole;
  } catch (error) {
    logger.error('Error getting highest role', { error, roles });
    return UserRole.GUEST;
  }
}
