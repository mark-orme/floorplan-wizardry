
/**
 * Unified floor plan types
 * @module types/floor-plan/unifiedTypes
 * 
 * @deprecated Import from @/types/core instead
 */

export * from '../core';

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
