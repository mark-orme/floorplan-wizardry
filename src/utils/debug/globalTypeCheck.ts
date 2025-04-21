
/**
 * Global type checking utilities
 * @module utils/debug/globalTypeCheck
 */

// We remove the imports of validateFloorPlan, validateRoom, validateWall, validateStroke since they don't exist in typeDiagnostics.ts anymore
// Instead, we do a minimal global init

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

// Export validators for direct use (left empty because no exports available)
export const validateTypes = {
  floorPlan: () => false,
  stroke: () => false,
  room: () => false,
  wall: () => false
};

// Return the type of an object
export function getObjectType(obj: any): string {
  if (!obj) return 'undefined';
  // No validation available here, so return unknown always
  return 'unknown';
}
