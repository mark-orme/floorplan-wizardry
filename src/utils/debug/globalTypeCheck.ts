
/**
 * Global Type Checking Utilities
 * Provides debug helpers that can be called from anywhere
 */
import { 
  isValidFloorPlan, 
  isValidStroke, 
  isValidRoom, 
  logTypeInfo 
} from './typeDiagnostics';

// Make these functions available globally for debugging
declare global {
  interface Window {
    __DEBUG_validateFloorPlan: (floorPlan: any) => boolean;
    __DEBUG_validateStroke: (stroke: any) => boolean;
    __DEBUG_validateRoom: (room: any) => boolean;
    __DEBUG_logTypeInfo: (obj: any, label?: string) => void;
  }
}

// Initialize global debug helpers
export function initGlobalTypeCheckers(): void {
  if (typeof window !== 'undefined') {
    window.__DEBUG_validateFloorPlan = isValidFloorPlan;
    window.__DEBUG_validateStroke = isValidStroke;
    window.__DEBUG_validateRoom = isValidRoom;
    window.__DEBUG_logTypeInfo = logTypeInfo;
    
    console.log('Global type checkers initialized. Use window.__DEBUG_validateFloorPlan(), etc.');
  }
}

// Auto-initialize in development
if (process.env.NODE_ENV !== 'production') {
  initGlobalTypeCheckers();
}
