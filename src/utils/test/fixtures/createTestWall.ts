
import { Point } from '@/types/core/Point';
import { Wall } from '@/types/floor-plan/unifiedTypes';
import { asRoomType, asStrokeType } from '@/utils/typeAdapters';

/**
 * Create a test wall for testing.
 * @param overrides Partial wall properties to override defaults
 * @returns Wall object for testing
 */
export function createTestWall(overrides: Partial<Wall> = {}): Wall {
  return {
    id: overrides.id || `wall-${Date.now()}`,
    start: overrides.start || { x: 0, y: 0 },
    end: overrides.end || { x: 100, y: 0 },
    thickness: overrides.thickness || 5,
    roomIds: overrides.roomIds || [],
    length: overrides.length || 100,
    angle: overrides.angle || 0,  // Required property
    color: overrides.color || '#000000',
    height: overrides.height || 240,
    floorPlanId: overrides.floorPlanId || 'test-floor-plan'
  };
}
