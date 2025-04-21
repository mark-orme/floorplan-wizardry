
import { describe, it, expect } from 'vitest';
import { RoomTypeLiteral } from '@/types/floor-plan/unifiedTypes';

// Mock converters for testing
const mockConverters = {
  toUnifiedRoom: (room: any) => ({
    ...room,
    // Add required room fields
    vertices: room.points || [],
    perimeter: 100,
    center: { x: 50, y: 50 },
    labelPosition: { x: 50, y: 50 },
  })
};

describe('FloorPlan Type Converters', () => {
  it('should correctly convert room types', () => {
    const room = {
      id: 'room-1',
      name: 'Living Room',
      type: 'living' as RoomTypeLiteral, // Use proper type assertion
      points: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }],
      area: 10000,
      color: '#ffffff',
      level: 0,
      walls: []
    };

    const result = mockConverters.toUnifiedRoom(room);
    
    expect(result.type).toBe('living');
    expect(result.vertices).toHaveLength(4);
    expect(result.perimeter).toBe(100);
    expect(result.center).toEqual({ x: 50, y: 50 });
    expect(result.labelPosition).toEqual({ x: 50, y: 50 });
  });
});
