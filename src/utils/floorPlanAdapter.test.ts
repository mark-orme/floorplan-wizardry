
/**
 * Tests for floor plan adapter module
 * @module utils/floorPlanAdapter.test
 */
import { describe, it, expect, vi } from 'vitest';
import { 
  appToCoreFloorPlan,
  coreToAppFloorPlan,
  validatePoint,
  validateColor,
  validateTimestamp,
  validateStrokeType,
  mapRoomType
} from './floorPlanAdapter';
import { FloorPlan as AppFloorPlan } from '@/types/floor-plan/floorPlanTypes';
import { FloorPlan as CoreFloorPlan } from '@/types/core/floor-plan/FloorPlan';

// This file now serves as an integration test for the floorPlanAdapter module
// Individual functionality is tested in more detail in the respective test files:
// - converters.test.ts
// - validators.test.ts
// - types.test.ts

describe('Floor Plan Adapter (Integration)', () => {
  it('should provide all required exports', () => {
    // Verify that the adapter properly re-exports all necessary functions
    expect(appToCoreFloorPlan).toBeDefined();
    expect(coreToAppFloorPlan).toBeDefined();
    expect(validatePoint).toBeDefined();
    expect(validateColor).toBeDefined();
    expect(validateTimestamp).toBeDefined();
    expect(validateStrokeType).toBeDefined();
    expect(mapRoomType).toBeDefined();
  });
  
  it('should round-trip convert floor plans', () => {
    // Create a test app floor plan
    const originalAppFloorPlan: AppFloorPlan = {
      id: 'test123',
      name: 'Test Floor',
      label: 'Test Floor',
      walls: [
        { 
          id: 'wall1', 
          start: { x: 0, y: 0 }, 
          end: { x: 100, y: 0 }, 
          thickness: 2,
          points: [{ x: 0, y: 0 }, { x: 100, y: 0 }],
          color: '#000000'
        }
      ],
      rooms: [],
      strokes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      gia: 0,
      level: 0,
      index: 0,
      canvasData: null,
      canvasJson: null,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paperSize: 'A4',
        level: 0
      }
    };
    
    // Convert to core and back
    const coreFloorPlan = appToCoreFloorPlan(originalAppFloorPlan);
    const roundTrippedAppFloorPlan = coreToAppFloorPlan(coreFloorPlan);
    
    // Verify the round-tripped floor plan matches the original
    expect(roundTrippedAppFloorPlan.id).toBe(originalAppFloorPlan.id);
    expect(roundTrippedAppFloorPlan.name).toBe(originalAppFloorPlan.name);
    expect(roundTrippedAppFloorPlan.walls).toHaveLength(1);
    expect(roundTrippedAppFloorPlan.walls[0].id).toBe('wall1');
  });
});
