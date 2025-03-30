
/**
 * Tests for core floor plan Room module
 * @module types/core/floor-plan/Room.test
 */
import { describe, it, expect } from 'vitest';
import { createRoom } from './Room';
import { RoomTypeLiteral } from './types';

describe('Room', () => {
  it('should create a room with default values', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ];
    
    const room = createRoom({ points });
    
    // Verify room properties
    expect(room.id).toBeDefined();
    expect(room.points).toEqual(points);
    expect(room.type).toBeDefined();
    expect(room.name).toBeDefined();
    expect(room.color).toBeDefined();
  });
  
  it('should respect provided values', () => {
    const points = [
      { x: 10, y: 10 },
      { x: 50, y: 10 },
      { x: 50, y: 50 },
      { x: 10, y: 50 }
    ];
    
    const room = createRoom({
      id: 'customRoomId',
      points,
      type: 'bedroom' as RoomTypeLiteral,
      name: 'Master Bedroom',
      color: '#CCFFCC'
    });
    
    // Verify custom properties
    expect(room.id).toBe('customRoomId');
    expect(room.points).toEqual(points);
    expect(room.type).toBe('bedroom');
    expect(room.name).toBe('Master Bedroom');
    expect(room.color).toBe('#CCFFCC');
  });
  
  it('should calculate area for rectangular rooms', () => {
    // 100x100 square room
    const squareRoom = createRoom({
      points: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 }
      ]
    });
    
    // Area should be 100 * 100 = 10,000 square units
    expect(squareRoom.area).toBe(10000);
    
    // 50x20 rectangular room
    const rectangularRoom = createRoom({
      points: [
        { x: 0, y: 0 },
        { x: 50, y: 0 },
        { x: 50, y: 20 },
        { x: 0, y: 20 }
      ]
    });
    
    // Area should be 50 * 20 = 1,000 square units
    expect(rectangularRoom.area).toBe(1000);
  });
});
