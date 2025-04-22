
/**
 * Tests for floor plan adapter module
 * @module utils/floorPlanAdapter.test
 */
import { describe, it, expect, vi } from 'vitest';
import { 
  convertToCoreFloorPlans,
  convertToUnifiedFloorPlans,
  validatePoint,
  validateColor,
  validateTimestamp,
  validateStrokeType,
  mapRoomType
} from './floorPlanAdapter';
import { FloorPlan as AppFloorPlan } from '@/types/floor-plan/typesBarrel';
import { FloorPlan as CoreFloorPlan } from '@/types/FloorPlan';
import { createTestFloorPlan, createTestWall } from './test/typedTestFixtures';
import { adaptWall } from './typeAdapters';

// This file now serves as an integration test for the floorPlanAdapter module
// Individual functionality is tested in more detail in the respective test files:
// - converters.test.ts
// - validators.test.ts
// - types.test.ts

describe('Floor Plan Adapter (Integration)', () => {
  it('should provide all required exports', () => {
    // Verify that the adapter properly re-exports all necessary functions
    expect(convertToCoreFloorPlans).toBeDefined();
    expect(convertToUnifiedFloorPlans).toBeDefined();
    expect(validatePoint).toBeDefined();
    expect(validateColor).toBeDefined();
    expect(validateTimestamp).toBeDefined();
    expect(validateStrokeType).toBeDefined();
    expect(mapRoomType).toBeDefined();
  });
  
  it('should round-trip convert floor plans', () => {
    // Create a test app floor plan
    const originalFloorPlan = createTestFloorPlan({
      id: 'test123',
      name: 'Test Floor',
      label: 'Test Floor',
      walls: [
        adaptWall({ 
          id: 'wall1', 
          start: { x: 0, y: 0 }, 
          end: { x: 100, y: 0 }, 
          thickness: 2,
          color: '#000000',
          roomIds: []  // Add the required roomIds property
        })
      ],
      rooms: [],
      strokes: []
    });
    
    // Convert to core and back
    const coreFloorPlans = convertToCoreFloorPlans([originalFloorPlan]);
    const roundTrippedFloorPlans = convertToUnifiedFloorPlans(coreFloorPlans);
    
    // Verify the round-tripped floor plan matches the original
    expect(roundTrippedFloorPlans[0].id).toBe(originalFloorPlan.id);
    expect(roundTrippedFloorPlans[0].name).toBe(originalFloorPlan.name);
    expect(roundTrippedFloorPlans[0].walls).toHaveLength(1);
    expect(roundTrippedFloorPlans[0].walls[0].id).toBe('wall1');
  });
});
