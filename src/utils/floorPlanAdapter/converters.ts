
/**
 * Floor plan converters
 * @module utils/floorPlanAdapter/converters
 */
import { 
  FloorPlan,
  Stroke,
  Wall,
  Room,
  Point,
  StrokeTypeLiteral,
  RoomTypeLiteral
} from '@/types/floor-plan/unifiedTypes';

import { DrawingMode } from '@/constants/drawingModes';
import { calculateWallLength } from '@/utils/debug/typeDiagnostics';

/**
 * Validates a point with x and y coordinates
 * @param point Point to validate
 * @returns Valid point with x and y properties
 */
export function validatePoint(point: any): { x: number, y: number } {
  return {
    x: typeof point?.x === 'number' ? point.x : 0,
    y: typeof point?.y === 'number' ? point.y : 0
  };
}

/**
 * Validates a color string
 * @param color Color to validate
 * @returns Valid color string
 */
export function validateColor(color: any): string {
  return typeof color === 'string' ? color : '#000000';
}

/**
 * Validates a timestamp string
 * @param timestamp Timestamp to validate
 * @returns Valid timestamp
 */
export function validateTimestamp(timestamp: any): string {
  return typeof timestamp === 'string' ? timestamp : new Date().toISOString();
}

/**
 * Validates a stroke type to ensure it's a valid StrokeTypeLiteral
 * @param type Type to validate
 * @returns Valid StrokeTypeLiteral
 */
export function validateStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = ['line', 'wall', 'door', 'window', 'furniture', 'annotation'];
  return validTypes.includes(type as StrokeTypeLiteral) ? type as StrokeTypeLiteral : 'line';
}

/**
 * Checks if a string is a valid StrokeTypeLiteral
 * @param type Type to check
 * @returns Valid StrokeTypeLiteral
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  return validateStrokeType(type);
}

/**
 * Validates a room type to ensure it's a valid RoomTypeLiteral
 * @param type Type to validate
 * @returns Valid RoomTypeLiteral
 */
export function validateRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
  return validTypes.includes(type as RoomTypeLiteral) ? type as RoomTypeLiteral : 'other';
}

/**
 * Checks if a string is a valid RoomTypeLiteral
 * @param type Type to check
 * @returns Valid RoomTypeLiteral
 */
export function asRoomType(type: string): RoomTypeLiteral {
  return validateRoomType(type);
}

/**
 * Maps a room type string to a valid RoomTypeLiteral 
 * (Alias for validateRoomType for backward compatibility)
 * @param type Room type to map
 * @returns Properly typed RoomTypeLiteral
 */
export const mapRoomType = validateRoomType;

/**
 * Normalize drawing mode to ensure compatibility
 * @param mode Drawing mode to normalize
 * @returns Normalized drawing mode
 */
export function normalizeDrawingMode(mode: string | DrawingMode): DrawingMode {
  const validModes = Object.values(DrawingMode);
  if (validModes.includes(mode as DrawingMode)) {
    return mode as DrawingMode;
  }
  return DrawingMode.SELECT;
}

/**
 * Adapt a floor plan for API compatibility
 * @param floorPlan Floor plan to adapt
 * @returns Adapted floor plan
 */
export function adaptFloorPlan(floorPlan: any): FloorPlan {
  // Handle walls - ensure they have all required properties
  const adaptedWalls = Array.isArray(floorPlan.walls) ? floorPlan.walls.map((wall: any) => {
    // Ensure basic properties exist
    const start = validatePoint(wall.start || wall.startPoint);
    const end = validatePoint(wall.end || wall.endPoint);
    
    // Calculate length if not provided
    const length = typeof wall.length === 'number' ? wall.length : calculateWallLength(start, end);
    
    return {
      id: wall.id || `wall-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      start,
      end,
      thickness: typeof wall.thickness === 'number' ? wall.thickness : 5,
      length,
      color: validateColor(wall.color),
      roomIds: Array.isArray(wall.roomIds) ? wall.roomIds : []
    } as Wall;
  }) : [];
  
  // Handle rooms - ensure they have all required properties
  const adaptedRooms = Array.isArray(floorPlan.rooms) ? floorPlan.rooms.map((room: any) => {
    const points = Array.isArray(room.points) ? room.points.map(validatePoint) : [];
    const vertices = Array.isArray(room.vertices) ? room.vertices.map(validatePoint) : points;
    
    return {
      id: room.id || `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: room.name || 'Unnamed Room',
      type: asRoomType(room.type || 'other'),
      area: typeof room.area === 'number' ? room.area : 0,
      vertices: vertices.length > 0 ? vertices : [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }],
      perimeter: room.perimeter || 0,
      labelPosition: validatePoint(room.labelPosition),
      center: validatePoint(room.center),
      color: validateColor(room.color)
    } as Room;
  }) : [];
  
  // Handle complete metadata
  const now = new Date().toISOString();
  const metadata = {
    version: floorPlan.metadata?.version || '1.0',
    author: floorPlan.metadata?.author || '',
    dateCreated: floorPlan.metadata?.dateCreated || floorPlan.metadata?.createdAt || now,
    lastModified: floorPlan.metadata?.lastModified || floorPlan.metadata?.updatedAt || now,
    notes: floorPlan.metadata?.notes || '',
    createdAt: floorPlan.metadata?.createdAt || now,
    updatedAt: floorPlan.metadata?.updatedAt || now,
    paperSize: floorPlan.metadata?.paperSize || 'A4',
    level: typeof floorPlan.metadata?.level === 'number' ? floorPlan.metadata.level : 0
  };
  
  // Create adapted floor plan
  return {
    id: floorPlan.id || `fp-${Date.now()}`,
    name: floorPlan.name || 'Untitled Floor Plan',
    label: floorPlan.label || floorPlan.name || 'Untitled Floor Plan',
    walls: adaptedWalls,
    rooms: adaptedRooms,
    strokes: Array.isArray(floorPlan.strokes) ? floorPlan.strokes : [],
    canvasData: floorPlan.canvasData || null,
    canvasJson: floorPlan.canvasJson || null,
    canvasState: floorPlan.canvasState || null,
    createdAt: validateTimestamp(floorPlan.createdAt),
    updatedAt: validateTimestamp(floorPlan.updatedAt),
    gia: typeof floorPlan.gia === 'number' ? floorPlan.gia : 0,
    level: typeof floorPlan.level === 'number' ? floorPlan.level : 0,
    index: typeof floorPlan.index === 'number' ? floorPlan.index : 0,
    metadata,
    data: floorPlan.data || {},
    userId: floorPlan.userId || 'default-user'
  };
}

/**
 * Convert app floor plans to core floor plans
 * @param appFloorPlans App floor plans
 * @returns Core floor plans
 */
export function appToCoreFloorPlans(appFloorPlans: FloorPlan[]): FloorPlan[] {
  return appFloorPlans.map(appToCoreFloorPlan);
}

/**
 * Convert a single app floor plan to core floor plan
 * @param appFloorPlan App floor plan
 * @returns Core floor plan
 */
export function appToCoreFloorPlan(appFloorPlan: FloorPlan): FloorPlan {
  return adaptFloorPlan(appFloorPlan);
}

/**
 * Convert core floor plans to app floor plans
 * @param coreFloorPlans Core floor plans
 * @returns App floor plans
 */
export function coreToAppFloorPlans(coreFloorPlans: FloorPlan[]): FloorPlan[] {
  return coreFloorPlans.map(coreToAppFloorPlan);
}

/**
 * Convert a single core floor plan to app floor plan
 * @param coreFloorPlan Core floor plan
 * @returns App floor plan
 */
export function coreToAppFloorPlan(coreFloorPlan: FloorPlan): FloorPlan {
  return adaptFloorPlan(coreFloorPlan);
}
