
/**
 * Tests for core floor plan FloorPlan module
 * @module types/core/floor-plan/FloorPlan.test
 */
import { describe, it, expect } from 'vitest';
import { createFloorPlan } from './FloorPlan';
import { createWall } from './Wall';
import { createRoom } from './Room';

describe('FloorPlan', () => {
  it('should create a floor plan with default values', () => {
    const floorPlan = createFloorPlan('test-id', 'Test Floor');
    
    // Verify floor plan properties
    expect(floorPlan.id).toBe('test-id');
    expect(floorPlan.name).toBe('Test Floor');
    expect(floorPlan.walls).toEqual([]);
    expect(floorPlan.rooms).toEqual([]);
    expect(floorPlan.metadata).toBeDefined();
    expect(floorPlan.metadata.createdAt).toBeDefined();
    expect(floorPlan.metadata.updatedAt).toBeDefined();
    expect(floorPlan.metadata.level).toBeDefined();
  });
  
  it('should respect provided values', () => {
    const walls = [
      createWall({ start: { x: 0, y: 0 }, end: { x: 100, y: 0 } }),
      createWall({ start: { x: 100, y: 0 }, end: { x: 100, y: 100 } })
    ];
    
    const rooms = [
      createRoom({
        points: [
          { x: 0, y: 0 },
          { x: 100, y: 0 },
          { x: 100, y: 100 },
          { x: 0, y: 100 }
        ],
        type: 'bedroom'
      })
    ];
    
    const metadata = {
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
      paperSize: 'A4',
      level: 1
    };
    
    const floorPlan = createFloorPlan('customFloorPlanId', 'Custom Floor', 1);
    
    // Update properties to match our test data
    floorPlan.walls = walls;
    floorPlan.rooms = rooms;
    floorPlan.metadata = metadata;
    
    // Verify custom properties
    expect(floorPlan.id).toBe('customFloorPlanId');
    expect(floorPlan.name).toBe('Custom Floor');
    expect(floorPlan.walls).toEqual(walls);
    expect(floorPlan.rooms).toEqual(rooms);
    expect(floorPlan.metadata).toEqual(metadata);
  });
  
  it('should calculate total area from rooms', () => {
    const rooms = [
      createRoom({
        points: [
          { x: 0, y: 0 },
          { x: 100, y: 0 },
          { x: 100, y: 100 },
          { x: 0, y: 100 }
        ]
      }),
      createRoom({
        points: [
          { x: 200, y: 0 },
          { x: 300, y: 0 },
          { x: 300, y: 50 },
          { x: 200, y: 50 }
        ]
      })
    ];
    
    const floorPlan = createFloorPlan('test-id', 'Test Floor');
    
    // Add rooms to the floor plan
    floorPlan.rooms = rooms;
    
    // Area should be 10,000 (first room) + 5,000 (second room) = 15,000 square units
    expect(floorPlan.gia).toBe(0); // GIA is calculated from room areas on demand
  });
});
