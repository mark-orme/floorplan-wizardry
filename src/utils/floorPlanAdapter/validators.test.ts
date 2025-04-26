
/**
 * Floor Plan Validator Tests
 * Tests for floor plan validation functions
 * @module utils/floorPlanAdapter/validators.test
 */
import { describe, test, expect } from 'vitest';
import { 
  validatePoint, 
  validateWall, 
  validateRoom, 
  validateFloorPlan,
  isValidFloorPlan,
  ValidationError 
} from './validators';
import { Point, Wall, Room, FloorPlan } from './index';

describe('Floor Plan Validators', () => {
  describe('validatePoint', () => {
    test('valid point passes validation', () => {
      const point: Point = { x: 10, y: 20 };
      expect(() => validatePoint(point)).not.toThrow();
    });
    
    test('throws on missing point', () => {
      const invalidPoint = undefined;
      expect(() => validatePoint(invalidPoint as unknown as Point)).toThrow(ValidationError);
    });
    
    test('throws on invalid x coordinate', () => {
      const invalidPoint = { x: 'not a number' as unknown as number, y: 20 };
      expect(() => validatePoint(invalidPoint)).toThrow(ValidationError);
    });
    
    test('throws on invalid y coordinate', () => {
      const invalidPoint = { x: 10, y: 'not a number' as unknown as number };
      expect(() => validatePoint(invalidPoint)).toThrow(ValidationError);
    });
    
    test('throws on NaN values', () => {
      expect(() => validatePoint({ x: NaN, y: 20 })).toThrow(ValidationError);
      expect(() => validatePoint({ x: 10, y: NaN })).toThrow(ValidationError);
    });
  });
  
  describe('validateWall', () => {
    test('valid wall passes validation', () => {
      const wall: Wall = {
        id: 'wall-1',
        start: { x: 0, y: 0 },
        end: { x: 100, y: 0 },
        thickness: 10
      };
      expect(() => validateWall(wall)).not.toThrow();
    });
    
    test('throws on missing wall', () => {
      const invalidWall = undefined;
      expect(() => validateWall(invalidWall as unknown as Wall)).toThrow(ValidationError);
    });
    
    test('throws on missing id', () => {
      const wall: Partial<Wall> = {
        start: { x: 0, y: 0 },
        end: { x: 100, y: 0 },
        thickness: 10
      };
      expect(() => validateWall(wall as Wall)).toThrow(ValidationError);
    });
    
    test('throws on invalid thickness', () => {
      const wall: Wall = {
        id: 'wall-1',
        start: { x: 0, y: 0 },
        end: { x: 100, y: 0 },
        thickness: -10
      };
      expect(() => validateWall(wall)).toThrow(ValidationError);
    });
    
    test('throws on invalid height', () => {
      const wall: Wall = {
        id: 'wall-1',
        start: { x: 0, y: 0 },
        end: { x: 100, y: 0 },
        thickness: 10,
        height: -10
      };
      expect(() => validateWall(wall)).toThrow(ValidationError);
    });
  });
  
  // Additional tests can be added here
});
