
import { DrawingMode } from '@/constants/drawingModes';

// Map of DrawingMode values for consistent usage
export interface DrawingModeMap {
  constants: typeof DrawingMode;
  typesModule: typeof import('@/types/drawing-types').DrawingMode;
  featureModule: typeof import('@/types/drawing/DrawingToolType').DrawingMode;
}

// FixMe type for dealing with complex type mismatches
export type FixMe<T = unknown> = T;

// Mapping for canvas fabric types
export interface CanvasTypeMap {
  fabric: unknown;
  fabricUnified: unknown;
}
