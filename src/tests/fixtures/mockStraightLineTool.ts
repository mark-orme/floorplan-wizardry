
import { vi } from 'vitest';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';

/**
 * Creates a mock floor plan for testing
 */
export function createMockFloorPlan() {
  return {
    id: 'mock-floor-plan-1',
    name: 'Mock Floor Plan',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    width: 800,
    height: 600,
    data: {}
  };
}

// Alias for backward compatibility
export const createEmptyFloorPlan = createMockFloorPlan;
