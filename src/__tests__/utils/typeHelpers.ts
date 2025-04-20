
/**
 * Type helper utilities for tests
 * Ensures consistent type usage across tests
 * @module __tests__/utils/typeHelpers
 */
import { Canvas as FabricCanvas } from 'fabric';
import { FloorPlan, Stroke, Point } from '@/types/floorPlanTypes';
import { ICanvasMock } from '@/types/testing/ICanvasMock';

/**
 * Safely type a canvas mock as a minimal interface
 * Prevents TS errors with properties not used in tests
 * 
 * @param mockCanvas Canvas mock object
 * @returns Properly typed canvas mock
 */
export function asCanvasMock(mockCanvas: any): ICanvasMock {
  return mockCanvas as ICanvasMock;
}

/**
 * Ensure a floor plan object conforms to the FloorPlan interface
 * 
 * @param floorPlan Floor plan object to check
 * @returns Typed floor plan
 */
export function ensureFloorPlan(floorPlan: any): FloorPlan {
  // Ensure required properties exist
  if (!floorPlan.id || !floorPlan.updatedAt) {
    throw new Error('Invalid floor plan object');
  }
  return floorPlan as FloorPlan;
}

/**
 * Create a minimal canvas reference object for tests
 * 
 * @param canvas Canvas mock
 * @returns Canvas reference object
 */
export function createCanvasRef(canvas: ICanvasMock): React.MutableRefObject<ICanvasMock> {
  return { current: canvas };
}
