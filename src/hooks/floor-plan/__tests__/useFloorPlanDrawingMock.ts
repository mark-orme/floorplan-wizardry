
import { vi } from 'vitest';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Point';
import { Room, Wall, Stroke, FloorPlan } from '@/types/floor-plan/unifiedTypes';

/**
 * Create a mock useFloorPlanDrawing hook result
 */
export function createMockUseFloorPlanDrawingResult() {
  return {
    isDrawing: false,
    tool: DrawingMode.SELECT,
    setTool: vi.fn(),
    startDrawing: vi.fn(),
    continueDrawing: vi.fn(),
    endDrawing: vi.fn(),
    cancelDrawing: vi.fn(),
    drawFloorPlan: vi.fn(),
    addRoom: vi.fn(),
    addWall: vi.fn(),
    addStroke: vi.fn(),
    deleteObject: vi.fn(),
    clearCanvas: vi.fn(),
    selectedObjects: [],
    setSelectedObjects: vi.fn(),
    canUndo: false,
    canRedo: false,
    undo: vi.fn(),
    redo: vi.fn(),
    setFloorPlan: vi.fn(),
    updateFloorPlan: vi.fn(),
    calculateRoomArea: vi.fn()
  };
}

/**
 * Create a mock wall object for testing
 */
export function createMockWall(partial: Partial<Wall> = {}): Wall {
  return {
    id: 'wall-test-1',
    start: { x: 0, y: 0 },
    end: { x: 100, y: 0 },
    thickness: 5,
    length: 100,
    angle: 0,
    roomIds: [],
    floorPlanId: 'floor-test-1',
    color: '#000000',
    ...partial
  };
}

/**
 * Create a mock room object for testing
 */
export function createMockRoom(partial: Partial<Room> = {}): Room {
  return {
    id: 'room-test-1',
    name: 'Test Room',
    type: 'living',
    area: 100,
    perimeter: 40,
    center: { x: 50, y: 50 },
    vertices: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ],
    labelPosition: { x: 50, y: 50 },
    floorPlanId: 'floor-test-1',
    color: '#ffffff',
    ...partial
  };
}

/**
 * Create a mock stroke object for testing
 */
export function createMockStroke(partial: Partial<Stroke> = {}): Stroke {
  return {
    id: 'stroke-test-1',
    type: 'line',
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 100 }
    ],
    color: '#000000',
    thickness: 1,
    floorPlanId: 'floor-test-1',
    ...partial
  };
}

/**
 * Create a mock floor plan object for testing
 */
export function createMockFloorPlan(partial: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: 'floor-test-1',
    name: 'Test Floor Plan',
    label: 'Test Floor',
    walls: [],
    rooms: [],
    strokes: [],
    canvasData: null,
    canvasJson: null,
    createdAt: now,
    updatedAt: now,
    gia: 0,
    level: 0,
    index: 0,
    metadata: {
      createdAt: now,
      updatedAt: now,
      version: '1.0',
      paperSize: 'A4',
      level: 0,
      author: 'Test User',
      dateCreated: now,
      lastModified: now,
      notes: ''
    },
    data: {},
    userId: 'user-test-1',
    ...partial
  };
}

/**
 * Create a mock point object for testing
 */
export function createMockPoint(x: number = 0, y: number = 0): Point {
  return { x, y };
}
