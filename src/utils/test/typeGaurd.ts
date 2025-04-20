
/**
 * Type guards for tests
 * @module utils/test/typeGaurd
 */
import { 
  FloorPlan, Room, Stroke, Wall, 
  StrokeTypeLiteral, RoomTypeLiteral,
  asStrokeType, asRoomType
} from '@/types/floor-plan/unifiedTypes';
import { ICanvasMock } from '@/types/testing/ICanvasMock';
import { Canvas } from 'fabric';

/**
 * Ensure a stroke has a valid StrokeTypeLiteral value
 * @param stroke Stroke to validate
 * @returns Validated stroke
 */
export function ensureStroke(stroke: any): Stroke {
  if (!stroke) {
    throw new Error('Stroke is undefined or null');
  }
  
  // If type is a string, ensure it's a valid StrokeTypeLiteral
  if (typeof stroke.type === 'string') {
    const validType = asStrokeType(stroke.type);
    
    // Create a new stroke with the valid type
    return {
      ...stroke,
      type: validType,
      // Ensure width exists (could be missing in old data)
      width: stroke.width || stroke.thickness || 2
    };
  }
  
  return stroke as Stroke;
}

/**
 * Ensure a room has a valid RoomTypeLiteral value
 * @param room Room to validate
 * @returns Validated room
 */
export function ensureRoom(room: any): Room {
  if (!room) {
    throw new Error('Room is undefined or null');
  }
  
  // If type is a string, ensure it's a valid RoomTypeLiteral
  if (typeof room.type === 'string') {
    const validType = asRoomType(room.type);
    
    // Create a new room with the valid type
    return {
      ...room,
      type: validType,
      // Ensure walls exists
      walls: room.walls || []
    };
  }
  
  return room as Room;
}

/**
 * Ensure a wall has all required properties
 * @param wall Wall to validate
 * @returns Validated wall
 */
export function ensureWall(wall: any): Wall {
  if (!wall) {
    throw new Error('Wall is undefined or null');
  }
  
  // Ensure roomIds exists
  if (!wall.roomIds) {
    wall.roomIds = [];
  }
  
  // Calculate length if missing
  if (wall.start && wall.end && !wall.length) {
    const dx = wall.end.x - wall.start.x;
    const dy = wall.end.y - wall.start.y;
    wall.length = Math.sqrt(dx * dx + dy * dy);
  }
  
  return wall as Wall;
}

/**
 * Ensure a floor plan has all required properties
 * @param floorPlan Floor plan to validate
 * @returns Validated floor plan
 */
export function ensureFloorPlan(floorPlan: any): FloorPlan {
  if (!floorPlan) {
    throw new Error('Floor plan is undefined or null');
  }
  
  // Ensure data and userId properties exist
  if (!floorPlan.data) {
    floorPlan.data = {};
  }
  
  if (!floorPlan.userId) {
    floorPlan.userId = 'test-user';
  }
  
  // Ensure label exists
  if (!floorPlan.label) {
    floorPlan.label = floorPlan.name || 'Untitled';
  }
  
  // Validate arrays of walls, rooms, and strokes
  if (floorPlan.walls) {
    floorPlan.walls = floorPlan.walls.map(ensureWall);
  }
  
  if (floorPlan.rooms) {
    floorPlan.rooms = floorPlan.rooms.map(ensureRoom);
  }
  
  if (floorPlan.strokes) {
    floorPlan.strokes = floorPlan.strokes.map(ensureStroke);
  }
  
  return floorPlan as FloorPlan;
}

/**
 * Type-safe Canvas mock conversion
 * Ensures the mock Canvas is properly typed
 * @param mockCanvas Canvas mock object
 * @returns Properly typed Canvas mock
 */
export function asMockCanvasWithHandlers(mockCanvas: any): Canvas & {
  getHandlers: (eventName: string) => Function[];
  triggerEvent: (eventName: string, eventData: any) => void;
  withImplementation: (callback?: Function) => Promise<void>;
} {
  // Add missing properties if they don't exist
  if (!mockCanvas.getHandlers) {
    mockCanvas.getHandlers = (eventName: string) => [];
  }
  
  if (!mockCanvas.triggerEvent) {
    mockCanvas.triggerEvent = (eventName: string, eventData: any) => {};
  }
  
  // Ensure withImplementation returns a Promise<void>
  if (!mockCanvas.withImplementation) {
    mockCanvas.withImplementation = (callback?: Function): Promise<void> => {
      if (callback) {
        try {
          const result = callback();
          if (result instanceof Promise) {
            return result.then(() => Promise.resolve());
          }
        } catch (error) {
          console.error('Error in mock withImplementation:', error);
        }
      }
      return Promise.resolve();
    };
  }
  
  return mockCanvas as Canvas & {
    getHandlers: (eventName: string) => Function[];
    triggerEvent: (eventName: string, eventData: any) => void;
    withImplementation: (callback?: Function) => Promise<void>;
  };
}
