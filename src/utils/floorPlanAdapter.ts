
/**
 * Floor plan adapter
 * Provides utilities for adapting between different floor plan formats
 * @module utils/floorPlanAdapter
 */

// Re-export everything from the converters module
export {
  adaptFloorPlan,
  appToCoreFloorPlans,
  appToCoreFloorPlan,
  coreToAppFloorPlans,
  coreToAppFloorPlan
} from './floorPlanAdapter/converters';
