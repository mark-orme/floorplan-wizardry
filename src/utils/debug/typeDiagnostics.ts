
/**
 * Type diagnostics utilities
 * Provides validation and debugging utilities for floor plan types
 * @module utils/debug/typeDiagnostics
 */
import { 
  FloorPlan, 
  Stroke, 
  Wall, 
  Room, 
  StrokeTypeLiteral, 
  RoomTypeLiteral,
  FloorPlanMetadata
} from '@/types/floor-plan/unifiedTypes';

/**
 * Validate if a value is a valid StrokeTypeLiteral
 * @param type The value to check
 * @returns Whether the value is a valid StrokeTypeLiteral
 */
export const isValidStrokeType = (type: unknown): type is StrokeTypeLiteral => {
  const validTypes: StrokeTypeLiteral[] = ['freehand', 'line', 'wall', 'room'];
  return typeof type === 'string' && validTypes.includes(type as StrokeTypeLiteral);
};

/**
 * Validate if a value is a valid RoomTypeLiteral
 * @param type The value to check
 * @returns Whether the value is a valid RoomTypeLiteral
 */
export const isValidRoomType = (type: unknown): type is RoomTypeLiteral => {
  const validTypes: RoomTypeLiteral[] = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
  return typeof type === 'string' && validTypes.includes(type as RoomTypeLiteral);
};

/**
 * Validate if an object is a valid FloorPlan
 * @param obj The object to check
 * @returns Whether the object is a valid FloorPlan
 */
export const isValidFloorPlan = (obj: unknown): obj is FloorPlan => {
  return obj !== null && 
    typeof obj === 'object' && 
    'id' in obj && 
    'strokes' in obj && 
    'walls' in obj && 
    'rooms' in obj && 
    'metadata' in obj;
};

/**
 * Validate if an object is a valid Wall
 * @param obj The object to check
 * @returns Whether the object is a valid Wall
 */
export const isValidWall = (obj: unknown): obj is Wall => {
  return obj !== null && 
    typeof obj === 'object' && 
    'id' in obj && 
    'start' in obj && 
    'end' in obj && 
    'thickness' in obj && 
    'length' in obj;
};

/**
 * Validate if an object is a valid Room
 * @param obj The object to check
 * @returns Whether the object is a valid Room
 */
export const isValidRoom = (obj: unknown): obj is Room => {
  return obj !== null && 
    typeof obj === 'object' && 
    'id' in obj && 
    'name' in obj && 
    'type' in obj && 
    'area' in obj && 
    'vertices' in obj;
};

/**
 * Validate if an object is a valid Stroke
 * @param obj The object to check
 * @returns Whether the object is a valid Stroke
 */
export const isValidStroke = (obj: unknown): obj is Stroke => {
  return obj !== null && 
    typeof obj === 'object' && 
    'id' in obj && 
    'points' in obj && 
    'type' in obj && 
    'thickness' in obj;
};

/**
 * Calculate the length of a wall from start and end points
 * @param start The starting point
 * @param end The ending point
 * @returns The calculated length
 */
export const calculateWallLength = (start: { x: number, y: number }, end: { x: number, y: number }): number => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Log type information for debugging
 * @param obj The object to inspect
 * @param label An optional label for the log
 */
export const logTypeInfo = (obj: unknown, label?: string): void => {
  console.log(`Type info ${label ? 'for ' + label : ''}:`, {
    type: typeof obj,
    isArray: Array.isArray(obj),
    isFloorPlan: isValidFloorPlan(obj),
    isRoom: isValidRoom(obj),
    isWall: isValidWall(obj),
    isStroke: isValidStroke(obj),
    value: obj
  });
};

/**
 * Create a complete FloorPlanMetadata with all required fields
 * @param partial Partial metadata to extend
 * @returns Complete FloorPlanMetadata
 */
export const createCompleteMetadata = (partial: Partial<FloorPlanMetadata> = {}): FloorPlanMetadata => {
  const now = new Date().toISOString();
  return {
    version: partial.version || '1.0',
    author: partial.author || '',
    dateCreated: partial.dateCreated || now,
    lastModified: partial.lastModified || now,
    notes: partial.notes || '',
    createdAt: partial.createdAt || now,
    updatedAt: partial.updatedAt || now,
    paperSize: partial.paperSize || 'A4',
    level: partial.level || 0
  };
};

/**
 * Ensure a wall has length property calculated
 * @param wall The wall to ensure has length
 * @returns The wall with length calculated
 */
export const ensureWallLength = (wall: Omit<Wall, 'length'>): Wall => {
  const length = calculateWallLength(wall.start, wall.end);
  return { ...wall, length };
};
