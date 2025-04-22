
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
  area: 0, color: '#ffffff'
});
export const createTestStroke = createEmptyStroke;
export const createTestWall = createEmptyWall;
export const createTestRoom = createEmptyRoom;
export const createTestPoint = (x = 0, y = 0) => ({ x, y });
export const createTestFloorPlan = () => ({
  id: 'test-floorplan',
  name: 'Test FloorPlan',
  label: 'Test FloorPlan',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  gia: 0,
  walls: [],
  rooms: [],
  strokes: [],
  index: 0,
  level: 0,
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paperSize: PaperSize.A4,
    level: 0,
    version: '1.0',
    author: 'User',
    notes: '',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },
  data: {},
  userId: '',
  propertyId: ''
});
export const createEmptyFloorPlan = createTestFloorPlan;
