
import { createEmptyFloorPlan, Stroke, Room, Wall, StrokeTypeLiteral, RoomTypeLiteral } from '@/types/floorPlan';

/**
 * Creates a mock floor plan for testing
 */
export const createMockFloorPlan = (partialFloorPlan = {}) => {
  return createEmptyFloorPlan(partialFloorPlan);
};

/**
 * Creates a mock stroke for testing
 */
export const createMockStroke = (): Stroke => {
  return {
    id: '1',
    points: [{ x: 10, y: 10 }, { x: 50, y: 50 }],
    type: 'line',
    color: '#000000',
    thickness: 2,
    width: 2
  };
};

/**
 * Creates a mock room for testing
 */
export const createMockRoom = (): Room => {
  return {
    id: '1',
    name: 'Bedroom',
    type: 'bedroom' as RoomTypeLiteral,
    vertices: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ],
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ],
    area: 10000,
    perimeter: 400,
    center: { x: 50, y: 50 },
    labelPosition: { x: 50, y: 50 },
    color: '#FFFFFF'
  };
};

/**
 * Creates a mock wall for testing
 */
export const createMockWall = (): Wall => {
  return {
    id: '1',
    start: { x: 0, y: 0 },
    end: { x: 100, y: 0 },
    thickness: 10,
    length: 100,
    color: '#000000',
    roomIds: []
  };
};

