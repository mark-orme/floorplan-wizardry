
// Import USER_ROLES for consistent role comparison
const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user'
};

export const usePropertyPageAuth = () => {
  const checkUserPermission = (userRole) => {
    // Use the imported USER_ROLES constant for comparison
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
    
    // Default user role
    return {
      canEdit: false,
      canDelete: false,
      canPublish: false
    };
  };
  
  return { checkUserPermission };
};

export { USER_ROLES };
