
/**
 * Tests for core floor plan module
 * @module types/core/FloorPlan.test
 */
import { describe, it, expect } from 'vitest';
import { 
  FloorPlan,
  createFloorPlan,
} from './floor-plan/FloorPlan';
import { createRoom } from './floor-plan/Room';
import { createWall } from './floor-plan/Wall';
import { StrokeType } from './floor-plan/Stroke';
import { RoomType } from './floor-plan/Room';

describe('Core Floor Plan Types', () => {
  it('should properly re-export all necessary types and factories', () => {
    // Verify that the module properly re-exports all necessary functions and types
    expect(createFloorPlan).toBeDefined();
    expect(createRoom).toBeDefined();
    expect(createWall).toBeDefined();
  });
  
  it('should create a floor plan with factory function', () => {
    const floorPlan = createFloorPlan('test-id', 'Test Floor');
    
    // Verify floor plan properties
    expect(floorPlan.id).toBe('test-id');
    expect(floorPlan.name).toBe('Test Floor');
    expect(floorPlan.walls).toEqual([]);
    expect(floorPlan.rooms).toEqual([]);
    expect(floorPlan.metadata).toBeDefined();
    expect(floorPlan.metadata.createdAt).toBeDefined();
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
      type: 'bedroom' as RoomType
    });
    
    // Verify room properties
    expect(room.id).toBeDefined();
    expect(room.points).toHaveLength(4);
    expect(room.type).toBe('bedroom');
    expect(room.name).toBeDefined();
  });
});
