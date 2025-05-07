
// Import USER_ROLES for consistent role comparison
const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user'
};

export const usePropertyPageAuth = () => {
  const checkUserPermission = (userRole?: string) => {
    // Use the imported USER_ROLES constant for comparison
    // Handle undefined userRole
    if (userRole === USER_ROLES.ADMIN) {
      return {
        canEdit: true,
        canDelete: true,
        canPublish: true
      };
    }
    
    if (userRole === USER_ROLES.MODERATOR) {
      return {
        canEdit: true,
        canDelete: false,
        canPublish: true
      };
    }
    
    // Default user role or undefined
    return {
      canEdit: false,
      canDelete: false,
      canPublish: false
    };
  };
  
  return { checkUserPermission };
};

export { USER_ROLES };
