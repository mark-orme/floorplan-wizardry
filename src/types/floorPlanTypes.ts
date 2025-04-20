
/**
 * Floor Plan Types
 */

// Import unified types to ensure consistency
import type { 
  Point, 
  Stroke as UnifiedStroke, 
  Wall as UnifiedWall, 
  Room as UnifiedRoom, 
  FloorPlan as UnifiedFloorPlan,
  FloorPlanMetadata as UnifiedMetadata,
  StrokeTypeLiteral, 
  RoomTypeLiteral 
} from './floor-plan/typesBarrel';

// Import PaperSize enum and helper functions
import { 
  PaperSize, 
  asStrokeType, 
  asRoomType, 
  createTestFloorPlan, 
  createTestStroke,
  createTestWall,
  createTestRoom,
  createTestPoint
} from './floor-plan/typesBarrel';

// Export all types used in the app
export type { StrokeTypeLiteral, RoomTypeLiteral, Point };
export { 
  PaperSize, 
  asStrokeType, 
  asRoomType,
  createTestFloorPlan,
  createTestStroke,
  createTestWall,
  createTestRoom,
  createTestPoint
};

// Re-export the DrawingMode from constants
import { DrawingMode } from '@/constants/drawingModes';
export { DrawingMode };

// Define the FloorPlan interface which follows the unified structure
export interface FloorPlan extends UnifiedFloorPlan {}

// These interfaces match the unified structure
export interface Stroke extends UnifiedStroke {}
export interface Wall extends UnifiedWall {}
export interface Room extends UnifiedRoom {}
export interface FloorPlanMetadata extends UnifiedMetadata {}

// Export additional types for backward compatibility
export interface FloorPlanDimensions {
  width: number;
  height: number;
  scale: number; // scale in pixels per meter
}

export interface AreaCalculation {
  areaM2: number; // Area in square meters
  areaSqFt: number; // Area in square feet
  rooms?: {
    id: string;
    name: string;
    areaM2: number;
  }[];
}

export enum FloorPlanStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

// Alias for backward compatibility
export type StrokeType = StrokeTypeLiteral;
