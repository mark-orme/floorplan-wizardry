
/**
 * Type Helpers for Tests
 * Utilities for creating properly typed test objects
 * @module __tests__/utils/typeHelpers
 */
import { vi } from 'vitest';
import { 
  Room, 
  Wall, 
  Stroke, 
  FloorPlan, 
  Point, 
  StrokeTypeLiteral, 
  RoomTypeLiteral,
  FloorPlanMetadata,
  asStrokeType,
  asRoomType
} from '@/types/floor-plan/unifiedTypes';

import { 
  calculateWallLength,
  createCompleteMetadata
} from '@/utils/debug/typeDiagnostics';

/**
 * Determine if a stroke type is valid
 * @param type The type to check
 * @returns Whether the type is valid
 */
export const isValidStrokeType = (type: string): boolean => {
  const validTypes: StrokeTypeLiteral[] = ['freehand', 'line', 'wall', 'room'];
  return validTypes.includes(type as StrokeTypeLiteral);
};

/**
 * Determine if a room type is valid
 * @param type The type to check
 * @returns Whether the type is valid
 */
export const isValidRoomType = (type: string): boolean => {
  const validTypes: RoomTypeLiteral[] = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
  return validTypes.includes(type as RoomTypeLiteral);
};

/**
 * Create a test point object
 * @param x X coordinate
 * @param y Y coordinate
 * @returns A point object
 */
export const createPoint = (x: number = 0, y: number = 0): Point => ({ x, y });

/**
 * Create a typed test stroke
 * @param partialStroke Partial stroke data
 * @returns A complete stroke
 */
export const createTypedStroke = (partialStroke: Partial<Stroke> = {}): Stroke => {
  const type = partialStroke.type ? asStrokeType(partialStroke.type as string) : asStrokeType('line');
  
  return {
    id: partialStroke.id || 'stroke-' + Math.random().toString(36).substring(2, 9),
    points: partialStroke.points || [createPoint(0, 0), createPoint(100, 100)],
    type,
    color: partialStroke.color || '#000000',
    thickness: partialStroke.thickness || 2,
    width: partialStroke.width || 2
  };
};

/**
 * Create a typed test wall
 * @param partialWall Partial wall data
 * @returns A complete wall
 */
export const createTypedWall = (partialWall: Partial<Wall> = {}): Wall => {
  const start = partialWall.start || createPoint(0, 0);
  const end = partialWall.end || createPoint(100, 0);
  
  return {
    id: partialWall.id || 'wall-' + Math.random().toString(36).substring(2, 9),
    start,
    end,
    thickness: partialWall.thickness || 5,
    color: partialWall.color || '#333333',
    roomIds: partialWall.roomIds || [],
    length: partialWall.length || calculateWallLength(start, end),
    height: partialWall.height
  };
};

/**
 * Create a typed test room
 * @param partialRoom Partial room data
 * @returns A complete room
 */
export const createTypedRoom = (partialRoom: Partial<Room> = {}): Room => {
  const type = partialRoom.type ? asRoomType(partialRoom.type as string) : asRoomType('other');
  
  return {
    id: partialRoom.id || 'room-' + Math.random().toString(36).substring(2, 9),
    name: partialRoom.name || 'Test Room',
    type,
    vertices: partialRoom.vertices || [
      createPoint(0, 0),
      createPoint(100, 0),
      createPoint(100, 100),
      createPoint(0, 100)
    ],
    area: partialRoom.area || 10000,
    color: partialRoom.color || '#f5f5f5'
  };
};

/**
 * Create a typed test floor plan
 * @param partialFloorPlan Partial floor plan data
 * @returns A complete floor plan
 */
export const createTypedFloorPlan = (partialFloorPlan: Partial<FloorPlan> = {}): FloorPlan => {
  const now = new Date().toISOString();
  
  const defaultMetadata: FloorPlanMetadata = createCompleteMetadata({
    level: partialFloorPlan.level || 0
  });
  
  return {
    id: partialFloorPlan.id || 'floor-' + Math.random().toString(36).substring(2, 9),
    name: partialFloorPlan.name || 'Test Floor Plan',
    label: partialFloorPlan.label || 'Test Floor Plan',
    walls: partialFloorPlan.walls || [],
    rooms: partialFloorPlan.rooms || [],
    strokes: partialFloorPlan.strokes || [],
    canvasData: partialFloorPlan.canvasData || null,
    canvasJson: partialFloorPlan.canvasJson || null,
    createdAt: partialFloorPlan.createdAt || now,
    updatedAt: partialFloorPlan.updatedAt || now,
    gia: partialFloorPlan.gia || 0,
    level: partialFloorPlan.level || 0,
    index: partialFloorPlan.index || 0,
    metadata: partialFloorPlan.metadata || defaultMetadata,
    data: partialFloorPlan.data || {},
    userId: partialFloorPlan.userId || 'test-user'
  };
};

/**
 * Create a mock canvas hook result
 * @returns A mock canvas hook result
 */
export const createMockCanvasHookResult = () => {
  return {
    canvas: null,
    setCanvas: vi.fn(),
    showGridDebug: false,
    setShowGridDebug: vi.fn(),
    forceRefreshKey: 0,
    setForceRefreshKey: vi.fn(),
    activeTool: 'select',
    setActiveTool: vi.fn(),
    lineThickness: 2,
    setLineThickness: vi.fn(),
    lineColor: '#000000',
    setLineColor: vi.fn(),
    gridInitializedRef: { current: false },
    retryCountRef: { current: 0 },
    maxRetries: 3,
    canvasStableRef: { current: false },
    mountedRef: { current: true }
  };
};
