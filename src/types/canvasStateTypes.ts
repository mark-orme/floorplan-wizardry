
import { DrawingMode } from "@/constants/drawingModes";

export type DrawingTool = 'select' | 'pan' | 'draw' | 'erase' | 'line' | 'rectangle' | 'circle' | 'text' | 'wall';

// TypeScript utility type to unify divergent DrawingMode enums
export type FixMe = unknown;

// Type adapter for mapping between different DrawingMode formats
export interface DrawingModeAdapter {
  constants: typeof DrawingMode;
  types: DrawingTool;
}

export { DrawingMode };
