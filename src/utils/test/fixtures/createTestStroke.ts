
import { Stroke } from '@/types/floor-plan/unifiedTypes';
import { Point } from '@/types/core/Point';
import { asStrokeType } from '@/utils/typeAdapters';

/**
 * Create a test stroke for testing.
 * @param overrides Partial stroke properties to override defaults
 * @returns Stroke object for testing
 */
export function createTestStroke(overrides: Partial<Stroke> = {}): Stroke {
  return {
    id: overrides.id || `stroke-${Date.now()}`,
    type: overrides.type || 'line',
    points: overrides.points || [
      { x: 0, y: 0 },
      { x: 100, y: 100 }
    ],
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 1,
    floorPlanId: overrides.floorPlanId || 'test-floor-plan'
  };
}
