
/**
 * Tests for fabricPointConverter utility functions
 * @jest
 */
import { 
  toFabricPoint, 
  toAppPoint, 
  safeToFabricPoint, 
  pointsArrayToFabric, 
  fabricPointsToAppPoints,
  createFabricPoint,
  fromFabricPoint,
  getPointFromEvent,
  isAppPoint
} from '../fabricPointConverter';
import { Point as FabricPoint } from 'fabric';
import type { Point } from '@/types/core/Point';

describe('fabricPointConverter', () => {
  describe('toFabricPoint', () => {
    it('should convert app point to fabric point', () => {
      const appPoint: Point = { x: 10, y: 20 };
      const fabricPoint = toFabricPoint(appPoint);
      
      expect(fabricPoint).toBeInstanceOf(FabricPoint);
      expect(fabricPoint.x).toBe(10);
      expect(fabricPoint.y).toBe(20);
    });
    
    it('should handle alias createFabricPoint', () => {
      const appPoint: Point = { x: 10, y: 20 };
      const fabricPoint = createFabricPoint(appPoint);
      
      expect(fabricPoint).toBeInstanceOf(FabricPoint);
      expect(fabricPoint.x).toBe(10);
      expect(fabricPoint.y).toBe(20);
    });
  });
  
  describe('toAppPoint', () => {
    it('should convert fabric point to app point', () => {
      const fabricPoint = new FabricPoint(30, 40);
      const appPoint = toAppPoint(fabricPoint);
      
      expect(appPoint).toEqual({ x: 30, y: 40 });
    });
    
    it('should handle alias fromFabricPoint', () => {
      const fabricPoint = new FabricPoint(30, 40);
      const appPoint = fromFabricPoint(fabricPoint);
      
      expect(appPoint).toEqual({ x: 30, y: 40 });
    });
  });
  
  describe('safeToFabricPoint', () => {
    it('should handle null point', () => {
      const fabricPoint = safeToFabricPoint(null);
      
      expect(fabricPoint).toBeInstanceOf(FabricPoint);
      expect(fabricPoint.x).toBe(0);
      expect(fabricPoint.y).toBe(0);
    });
    
    it('should handle undefined point', () => {
      const fabricPoint = safeToFabricPoint(undefined);
      
      expect(fabricPoint).toBeInstanceOf(FabricPoint);
      expect(fabricPoint.x).toBe(0);
      expect(fabricPoint.y).toBe(0);
    });
    
    it('should use default point when provided', () => {
      const fabricPoint = safeToFabricPoint(null, { x: 50, y: 60 });
      
      expect(fabricPoint).toBeInstanceOf(FabricPoint);
      expect(fabricPoint.x).toBe(50);
      expect(fabricPoint.y).toBe(60);
    });
    
    it('should convert valid point', () => {
      const appPoint: Point = { x: 70, y: 80 };
      const fabricPoint = safeToFabricPoint(appPoint);
      
      expect(fabricPoint).toBeInstanceOf(FabricPoint);
      expect(fabricPoint.x).toBe(70);
      expect(fabricPoint.y).toBe(80);
    });
  });
  
  describe('pointsArrayToFabric', () => {
    it('should convert array of app points to fabric points', () => {
      const appPoints: Point[] = [
        { x: 10, y: 20 },
        { x: 30, y: 40 }
      ];
      
      const fabricPoints = pointsArrayToFabric(appPoints);
      
      expect(fabricPoints).toHaveLength(2);
      expect(fabricPoints[0]).toBeInstanceOf(FabricPoint);
      expect(fabricPoints[0].x).toBe(10);
      expect(fabricPoints[0].y).toBe(20);
      expect(fabricPoints[1]).toBeInstanceOf(FabricPoint);
      expect(fabricPoints[1].x).toBe(30);
      expect(fabricPoints[1].y).toBe(40);
    });
  });
  
  describe('fabricPointsToAppPoints', () => {
    it('should convert array of fabric points to app points', () => {
      const fabricPoints = [
        new FabricPoint(50, 60),
        new FabricPoint(70, 80)
      ];
      
      const appPoints = fabricPointsToAppPoints(fabricPoints);
      
      expect(appPoints).toHaveLength(2);
      expect(appPoints[0]).toEqual({ x: 50, y: 60 });
      expect(appPoints[1]).toEqual({ x: 70, y: 80 });
    });
  });
  
  describe('isAppPoint', () => {
    it('should return true for valid app point', () => {
      expect(isAppPoint({ x: 10, y: 20 })).toBe(true);
    });
    
    it('should return false for invalid values', () => {
      expect(isAppPoint(null)).toBe(false);
      expect(isAppPoint(undefined)).toBe(false);
      expect(isAppPoint({})).toBe(false);
      expect(isAppPoint({ x: 10 })).toBe(false);
      expect(isAppPoint({ y: 20 })).toBe(false);
      expect(isAppPoint({ x: '10', y: 20 })).toBe(false);
      expect(isAppPoint({ x: 10, y: '20' })).toBe(false);
    });
  });
  
  describe('getPointFromEvent', () => {
    it('should extract point from mouse event', () => {
      const mouseEvent = {
        clientX: 100,
        clientY: 200
      } as MouseEvent;
      
      const point = getPointFromEvent(mouseEvent);
      
      expect(point).toEqual({ x: 100, y: 200 });
    });
    
    it('should extract point from touch event', () => {
      const touchEvent = {
        touches: [
          { clientX: 300, clientY: 400 }
        ]
      } as unknown as TouchEvent;
      
      const point = getPointFromEvent(touchEvent);
      
      expect(point).toEqual({ x: 300, y: 400 });
    });
    
    it('should return null for invalid event', () => {
      const invalidEvent = {} as MouseEvent;
      
      const point = getPointFromEvent(invalidEvent);
      
      expect(point).toBeNull();
    });
  });
});
