
/**
 * Global type checking utilities
 * @module utils/debug/globalTypeCheck
 */
import { FloorPlan, Stroke, Room, Wall } from '@/types/floor-plan/unifiedTypes';
import { validateFloorPlan, validateStroke, validateRoom, validateWall } from './typeDiagnostics';

/**
 * Initialize global type checkers to validate objects at runtime
 */
export function initGlobalTypeCheckers() {
  console.log('Initializing global type checkers');
  
  // Add to window object for debugging in browser console
  const typeCheckers = {
    validateFloorPlan,
    validateStroke,
    validateRoom,
    validateWall,
    checkType: (obj: any, type: string) => {
      switch (type) {
        case 'FloorPlan':
          return validateFloorPlan(obj);
        case 'Stroke':
          return validateStroke(obj);
        case 'Room':
          return validateRoom(obj);
        case 'Wall':
          return validateWall(obj);
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
export const validateTypes = {
  floorPlan: validateFloorPlan,
  stroke: validateStroke,
  room: validateRoom,
  wall: validateWall
};

// Named export for better import syntax
export { initGlobalTypeCheckers };
