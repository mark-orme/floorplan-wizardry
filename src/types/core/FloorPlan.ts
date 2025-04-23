
/**
 * FloorPlan type definitions
 * @module types/core/FloorPlan
 * 
 * @deprecated This file is being refactored. Import from '@/types/core' instead.
 */

// Re-export everything from the new modular structure
export * from '../core';

// Add createFloorPlan for backwards compatibility
import { createEmptyFloorPlan } from '../core';
export const createFloorPlan = createEmptyFloorPlan;
