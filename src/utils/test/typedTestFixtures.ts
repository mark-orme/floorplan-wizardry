
/**
 * Typed test fixtures
 * Provides strongly-typed test data creation helpers
 * @module utils/test/typedTestFixtures
 */
import { v4 as uuidv4 } from 'uuid';
import { 
  FloorPlan, 
  Room, 
  Wall, 
  Stroke, 
  Point, 
  FloorPlanMetadata,
  StrokeTypeLiteral,
  RoomTypeLiteral,
  PaperSize,
  createCompleteMetadata
} from '@/types/floor-plan/unifiedTypes';

/**
 * Creates a test point
 * @param overrides Properties to override defaults
 * @returns Test point
 */
export const createTestPoint = (overrides: Partial<Point> = {}): Point => {
  return {
    x: overrides.x ?? 0,
    y: overrides.y ?? 0
  };
};

/**
 * Creates a test stroke with valid type
 * @param overrides Properties to override defaults
 * @returns Test stroke
 */
export const createTestStroke = (overrides: Partial<Stroke> = {}): Stroke => {
  return {
    id: overrides.id ?? uuidv4(),
    points: overrides.points ?? [createTestPoint(), createTestPoint({ x: 100, y: 100 })],
    type: overrides.type ?? 'line' as StrokeTypeLiteral,
    thickness: overrides.thickness ?? 2,
    width: overrides.width ?? overrides.thickness ?? 2,
    color: overrides.color ?? '#000000'
  };
};

/**
 * Creates a test wall
 * @param overrides Properties to override defaults
 * @returns Test wall
 */
export const createTestWall = (overrides: Partial<Wall> = {}): Wall => {
  const start = overrides.start ?? createTestPoint();
  const end = overrides.end ?? createTestPoint({ x: 100, y: 0 });
  
  // Calculate length if not provided
  const length = overrides.length ?? Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
  );
  
  return {
    id: overrides.id ?? uuidv4(),
    start,
    end,
    thickness: overrides.thickness ?? 10,
    length,
    color: overrides.color ?? '#000000',
    roomIds: overrides.roomIds ?? [],
    height: overrides.height
  };
};

/**
 * Creates a test room
 * @param overrides Properties to override defaults
 * @returns Test room
 */
export const createTestRoom = (overrides: Partial<Room> = {}): Room => {
  return {
    id: overrides.id ?? uuidv4(),
    name: overrides.name ?? 'Test Room',
    type: overrides.type ?? 'other' as RoomTypeLiteral,
    area: overrides.area ?? 0,
    vertices: overrides.vertices ?? [
      createTestPoint(),
      createTestPoint({ x: 100, y: 0 }),
      createTestPoint({ x: 100, y: 100 }),
      createTestPoint({ x: 0, y: 100 })
    ],
    perimeter: overrides.perimeter,
    labelPosition: overrides.labelPosition,
    center: overrides.center,
    color: overrides.color ?? '#ffffff'
  };
};

/**
 * Creates a complete test floor plan with all required properties
 * @param overrides Properties to override defaults
 * @returns Test floor plan
 */
export const createTestFloorPlan = (overrides: Partial<FloorPlan> = {}): FloorPlan => {
  const now = new Date().toISOString();
  
  return {
    id: overrides.id ?? uuidv4(),
    name: overrides.name ?? 'Test Floor Plan',
    label: overrides.label ?? 'Test Floor Plan',
    walls: overrides.walls ?? [],
    rooms: overrides.rooms ?? [],
    strokes: overrides.strokes ?? [],
    canvasData: overrides.canvasData ?? null,
    canvasJson: overrides.canvasJson ?? null,
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
    gia: overrides.gia ?? 0,
    level: overrides.level ?? 0,
    index: overrides.index ?? 0,
    metadata: overrides.metadata ?? createCompleteMetadata({
      level: overrides.level ?? 0
    }),
    data: overrides.data ?? {},
    userId: overrides.userId ?? 'test-user',
    canvasState: overrides.canvasState
  };
};

/**
 * Creates a typed mock canvas that satisfies the Canvas type
 * @returns Mock canvas
 */
export const createTypedMockCanvas = () => {
  const eventHandlers: Record<string, Function[]> = {};
  
  const canvas = {
    add: jest.fn(),
    remove: jest.fn(),
    clear: jest.fn(),
    renderAll: jest.fn(),
    requestRenderAll: jest.fn(),
    setWidth: jest.fn(),
    setHeight: jest.fn(),
    getObjects: jest.fn().mockReturnValue([]),
    getContext: jest.fn(),
    getElement: jest.fn().mockReturnValue(document.createElement('canvas')),
    setBackgroundColor: jest.fn(),
    setZoom: jest.fn(),
    getZoom: jest.fn().mockReturnValue(1),
    on: jest.fn((eventName, handler) => {
      if (!eventHandlers[eventName]) {
        eventHandlers[eventName] = [];
      }
      eventHandlers[eventName].push(handler);
    }),
    off: jest.fn(),
    fire: jest.fn(),
    getWidth: jest.fn().mockReturnValue(800),
    getHeight: jest.fn().mockReturnValue(600),
    dispose: jest.fn(),
    isDrawingMode: false,
    freeDrawingBrush: {
      color: '#000',
      width: 1
    },
    viewportTransform: [1, 0, 0, 1, 0, 0],
    selection: true,
    
    // Add extra testing helpers
    getHandlers: (eventName: string) => eventHandlers[eventName] || [],
    triggerEvent: (eventName: string, eventData: any) => {
      const handlers = eventHandlers[eventName] || [];
      handlers.forEach(handler => handler(eventData));
    }
  };
  
  return canvas;
};
