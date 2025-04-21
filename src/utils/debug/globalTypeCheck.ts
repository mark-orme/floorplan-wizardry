
/**
 * Global type checking utilities
 * @module utils/debug/globalTypeCheck
 */

/**
 * Initialize global type checkers to validate objects at runtime
 */
export function initGlobalTypeCheckers() {
  console.log('Initializing global type checkers');
  
  // Add to window object for debugging in browser console
  const typeCheckers = {
    // Placeholder or actual validators can be assigned here if they exist elsewhere
    checkType: (obj: any, type: string) => {
      switch (type) {
        case 'FloorPlan':
          return false;
        case 'Stroke':
          return false;
        case 'Room':
          return false;
        case 'Wall':
          return false;
        default:
          return false;
      }
    }
  };
  
  // Make available in global scope for debugging
  if (typeof window !== 'undefined') {
    (window as any).__typeCheckers = typeCheckers;
  }
  
  return typeCheckers;
}

// Export validators for direct use
export const validateFloorPlan = (obj: any): { valid: boolean; errors: string[] } => ({ valid: false, errors: [] });
export const validateWall = (obj: any): { valid: boolean; errors: string[] } => ({ valid: false, errors: [] });
export const validateRoom = (obj: any): { valid: boolean; errors: string[] } => ({ valid: false, errors: [] });
export const validateStroke = (obj: any): { valid: boolean; errors: string[] } => ({ valid: false, errors: [] });

// Return the type of an object
export function getObjectType(obj: any): string {
  if (!obj) return 'undefined';
  // No validation available here, so return unknown always
  return 'unknown';
}

// Export validators for type checking
export const isFloorPlan = (obj: any): boolean => false;
export const isWall = (obj: any): boolean => false;
export const isRoom = (obj: any): boolean => false;
export const isStroke = (obj: any): boolean => false;
