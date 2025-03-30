
/**
 * Tests for core floor plan module
 * @module types/core/FloorPlan.test
 */
import { describe, it, expect } from 'vitest';
import { 
  CoreFloorPlan,
  createFloorPlan,
  createRoom,
  createWall,
  StrokeTypeLiteral,
  RoomTypeLiteral
} from './FloorPlan';

describe('Core Floor Plan Types', () => {
  it('should properly re-export all necessary types and factories', () => {
    // Verify that the module properly re-exports all necessary functions and types
    expect(createFloorPlan).toBeDefined();
    expect(createRoom).toBeDefined();
    expect(createWall).toBeDefined();
  });
  
  it('should create a floor plan with factory function', () => {
    const floorPlan = createFloorPlan({
      name: 'Test Floor'
    });
    
    // Verify floor plan properties
    expect(floorPlan.id).toBeDefined();
    expect(floorPlan.name).toBe('Test Floor');
    expect(floorPlan.walls).toEqual([]);
    expect(floorPlan.rooms).toEqual([]);
    expect(floorPlan.metadata).toBeDefined();
    expect(floorPlan.metadata.version).toBeDefined();
  });
  
  it('should create a wall with factory function', () => {
    const wall = createWall({
      start: { x: 0, y: 0 },
      end: { x: 100, y: 0 }
    });
    
    // Verify wall properties
    expect(wall.id).toBeDefined();
    expect(wall.start).toEqual({ x: 0, y: 0 });
    expect(wall.end).toEqual({ x: 100, y: 0 });
    expect(wall.thickness).toBeDefined();
  });
  
  it('should create a room with factory function', () => {
    const room = createRoom({
      points: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 }
      ],
      type: 'bedroom' as RoomTypeLiteral
    });
    
    // Verify room properties
    expect(room.id).toBeDefined();
    expect(room.points).toHaveLength(4);
    expect(room.type).toBe('bedroom');
    expect(room.name).toBeDefined();
  });
});
