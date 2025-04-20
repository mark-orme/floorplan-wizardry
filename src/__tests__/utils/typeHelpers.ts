
/**
 * Type helper utilities for tests
 * Ensures consistent type usage across tests
 * @module __tests__/utils/typeHelpers
 */
import { Canvas as FabricCanvas } from 'fabric';
import { FloorPlan, Stroke, Point, StrokeTypeLiteral, RoomTypeLiteral } from '@/types/floor-plan/typesBarrel';
import { ICanvasMock } from '@/types/testing/ICanvasMock';

/**
 * Safely type a canvas mock as a minimal interface
 * Prevents TS errors with properties not used in tests
 * 
 * @param mockCanvas Canvas mock object
 * @returns Properly typed canvas mock
 */
export function asCanvasMock(mockCanvas: any): ICanvasMock {
  return mockCanvas as ICanvasMock;
}

/**
 * Ensure a floor plan object conforms to the FloorPlan interface
 * 
 * @param floorPlan Floor plan object to check
 * @returns Typed floor plan
 */
export function ensureFloorPlan(floorPlan: any): FloorPlan {
  // Ensure required properties exist
  if (!floorPlan.id || !floorPlan.updatedAt) {
    throw new Error('Invalid floor plan object');
  }
  
  // Ensure data and userId properties exist (add if missing)
  if (!floorPlan.data) {
    floorPlan.data = {};
  }
  
  if (!floorPlan.userId) {
    floorPlan.userId = 'test-user';
  }
  
  return floorPlan as FloorPlan;
}

/**
 * Create a minimal canvas reference object for tests
 * 
 * @param canvas Canvas mock
 * @returns Canvas reference object
 */
export function createCanvasRef(canvas: ICanvasMock): React.MutableRefObject<ICanvasMock> {
  return { current: canvas };
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
