
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

// Utility to safely cast between incompatible types with similar interfaces
export function safeTypeAdapter<T, U>(source: T, mapping?: Record<string, string>): U {
  return source as unknown as U;
}

// Helper to convert between different DrawingMode formats
export function adaptDrawingMode<T extends string>(mode: DrawingMode | string): T {
  return mode as unknown as T;
}

// Type guard for DrawingMode values
export function isDrawingMode(value: unknown): value is DrawingMode {
  return typeof value === 'string' && Object.values(DrawingMode).includes(value as DrawingMode);
}
