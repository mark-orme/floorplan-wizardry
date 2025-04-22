
import { Room } from '@/types/floor-plan/unifiedTypes';
import { Point } from '@/types/core/Point';
import { asRoomType } from '@/utils/typeAdapters';

/**
 * Create a test room for testing.
 * @param overrides Partial room properties to override defaults
 * @returns Room object for testing
 */
export function createTestRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: overrides.id || `room-${Date.now()}`,
    name: overrides.name || 'Test Room',
    type: overrides.type || 'living',
    area: overrides.area || 100,
    perimeter: overrides.perimeter || 40,
    center: overrides.center || { x: 50, y: 50 },
    vertices: overrides.vertices || [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ],
    labelPosition: overrides.labelPosition || { x: 50, y: 50 },
    color: overrides.color || '#FFFFFF',
    floorPlanId: overrides.floorPlanId || 'test-floor-plan'
  };
}
