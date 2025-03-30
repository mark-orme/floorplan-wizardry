
/**
 * Tests for floor plan adapter converters
 * @module utils/floorPlanAdapter/converters.test
 */
import { describe, it, expect, vi } from 'vitest';
import { 
  appToCoreFloorPlan, 
  coreToAppFloorPlan,
  appToCoreFloorPlans,
  coreToAppFloorPlans
} from './converters';
import { FloorPlan as AppFloorPlan } from '@/types/floor-plan/floorPlanTypes';
import { FloorPlan as CoreFloorPlan } from '@/types/core/floor-plan/FloorPlan';

describe('Floor Plan Converters', () => {
  describe('appToCoreFloorPlan', () => {
    it('should convert app floor plan to core format', () => {
      // Create a simple app floor plan for testing
      const appFloorPlan: AppFloorPlan = {
        id: '123',
        name: 'Test Floor',
        label: 'Test Floor',
        walls: [
          { 
            id: 'wall1', 
            start: { x: 0, y: 0 }, 
            end: { x: 100, y: 0 }, 
            thickness: 2,
            points: [{ x: 0, y: 0 }, { x: 100, y: 0 }],
            color: '#000000'
          }
        ],
        rooms: [],
        strokes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        gia: 0,
        level: 0,
        index: 0,
        canvasData: null,
        canvasJson: null,
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          paperSize: 'A4',
          level: 0
        }
      };
      
      // Convert to core format
      const coreFloorPlan = appToCoreFloorPlan(appFloorPlan);
      
      // Verify conversion
      expect(coreFloorPlan.id).toBe(appFloorPlan.id);
      expect(coreFloorPlan.name).toBe(appFloorPlan.name);
      expect(coreFloorPlan.walls).toHaveLength(1);
      expect(coreFloorPlan.walls[0].id).toBe('wall1');
    });
    
    it('should handle empty app floor plan', () => {
      // Create an empty app floor plan
      const emptyAppFloorPlan: AppFloorPlan = {
        id: '123',
        name: 'Empty Floor',
        label: 'Empty Floor',
        walls: [],
        rooms: [],
        strokes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        gia: 0,
        level: 0,
        index: 0,
        canvasData: null,
        canvasJson: null,
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          paperSize: 'A4',
          level: 0
        }
      };
      
      // Convert to core format
      const coreFloorPlan = appToCoreFloorPlan(emptyAppFloorPlan);
      
      // Verify conversion
      expect(coreFloorPlan.id).toBe(emptyAppFloorPlan.id);
      expect(coreFloorPlan.walls).toHaveLength(0);
      expect(coreFloorPlan.rooms).toHaveLength(0);
    });
  });
  
  describe('coreToAppFloorPlan', () => {
    it('should convert core floor plan to app format', () => {
      // Create a simple core floor plan for testing
      const coreFloorPlan: CoreFloorPlan = {
        id: '123',
        name: 'Test Floor',
        label: 'Test Floor',
        walls: [
          { 
            id: 'wall1', 
            start: { x: 0, y: 0 }, 
            end: { x: 100, y: 0 }, 
            thickness: 2,
            color: '#000000',
            length: 100
          }
        ],
        rooms: [],
        strokes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        gia: 0,
        level: 0,
        index: 0,
        canvasData: null,
        canvasJson: null,
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          paperSize: 'A4',
          level: 0
        }
      };
      
      // Convert to app format
      const appFloorPlan = coreToAppFloorPlan(coreFloorPlan);
      
      // Verify conversion
      expect(appFloorPlan.id).toBe(coreFloorPlan.id);
      expect(appFloorPlan.name).toBe(coreFloorPlan.name);
      expect(appFloorPlan.walls).toHaveLength(1);
      expect(appFloorPlan.walls[0].id).toBe('wall1');
    });
    
    it('should handle empty core floor plan', () => {
      // Create an empty core floor plan
      const emptyCoreFloorPlan: CoreFloorPlan = {
        id: '123',
        name: 'Empty Floor',
        label: 'Empty Floor',
        walls: [],
        rooms: [],
        strokes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        gia: 0,
        level: 0,
        index: 0,
        canvasData: null,
        canvasJson: null,
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          paperSize: 'A4',
          level: 0
        }
      };
      
      // Convert to app format
      const appFloorPlan = coreToAppFloorPlan(emptyCoreFloorPlan);
      
      // Verify conversion
      expect(appFloorPlan.id).toBe(emptyCoreFloorPlan.id);
      expect(appFloorPlan.walls).toHaveLength(0);
      expect(appFloorPlan.rooms).toHaveLength(0);
    });
  });
  
  describe('appToCoreFloorPlans and coreToAppFloorPlans', () => {
    it('should batch convert multiple floor plans', () => {
      // Create test app floor plans
      const appFloorPlans: AppFloorPlan[] = [
        {
          id: '123',
          name: 'Floor 1',
          label: 'Floor 1',
          walls: [],
          rooms: [],
          strokes: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          gia: 0,
          level: 0,
          index: 0,
          canvasData: null,
          canvasJson: null,
          metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            paperSize: 'A4',
            level: 0
          }
        },
        {
          id: '456',
          name: 'Floor 2',
          label: 'Floor 2',
          walls: [],
          rooms: [],
          strokes: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          gia: 0,
          level: 1,
          index: 1,
          canvasData: null,
          canvasJson: null,
          metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            paperSize: 'A4',
            level: 1
          }
        }
      ];
      
      // Test batch conversion app -> core -> app
      const coreFloorPlans = appToCoreFloorPlans(appFloorPlans);
      const convertedAppFloorPlans = coreToAppFloorPlans(coreFloorPlans);
      
      // Verify results
      expect(coreFloorPlans).toHaveLength(2);
      expect(convertedAppFloorPlans).toHaveLength(2);
      expect(convertedAppFloorPlans[0].id).toBe(appFloorPlans[0].id);
      expect(convertedAppFloorPlans[1].id).toBe(appFloorPlans[1].id);
    });
    
    it('should handle empty arrays', () => {
      expect(appToCoreFloorPlans([])).toEqual([]);
      expect(coreToAppFloorPlans([])).toEqual([]);
    });
  });
});
