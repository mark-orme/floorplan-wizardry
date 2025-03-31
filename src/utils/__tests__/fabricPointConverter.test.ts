
/**
 * Tests for fabric point converter utility
 * Ensures correct conversion between app and fabric point types
 * @module utils/__tests__/fabricPointConverter
 */
import { describe, it, expect, vi } from 'vitest';
import { Point as FabricPoint } from 'fabric';
import { 
  toFabricPoint, 
  toAppPoint, 
  getPointFromEvent,
  isAppPoint
} from '../fabricPointConverter';
import type { Point } from '@/types/core/Point';

describe('Fabric Point Converter', () => {
  // Test app to Fabric point conversion
  it('should convert app Point to Fabric Point', () => {
    const appPoint: Point = { x: 10, y: 20 };
    const fabricPoint = toFabricPoint(appPoint);
    
    // Check type and values
    expect(fabricPoint).toBeInstanceOf(FabricPoint);
    expect(fabricPoint.x).toBe(10);
    expect(fabricPoint.y).toBe(20);
  });
  
  // Test Fabric to app point conversion
  it('should convert Fabric Point to app Point', () => {
    const fabricPoint = new FabricPoint(30, 40);
    const appPoint = toAppPoint(fabricPoint);
    
    // Check properties
    expect(appPoint).toEqual({ x: 30, y: 40 });
    expect(appPoint.x).toBe(30);
    expect(appPoint.y).toBe(40);
  });
  
  // Test round-trip conversion
  it('should convert point correctly in a round trip', () => {
    const original: Point = { x: 15, y: 25 };
    const fabricPoint = toFabricPoint(original);
    const roundTrip = toAppPoint(fabricPoint);
    
    // Values should be preserved
    expect(roundTrip).toEqual(original);
  });
  
  // Test point extraction from events
  it('should extract points from various event types', () => {
    // Test mouse event
    const mouseEvent = { clientX: 10, clientY: 20 };
    expect(getPointFromEvent(mouseEvent)).toEqual({ x: 10, y: 20 });
    
    // Test fabric event
    const fabricEvent = { e: { clientX: 30, clientY: 40 } };
    expect(getPointFromEvent(fabricEvent)).toEqual({ x: 30, y: 40 });
    
    // Test direct coordinate object
    const coordinateObj = { x: 50, y: 60 };
    expect(getPointFromEvent(coordinateObj)).toEqual({ x: 50, y: 60 });
  });
  
  // Test null/undefined handling
  it('should throw error for null or undefined inputs', () => {
    // Test app to fabric conversion with null
    expect(() => toFabricPoint(null as any)).toThrow();
    
    // Test fabric to app conversion with null
    expect(() => toAppPoint(null as any)).toThrow();
    
    // Test event extraction with null
    expect(() => getPointFromEvent(null as any)).toThrow();
  });
  
  // Test type guard
  it('should correctly identify app Point objects', () => {
    // Valid points
    expect(isAppPoint({ x: 10, y: 20 })).toBe(true);
    
    // Invalid inputs
    expect(isAppPoint(null)).toBe(false);
    expect(isAppPoint(undefined)).toBe(false);
    expect(isAppPoint({})).toBe(false);
    expect(isAppPoint({ x: '10', y: 20 })).toBe(false);
    expect(isAppPoint({ x: 10 })).toBe(false);
  });
});
