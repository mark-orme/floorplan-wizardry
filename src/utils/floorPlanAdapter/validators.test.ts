
/**
 * Tests for floor plan adapter validators
 * @module utils/floorPlanAdapter/validators.test
 */
import { describe, it, expect } from 'vitest';
import { 
  validatePoint,
  validateTimestamp,
  validateColor
} from './validators';

describe('Floor Plan Validators', () => {
  describe('validatePoint', () => {
    it('should validate and normalize valid points', () => {
      // Test valid point
      const validPoint = { x: 100, y: 200 };
      expect(validatePoint(validPoint)).toEqual(validPoint);
      
      // Test point with non-integer coordinates
      const nonIntPoint = { x: 100.5, y: 200.25 };
      expect(validatePoint(nonIntPoint)).toEqual(nonIntPoint);
    });
    
    it('should handle invalid points with default values', () => {
      // Test null point
      expect(validatePoint(null)).toEqual({ x: 0, y: 0 });
      
      // Test undefined point
      expect(validatePoint(undefined)).toEqual({ x: 0, y: 0 });
      
      // Test partial point
      expect(validatePoint({ x: 100 } as any)).toEqual({ x: 100, y: 0 });
      expect(validatePoint({ y: 200 } as any)).toEqual({ x: 0, y: 200 });
      
      // Test non-numeric values
      expect(validatePoint({ x: 'abc', y: 'def' } as any)).toEqual({ x: 0, y: 0 });
    });
  });
  
  describe('validateTimestamp', () => {
    it('should validate valid ISO timestamps', () => {
      const validTimestamp = new Date().toISOString();
      expect(validateTimestamp(validTimestamp)).toBe(validTimestamp);
    });
    
    it('should generate new timestamp for invalid input', () => {
      // Test with null
      const result1 = validateTimestamp(null);
      expect(result1).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/); // ISO format check
      
      // Test with invalid string
      const result2 = validateTimestamp('not-a-timestamp');
      expect(result2).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });
  
  describe('validateColor', () => {
    it('should validate valid color codes', () => {
      // Test hex colors
      expect(validateColor('#FF0000')).toBe('#FF0000');
      expect(validateColor('#00FF00')).toBe('#00FF00');
      expect(validateColor('#0000FF')).toBe('#0000FF');
      
      // Test short hex colors
      expect(validateColor('#F00')).toBe('#F00');
      expect(validateColor('#0F0')).toBe('#0F0');
      expect(validateColor('#00F')).toBe('#00F');
      
      // Test named colors
      expect(validateColor('red')).toBe('red');
      expect(validateColor('green')).toBe('green');
      expect(validateColor('blue')).toBe('blue');
    });
    
    it('should use default for invalid colors', () => {
      // Test with null
      expect(validateColor(null)).toBe('#000000');
      
      // Test with undefined
      expect(validateColor(undefined)).toBe('#000000');
      
      // Test with invalid string
      expect(validateColor('not-a-color')).toBe('not-a-color');
    });
  });
});
