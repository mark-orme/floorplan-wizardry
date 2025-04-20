/**
 * Floor Plan Adapter Utilities
 * 
 * Provides utilities for adapting and normalizing floor plan data
 * between different parts of the application.
 */
import { DrawingMode } from '@/constants/drawingModes';
import type { FloorPlan } from '@/types/floorPlanTypes';

/**
 * Adapts a floor plan from API format to application format
 * 
 * @param apiFloorPlan - Floor plan data from the API
 * @returns Adapted floor plan for the application
 */
export function adaptFloorPlan(apiFloorPlan: any): FloorPlan {
  if (!apiFloorPlan) {
    throw new Error('Cannot adapt null or undefined floor plan');
  }
  
  // Set default values for required properties
  const adapted: FloorPlan = {
    id: apiFloorPlan.id || '',
    name: apiFloorPlan.name || '',
    label: apiFloorPlan.label || '',
    userId: apiFloorPlan.userId || '',
    data: apiFloorPlan.data || {},
    strokes: apiFloorPlan.strokes || [],
    walls: apiFloorPlan.walls || [],
    rooms: apiFloorPlan.rooms || [],
    level: apiFloorPlan.level || 0,
    index: apiFloorPlan.index || 0,
    gia: apiFloorPlan.gia || 0,
    canvasData: apiFloorPlan.canvasData || null,
    canvasJson: apiFloorPlan.canvasJson || null,
    createdAt: apiFloorPlan.createdAt || new Date().toISOString(),
    updatedAt: apiFloorPlan.updatedAt || new Date().toISOString(),
    metadata: apiFloorPlan.metadata || {}
  };
  
  return adapted;
}

/**
 * Normalizes a drawing mode string to the correct enum value
 * 
 * @param mode - Drawing mode string or enum value
 * @returns Normalized DrawingMode enum value
 */
export function normalizeDrawingMode(mode: string | DrawingMode): DrawingMode {
  if (typeof mode === 'string') {
    // Try to match string to enum value
    const normalizedMode = mode.toLowerCase();
    
    for (const key in DrawingMode) {
      if (DrawingMode[key as keyof typeof DrawingMode].toLowerCase() === normalizedMode) {
        return DrawingMode[key as keyof typeof DrawingMode];
      }
    }
    
    // Default to SELECT if not found
    console.warn(`Unknown drawing mode: ${mode}, using SELECT mode instead`);
    return DrawingMode.SELECT;
  }
  
  // Already a DrawingMode enum value
  return mode;
}

/**
 * Creates a default empty floor plan with required properties
 * 
 * @param userId - ID of the user creating the floor plan
 * @returns New empty floor plan
 */
export function createEmptyFloorPlan(userId: string): FloorPlan {
  return {
    id: crypto.randomUUID(),
    name: 'New Floor Plan',
    label: 'Floor Plan',
    userId,
    data: {},
    strokes: [],
    walls: [],
    rooms: [],
    level: 0,
    index: 0,
    gia: 0,
    canvasData: null,
    canvasJson: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      version: '1.0',
      scale: 1,
      unit: 'meter'
    }
  };
}

/**
 * Validates that a floor plan object has all required properties
 * 
 * @param floorPlan - Floor plan object to validate
 * @returns True if valid, false otherwise
 */
export function validateFloorPlan(floorPlan: any): boolean {
  const requiredProps = [
    'id', 'name', 'label', 'userId', 'data',
    'strokes', 'walls', 'rooms', 'createdAt', 'updatedAt'
  ];
  
  if (!floorPlan) return false;
  
  return requiredProps.every(prop => prop in floorPlan);
}

// Added validation functions
export const validatePoint = (point: any): boolean => {
  return point && typeof point.x === 'number' && typeof point.y === 'number';
};

export const validateColor = (color: any): boolean => {
  return typeof color === 'string' && /^#[0-9A-Fa-f]{6}$/.test(color);
};

export const validateTimestamp = (timestamp: any): boolean => {
  return typeof timestamp === 'string' && !isNaN(Date.parse(timestamp));
};

export const validateStrokeType = (type: any): boolean => {
  return typeof type === 'string' && ['pencil', 'line', 'rectangle', 'circle'].includes(type);
};

export const mapRoomType = (type: string): string => {
  const validTypes = ['bedroom', 'bathroom', 'kitchen', 'living', 'dining', 'office', 'other'];
  return validTypes.includes(type) ? type : 'other';
};

// Added adapter functions
export const appToCoreFloorPlan = (floorPlan: any): any => {
  // Convert app-specific floor plan to core format
  return {
    id: floorPlan.id,
    name: floorPlan.name,
    data: floorPlan.canvasJson || {},
    userId: floorPlan.userId || 'anonymous',
    createdAt: floorPlan.createdAt,
    updatedAt: floorPlan.updatedAt
  };
};

export const coreToAppFloorPlan = (corePlan: any): any => {
  // Convert core floor plan to app-specific format
  return {
    id: corePlan.id,
    name: corePlan.name,
    label: corePlan.name,
    canvasJson: corePlan.data,
    canvasData: null,
    userId: corePlan.userId,
    index: 0,
    level: 1,
    gia: 0,
    strokes: [],
    walls: [],
    rooms: [],
    createdAt: corePlan.createdAt,
    updatedAt: corePlan.updatedAt,
    metadata: {
      version: '1.0',
      scale: 1,
      unit: 'meters'
    }
  };
};

export const appToCoreFloorPlans = (floorPlans: any[]): any[] => {
  return floorPlans.map(appToCoreFloorPlan);
};
