
import { RoomTypeLiteral, Room } from '@/types/floor-plan/unifiedTypes';
import { asRoomType } from '@/utils/typeAdapters';
import { createTestPoint } from './createTestPoint';

/**
 * Create a test room
 * @param partialRoom Partial room data
 * @returns Test room
 */
export function createTestRoom(partialRoom: Partial<Room> = {}): Room {
  const type = partialRoom.type || asRoomType('other');
  const vertices = partialRoom.vertices || [
    createTestPoint(0, 0),
    createTestPoint(100, 0),
    createTestPoint(100, 100),
    createTestPoint(0, 100)
  ];

  const center = {
    x: vertices.reduce((sum, v) => sum + v.x, 0) / vertices.length,
    y: vertices.reduce((sum, v) => sum + v.y, 0) / vertices.length
  };

  // Calculate perimeter
  let perimeter = 0;
  for (let i = 0; i < vertices.length; i++) {
    const p1 = vertices[i];
    const p2 = vertices[(i + 1) % vertices.length];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }

  return {
    id: partialRoom.id || 'room-test',
    name: partialRoom.name || 'Test Room',
    type,
    vertices,
    area: partialRoom.area || 10000,
    perimeter: partialRoom.perimeter || perimeter,
    labelPosition: partialRoom.labelPosition || center,
    center: partialRoom.center || center,
    color: partialRoom.color || '#f5f5f5'
  };
}
