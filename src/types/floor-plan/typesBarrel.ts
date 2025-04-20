
/**
 * Floor Plan Types Barrel
 * Single source of truth for all floor plan types
 * @module types/floor-plan/typesBarrel
 */

// Import from the main floorPlanTypes.ts (our source of truth)
import {
  FloorPlan,
  Stroke,
  Wall,
  Room,
  Point,
  StrokeTypeLiteral,
  RoomTypeLiteral,
  FloorPlanMetadata,
  PaperSize,
  DrawingMode
} from '../floorPlanTypes';

// Re-export all types using the proper syntax for isolated modules
export type { FloorPlan };
export type { Stroke };
export type { Wall };
export type { Room };
export type { Point };
export type { StrokeTypeLiteral };
export type { RoomTypeLiteral };
export type { FloorPlanMetadata };
export type { PaperSize };
export type { DrawingMode };

// Type validation functions
export function isFloorPlan(obj: any): obj is FloorPlan {
  return obj && 
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.userId === 'string' &&
    typeof obj.data === 'object';
}

export function isStroke(obj: any): obj is Stroke {
  return obj && 
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    Array.isArray(obj.points) &&
    typeof obj.color === 'string' &&
    typeof obj.thickness === 'number' &&
    typeof obj.width === 'number';
}

export function isRoom(obj: any): obj is Room {
  return obj && 
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    Array.isArray(obj.points) &&
    typeof obj.color === 'string' &&
    typeof obj.area === 'number';
}

/**
 * Safely cast a string to StrokeTypeLiteral
 * @param type String to cast
 * @returns Properly typed StrokeTypeLiteral
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = ['line', 'polyline', 'wall', 'room', 'freehand', 'door', 'window', 'furniture', 'annotation', 'other'];
  if (validTypes.includes(type as StrokeTypeLiteral)) {
    return type as StrokeTypeLiteral;
  }
  return 'other';
}

/**
 * Safely cast a string to RoomTypeLiteral
 * @param type String to cast
 * @returns Properly typed RoomTypeLiteral
 */
export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
  if (validTypes.includes(type as RoomTypeLiteral)) {
    return type as RoomTypeLiteral;
  }
  return 'other';
}

/**
 * Creates a test floor plan with all required properties
 * @param overrides - Optional properties to override defaults
 * @returns FloorPlan object for testing
 */
export const createTestFloorPlan = (overrides: Partial<FloorPlan> = {}): FloorPlan => {
  const now = new Date().toISOString();
  
  return {
    id: `test-fp-${Date.now()}`,
    name: 'Test Floor Plan',
    label: 'Test Floor Plan',
    data: {},
    userId: 'test-user',
    walls: [],
    rooms: [],
    strokes: [],
    canvasJson: null,
    canvasData: null,
    createdAt: now,
    updatedAt: now,
    gia: 0,
    level: 0,
    index: 0,
    metadata: {
      createdAt: now,
      updatedAt: now,
      paperSize: PaperSize.A4,
      level: 0,
      version: "1.0",
      author: "Test User",
      dateCreated: now,
      lastModified: now,
      notes: ""
    },
    ...overrides
  };
};
