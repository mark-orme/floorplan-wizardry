
import { Point } from '@/types/core/Point';
import { Room, Wall, Stroke, FloorPlan } from '@/types/floor-plan/unifiedTypes';
import { vi } from 'vitest';

/**
 * Create a mock point for testing
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Point object
 */
export function createMockPoint(x: number = 0, y: number = 0): Point {
  return { x, y };
}

/**
 * Create a mock stroke for testing
 * @param overrides Optional properties to override defaults
 * @returns Stroke object
 */
export function createMockStroke(overrides: Partial<Stroke> = {}): Stroke {
  return {
    id: overrides.id || `stroke-${Date.now()}`,
    type: overrides.type || 'line',
    points: overrides.points || [
      { x: 0, y: 0 },
      { x: 100, y: 100 }
    ],
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 1,
    floorPlanId: overrides.floorPlanId || 'mock-floor-plan'
  };
}

/**
 * Create a mock room for testing
 * @param overrides Optional properties to override defaults
 * @returns Room object
 */
export function createMockRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: overrides.id || `room-${Date.now()}`,
    name: overrides.name || 'Mock Room',
    type: overrides.type || 'other',
    area: overrides.area ?? 100,
    perimeter: overrides.perimeter ?? 40,
    center: overrides.center || { x: 50, y: 50 },
    vertices: overrides.vertices || [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ],
    labelPosition: overrides.labelPosition || { x: 50, y: 50 },
    color: overrides.color || '#FFFFFF',
    floorPlanId: overrides.floorPlanId || 'mock-floor-plan'
  };
}

/**
 * Create a mock wall for testing
 * @param overrides Optional properties to override defaults
 * @returns Wall object
 */
export function createMockWall(overrides: Partial<Wall> = {}): Wall {
  return {
    id: overrides.id || `wall-${Date.now()}`,
    start: overrides.start || { x: 0, y: 0 },
    end: overrides.end || { x: 100, y: 0 },
    thickness: overrides.thickness || 5,
    length: overrides.length ?? 100,
    angle: overrides.angle ?? 0,
    color: overrides.color || '#000000',
    height: overrides.height ?? 240,
    roomIds: overrides.roomIds || [],
    floorPlanId: overrides.floorPlanId || 'mock-floor-plan'
  };
}

/**
 * Create a mock floor plan for testing
 * @param overrides Optional properties to override defaults
 * @returns FloorPlan object
 */
export function createMockFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: overrides.id || `floor-${Date.now()}`,
    name: overrides.name || 'Mock Floor Plan',
    label: overrides.label || overrides.name || 'Mock Floor Plan',
    walls: overrides.walls || [],
    rooms: overrides.rooms || [],
    strokes: overrides.strokes || [],
    canvasData: overrides.canvasData || null,
    canvasJson: overrides.canvasJson || null,
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
    gia: overrides.gia ?? 0,
    level: overrides.level ?? 0,
    index: overrides.index ?? 0,
    metadata: {
      createdAt: overrides.metadata?.createdAt || now,
      updatedAt: overrides.metadata?.updatedAt || now,
      version: overrides.metadata?.version || '1.0',
      paperSize: overrides.metadata?.paperSize || 'A4',
      level: overrides.metadata?.level ?? 0,
      author: overrides.metadata?.author || 'Mock User',
      dateCreated: overrides.metadata?.dateCreated || now,
      lastModified: overrides.metadata?.lastModified || now,
      notes: overrides.metadata?.notes || ''
    },
    data: overrides.data || {},
    userId: overrides.userId || 'mock-user'
  };
}

/**
 * Create mock function parameters for testing
 * @returns Object with mock callback and event
 */
export function createMockFunctionParams() {
  return {
    mockCallback: vi.fn(),
    mockEvent: { preventDefault: vi.fn() }
  };
}

/**
 * Create a mock point for testing
 * @returns Point object
 */
export function createTestPoint(): Point {
  return { x: 0, y: 0 };
}
