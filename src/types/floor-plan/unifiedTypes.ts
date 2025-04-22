
/**
 * Unified floor plan types
 * @module types/floor-plan/unifiedTypes
 * 
 * @deprecated Import from @/types/core instead
 */

export * from '../core';

// Add PaperSize enum which was missing
export enum PaperSize {
  A0 = 'A0',
  A1 = 'A1',
  A2 = 'A2',
  A3 = 'A3',
  A4 = 'A4',
  A5 = 'A5',
  LETTER = 'LETTER',
  LEGAL = 'LEGAL',
  TABLOID = 'TABLOID',
  CUSTOM = 'CUSTOM'
}

// Add helper functions for backward compatibility
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

// Add string to enum helper functions
export function asStrokeType(type: string) {
  return type as any;
}

export function asRoomType(type: string) {
  return type as any;
}
