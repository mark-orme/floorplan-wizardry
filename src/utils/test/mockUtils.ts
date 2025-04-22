
import { v4 as uuidv4 } from 'uuid';
import { 
  FloorPlan, 
  Wall, 
  Room, 
  Stroke, 
  Point, 
  createEmptyFloorPlan, 
  createPoint,
  createWall, 
  StrokeTypeLiteral, 
  RoomTypeLiteral 
} from '@/types/core';

/**
 * Generate a mock point with specified coordinates
 */
export function createMockPoint(x = 0, y = 0): Point {
  return createPoint(x, y);
}

/**
 * Generate a mock wall
 */
export function createMockWall(overrides?: Partial<Wall>): Wall {
  const defaultWall: Wall = {
    id: uuidv4(),
    start: createMockPoint(0, 0),
    end: createMockPoint(100, 0),
    thickness: 10,
    length: 100,
    color: '#000000',
    roomIds: []
  };

  return { ...defaultWall, ...overrides };
}

/**
 * Generate a mock room
 */
export function createMockRoom(overrides?: Partial<Room>): Room {
  const defaultRoom: Room = {
    id: uuidv4(),
    name: 'Test Room',
    type: 'bedroom' as RoomTypeLiteral,
    points: [
      createMockPoint(0, 0),
      createMockPoint(100, 0),
      createMockPoint(100, 100),
      createMockPoint(0, 100)
    ],
    vertices: [
      createMockPoint(0, 0),
      createMockPoint(100, 0),
      createMockPoint(100, 100),
      createMockPoint(0, 100)
    ],
    area: 10000,
    color: '#ffffff'
  };

  return { ...defaultRoom, ...overrides };
}

/**
 * Generate a mock stroke
 */
export function createMockStroke(overrides?: Partial<Stroke>): Stroke {
  const defaultStroke: Stroke = {
    id: uuidv4(),
    points: [
      createMockPoint(0, 0),
      createMockPoint(100, 100)
    ],
    color: '#000000',
    width: 2,
    thickness: 2,
    type: 'line' as StrokeTypeLiteral
  };

  return { ...defaultStroke, ...overrides };
}

/**
 * Generate a mock floor plan
 */
export function createMockFloorPlan(overrides?: Partial<FloorPlan>): FloorPlan {
  const baseFloorPlan = createEmptyFloorPlan();
  
  // Ensure all required properties are set with mock values
  const mockFloorPlan: FloorPlan = {
    ...baseFloorPlan,
    walls: [createMockWall()],
    rooms: [createMockRoom()],
    strokes: [createMockStroke()],
    // Make sure to add any other required fields that might be missing
  };

  return { ...mockFloorPlan, ...overrides };
}

// For backwards compatibility
export const createTestFloorPlan = createMockFloorPlan;
