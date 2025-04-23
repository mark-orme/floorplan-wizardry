
/**
 * Unified floor plan types
 * @module types/floor-plan/unifiedTypes
 * 
 * @deprecated Import from @/types/core instead
 */

export * from '../core';

// Add PaperSize enum which was missing
export { PaperSize } from './PaperSize';
export type { PaperSizeLiteral } from './PaperSize';

// Add FloorPlanMetadata type explicitly
export interface FloorPlanMetadata {
  createdAt: string;
  updatedAt: string;
  paperSize: string;
  level: number;
  version: string;
  author: string;
  dateCreated: string;
  lastModified: string;
  notes: string;
}

// Add helper functions for backward compatibility
export const createEmptyFloorPlan = () => ({
  id: '', 
  name: 'New Floor Plan',
  width: 1000,
  height: 800,
  level: 1,
  updatedAt: new Date().toISOString(),
  walls: [],
  rooms: [],
  strokes: []
});

export const createEmptyStroke = () => ({
  id: '', points: [], color: '#000000', width: 1, thickness: 1, type: 'line'
});

export const createEmptyWall = () => ({
  id: '', start: { x: 0, y: 0 }, end: { x: 100, y: 0 }, 
  thickness: 10, length: 100, color: '#000000', roomIds: []
});

export const createEmptyRoom = () => ({
  id: '', name: 'Room', type: 'other', points: [], vertices: [], 
  area: 0, perimeter: 0, center: { x: 0, y: 0 }, labelPosition: { x: 0, y: 0 }, 
  color: '#ffffff'
});

// Add test helpers
export const createTestFloorPlan = createEmptyFloorPlan;
export const createTestStroke = createEmptyStroke;
export const createTestWall = createEmptyWall;
export const createTestRoom = createEmptyRoom;
export const createTestPoint = (x = 0, y = 0) => ({ x, y });

// Add wall length calculation function
export const calculateWallLength = (start: {x: number, y: number}, end: {x: number, y: number}) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Add string to enum helper functions
export function asStrokeType(type: string) {
  return type as any;
}

export function asRoomType(type: string) {
  return type as any;
}
