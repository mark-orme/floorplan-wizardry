
/**
 * Floor Plan Core Package
 * Core domain types and logic for floor plan functionality
 */

// Note: This is a barrel file that re-exports from various modules
// The actual implementations would be in the respective files

// Re-export types for TypeScript
export type FloorPlan = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: FloorPlanMetadata;
};

export type Wall = {
  id: string;
  startPoint: Point;
  endPoint: Point;
  thickness: number;
  properties: WallProperties;
};

export type Room = {
  id: string;
  name: string;
  area: number;
  walls: string[]; // Wall IDs
  properties: RoomProperties;
};

export type Furniture = {
  id: string;
  name: string;
  type: string;
  position: Point;
  rotation: number;
  dimensions: Dimensions;
};

// Core types
export type Point = {
  x: number;
  y: number;
};

export type Dimensions = {
  width: number;
  height: number;
  depth?: number;
};

export type FloorPlanMetadata = {
  version: string;
  unit: 'mm' | 'cm' | 'm' | 'inch' | 'ft';
  scale: number;
  author?: string;
  description?: string;
};

export type RoomProperties = {
  color?: string;
  floorMaterial?: string;
  wallMaterial?: string;
  ceilingHeight?: number;
  tags?: string[];
};

export type WallProperties = {
  color?: string;
  material?: string;
  hasWindow?: boolean;
  hasDoor?: boolean;
  isLoadBearing?: boolean;
};

// Core services (these would be implemented in actual files)
export class FloorPlanEngine {
  // Implementation would be in actual file
}

export class WallDrawingService {
  // Implementation would be in actual file
}

export class AreaCalculationService {
  // Implementation would be in actual file
}

export class RoomDetectionService {
  // Implementation would be in actual file
}

// Utilities
export const floorPlanValidator = {
  // Implementation would be in actual file
};

export const dimensionsCalculator = {
  // Implementation would be in actual file
};

export const coordinateConverter = {
  // Implementation would be in actual file
};

// Constants
export const FLOOR_PLAN_CONSTANTS = {
  DEFAULT_WALL_THICKNESS: 10,
  DEFAULT_CEILING_HEIGHT: 280,
  DEFAULT_UNIT: 'cm' as const,
  DEFAULT_SCALE: 1
};
