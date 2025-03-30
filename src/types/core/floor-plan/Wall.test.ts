
/**
 * Tests for core floor plan Wall module
 * @module types/core/floor-plan/Wall.test
 */
import { describe, it, expect } from 'vitest';
import { Wall, createWall } from './Wall';

describe('Wall', () => {
  it('should create a wall with default values', () => {
    const wall = createWall({
      start: { x: 0, y: 0 },
      end: { x: 100, y: 0 }
    });
    
    // Verify wall properties
    expect(wall.id).toBeDefined();
    expect(wall.start).toEqual({ x: 0, y: 0 });
    expect(wall.end).toEqual({ x: 100, y: 0 });
    expect(wall.thickness).toBeDefined();
    expect(wall.color).toBeDefined();
  });
  
  it('should respect provided values', () => {
    const wall = createWall({
      id: 'customWallId',
      start: { x: 10, y: 20 },
      end: { x: 30, y: 40 },
      thickness: 5,
      color: '#FF0000'
    });
    
    // Verify custom properties
    expect(wall.id).toBe('customWallId');
    expect(wall.start).toEqual({ x: 10, y: 20 });
    expect(wall.end).toEqual({ x: 30, y: 40 });
    expect(wall.thickness).toBe(5);
    expect(wall.color).toBe('#FF0000');
  });
  
  it('should calculate distance between endpoints', () => {
    // Horizontal wall
    const wall1 = createWall({
      start: { x: 0, y: 0 },
      end: { x: 100, y: 0 }
    });
    expect(wall1.length).toBe(100);
    
    // Vertical wall
    const wall2 = createWall({
      start: { x: 0, y: 0 },
      end: { x: 0, y: 50 }
    });
    expect(wall2.length).toBe(50);
    
    // Diagonal wall (3-4-5 triangle)
    const wall3 = createWall({
      start: { x: 0, y: 0 },
      end: { x: 3, y: 4 }
    });
    expect(wall3.length).toBe(5);
  });
});
