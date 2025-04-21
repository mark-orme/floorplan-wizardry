
/**
 * Floor Plan Core Package
 * Core domain types and logic for floor plan functionality
 */

// Core types - using export type for types
export { FloorPlan } from './models/FloorPlan';
export { Wall } from './models/Wall';
export { Room } from './models/Room';
export { Furniture } from './models/Furniture';

// Use "export type" syntax for types when isolatedModules is enabled
export type { Point } from './types/Point';
export type { Dimensions } from './types/Dimensions';
export type { FloorPlanMetadata } from './types/FloorPlanMetadata';
export type { RoomProperties } from './types/RoomProperties';
export type { WallProperties } from './types/WallProperties';

// Core services
export { FloorPlanEngine } from './services/FloorPlanEngine';
export { WallDrawingService } from './services/WallDrawingService';
export { AreaCalculationService } from './services/AreaCalculationService';
export { RoomDetectionService } from './services/RoomDetectionService';

// Utilities
export { floorPlanValidator } from './utils/floorPlanValidator';
export { dimensionsCalculator } from './utils/dimensionsCalculator';
export { coordinateConverter } from './utils/coordinateConverter';

// Constants
export { FLOOR_PLAN_CONSTANTS } from './constants';
