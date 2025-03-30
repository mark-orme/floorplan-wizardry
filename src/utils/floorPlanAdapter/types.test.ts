
/**
 * Tests for floor plan adapter type utilities
 * @module utils/floorPlanAdapter/types.test
 */
import { describe, it, expect } from 'vitest';
import { 
  validateStrokeType,
  mapRoomType,
  validateRoomType
} from './types';
import { StrokeTypeLiteral, RoomTypeLiteral } from '@/types/core/floor-plan';

describe('Floor Plan Type Utilities', () => {
  describe('validateStrokeType', () => {
    it('should validate valid stroke types', () => {
      // Test valid stroke types
      expect(validateStrokeType('solid')).toBe('solid');
      expect(validateStrokeType('dashed')).toBe('dashed');
      expect(validateStrokeType('dotted')).toBe('dotted');
    });
    
    it('should use default for invalid stroke types', () => {
      // Test with null
      expect(validateStrokeType(null)).toBe('solid');
      
      // Test with undefined
      expect(validateStrokeType(undefined)).toBe('solid');
      
      // Test with invalid string
      expect(validateStrokeType('invalid-type' as StrokeTypeLiteral)).toBe('solid');
      
      // Test with custom default
      expect(validateStrokeType(null, 'dashed')).toBe('dashed');
    });
  });
  
  describe('mapRoomType', () => {
    it('should map string to valid room type', () => {
      // Test valid mappings
      expect(mapRoomType('bedroom')).toBe('bedroom');
      expect(mapRoomType('bathroom')).toBe('bathroom');
      expect(mapRoomType('kitchen')).toBe('kitchen');
      expect(mapRoomType('living')).toBe('living');
    });
    
    it('should handle case-insensitive mapping', () => {
      expect(mapRoomType('BEDROOM')).toBe('bedroom');
      expect(mapRoomType('Bathroom')).toBe('bathroom');
      expect(mapRoomType('Kitchen')).toBe('kitchen');
    });
    
    it('should use default for unmapped types', () => {
      expect(mapRoomType('unknown-room-type')).toBe('other');
      expect(mapRoomType(null)).toBe('other');
      expect(mapRoomType(undefined)).toBe('other');
    });
  });
  
  describe('validateRoomType', () => {
    it('should validate valid room types', () => {
      // Test valid room types
      expect(validateRoomType('bedroom')).toBe('bedroom');
      expect(validateRoomType('bathroom')).toBe('bathroom');
      expect(validateRoomType('kitchen')).toBe('kitchen');
    });
    
    it('should use default for invalid room types', () => {
      // Test with invalid string
      expect(validateRoomType('invalid-type' as RoomTypeLiteral)).toBe('other');
      
      // Test with null
      expect(validateRoomType(null)).toBe('other');
      
      // Test with undefined
      expect(validateRoomType(undefined)).toBe('other');
    });
  });
});
