
import { Wall } from '@/types/floor-plan/unifiedTypes';
import { createTestPoint } from './createTestPoint';

/**
 * Create a test wall
 * @param partialWall Partial wall data
 * @returns Test wall
 */
export function createTestWall(partialWall: Partial<Wall> = {}): Wall {
  const start = partialWall.start || createTestPoint(0, 0);
  const end = partialWall.end || createTestPoint(100, 0);

  return {
    id: partialWall.id || 'wall-test',
    start,
    end,
    thickness: partialWall.thickness || 5,
    color: partialWall.color || '#333333',
    roomIds: partialWall.roomIds || [],
    length: partialWall.length || Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    ),
    height: partialWall.height
  };
}
