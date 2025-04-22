
import { Point } from '@/types/core/Point';
import { Room, Stroke, FloorPlan, Wall, FloorPlanMetadata } from '@/types/floor-plan/unifiedTypes';

/**
 * Create a test point for testing
 * @param x X coordinate
 * @param y Y coordinate
 * @returns A point object
 */
export const createTestPoint = (x: number = 0, y: number = 0): Point => {
  return { x, y };
};

/**
 * Create mock function parameters for testing
 * @param overrides Properties to override defaults
 * @returns Mock function parameters
 */
export const createMockFunctionParams = (overrides: Record<string, any> = {}): Record<string, any> => {
  return {
    mouseX: overrides.mouseX || 0,
    mouseY: overrides.mouseY || 0,
    pressure: overrides.pressure || 1,
    timestamp: overrides.timestamp || Date.now(),
    ...overrides
  };
};

/**
 * Create a test floor plan for testing
 * @param overrides Properties to override defaults
 * @returns FloorPlan object
 */
export const createTestFloorPlan = (overrides: Partial<FloorPlan> = {}): FloorPlan => {
  const now = new Date().toISOString();
  
  const defaultMetadata: FloorPlanMetadata = {
    createdAt: now,
    updatedAt: now,
    version: '1.0.0',
    paperSize: 'A4',
    level: 0,
    author: 'Test User',
    dateCreated: now,
    lastModified: now,
    notes: ''
  };

  return {
    id: overrides.id || `floorplan-${Date.now()}`,
    name: overrides.name || 'Test Floor Plan',
    label: overrides.label || 'Test Floor',
    walls: overrides.walls || [],
    rooms: overrides.rooms || [],
    strokes: overrides.strokes || [],
    canvasData: overrides.canvasData || null,
    canvasJson: overrides.canvasJson || null,
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
    gia: overrides.gia || 0,
    level: overrides.level || 0,
    index: overrides.index || 0,
    metadata: overrides.metadata || defaultMetadata,
    data: overrides.data || {},
    userId: overrides.userId || 'test-user'
  };
};

/**
 * Create a test wall for testing
 * @param overrides Partial wall properties to override defaults
 * @returns Wall object
 */
export const createTestWall = (overrides: Partial<Wall> = {}): Wall => {
  // Calculate angle if not provided but start and end points are
  let angle = overrides.angle;
  if (angle === undefined && overrides.start && overrides.end) {
    const dx = overrides.end.x - overrides.start.x;
    const dy = overrides.end.y - overrides.start.y;
    angle = Math.atan2(dy, dx) * (180 / Math.PI);
  }

  return {
    id: overrides.id || `wall-${Date.now()}`,
    start: overrides.start || { x: 0, y: 0 },
    end: overrides.end || { x: 100, y: 0 },
    thickness: overrides.thickness || 5,
    length: overrides.length || 100,
    angle: angle || 0, // Default angle if not calculated
    roomIds: overrides.roomIds || [],
    floorPlanId: overrides.floorPlanId || 'test-floor-plan',
    color: overrides.color || '#000000',
    height: overrides.height || 240
  };
};

/**
 * Create a test room for testing
 * @param overrides Partial room properties to override defaults
 * @returns Room object for testing
 */
export const createTestRoom = (overrides: Partial<Room> = {}): Room => {
  return {
    id: overrides.id || `room-${Date.now()}`,
    name: overrides.name || 'Test Room',
    type: overrides.type || 'living',
    area: overrides.area || 100,
    perimeter: overrides.perimeter || 40,
    center: overrides.center || { x: 50, y: 50 },
    vertices: overrides.vertices || [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ],
    labelPosition: overrides.labelPosition || { x: 50, y: 50 },
    color: overrides.color || '#FFFFFF',
    floorPlanId: overrides.floorPlanId || 'test-floor-plan'
  };
};

/**
 * Create a test stroke for testing
 * @param overrides Partial stroke properties to override defaults
 * @returns Stroke object for testing
 */
export const createTestStroke = (overrides: Partial<Stroke> = {}): Stroke => {
  return {
    id: overrides.id || `stroke-${Date.now()}`,
    type: overrides.type || 'line',
    points: overrides.points || [
      { x: 0, y: 0 },
      { x: 100, y: 100 }
    ],
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 1,
    floorPlanId: overrides.floorPlanId || 'test-floor-plan'
  };
};
