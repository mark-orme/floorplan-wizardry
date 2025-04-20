
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
  asRoomType,
  createTestPoint,
  createTestStroke,
  createTestWall,
  createTestRoom,
  createTestFloorPlan
} from '@/types/floor-plan/unifiedTypes';

import { createCompleteMetadata } from '@/utils/debug/typeDiagnostics';

/**
 * Determine if a stroke type is valid
 * @param type The type to check
 * @returns Whether the type is valid
 */
export const isValidStrokeType = (type: string): boolean => {
  const validTypes: StrokeTypeLiteral[] = ['line', 'wall', 'door', 'window', 'furniture', 'annotation'];
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

// Re-export test utilities from the unifiedTypes
export { 
  createTestPoint,
  createTestStroke,
  createTestWall,
  createTestRoom,
  createTestFloorPlan
};

/**
 * Create a typed test stroke
 * @param partialStroke Partial stroke data
 * @returns A complete stroke
 */
export const createTypedStroke = (partialStroke: Partial<Stroke> = {}): Stroke => {
  const type = partialStroke.type ? asStrokeType(partialStroke.type as string) : asStrokeType('line');
  
  return {
    id: partialStroke.id || 'stroke-' + Math.random().toString(36).substring(2, 9),
    points: partialStroke.points || [createTestPoint(0, 0), createTestPoint(100, 100)],
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
  const start = partialWall.start || createTestPoint(0, 0);
  const end = partialWall.end || createTestPoint(100, 0);
  
  return {
    id: partialWall.id || 'wall-' + Math.random().toString(36).substring(2, 9),
    start,
    end,
    thickness: partialWall.thickness || 5,
    color: partialWall.color || '#333333',
    roomIds: partialWall.roomIds || [],
    length: partialWall.length || Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    ),
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
  
  const vertices = partialRoom.vertices || [
    createTestPoint(0, 0),
    createTestPoint(100, 0),
    createTestPoint(100, 100),
    createTestPoint(0, 100)
  ];
  
  const center = {
    x: vertices.reduce((sum, v) => sum + v.x, 0) / vertices.length,
    y: vertices.reduce((sum, v) => sum + v.y, 0) / vertices.length
  };
  
  // Calculate perimeter
  let perimeter = 0;
  for (let i = 0; i < vertices.length; i++) {
    const p1 = vertices[i];
    const p2 = vertices[(i + 1) % vertices.length];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }
  
  return {
    id: partialRoom.id || 'room-' + Math.random().toString(36).substring(2, 9),
    name: partialRoom.name || 'Test Room',
    type,
    vertices,
    area: partialRoom.area || 10000,
    perimeter: partialRoom.perimeter || perimeter,
    labelPosition: partialRoom.labelPosition || center,
    center: partialRoom.center || center,
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
    canvasState: partialFloorPlan.canvasState || null,
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
