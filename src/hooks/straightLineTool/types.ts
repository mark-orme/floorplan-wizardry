
/**
 * Types for the straight line tool
 * @module hooks/straightLineTool/types
 */
import { Point } from '@/types/core/Point';

/**
 * Measurement data interface
 * Contains information about line measurements
 */
export interface MeasurementData {
  /** Distance of the line in pixels */
  distance: number | null;
  /** Angle of the line in degrees */
  angle: number | null;
  /** Whether the line was snapped to grid */
  snapped?: boolean;
  /** Measurement unit (e.g., 'm', 'cm', etc.) */
  unit: string;
}

/**
 * Line state interface
 * Contains state for straight line drawing
 */
export interface LineState {
  /** Whether currently drawing */
  isDrawing: boolean;
  /** Whether the tool is active */
  isActive: boolean;
  /** Whether the tool is initialized */
  isToolInitialized: boolean;
  /** The current input method */
  inputMethod: string;
  /** Whether using pencil mode */
  isPencilMode: boolean;
  /** Whether grid snapping is enabled */
  snapEnabled: boolean;
  /** Whether angle snapping is enabled */
  anglesEnabled: boolean;
  /** Current measurement data */
  measurementData: MeasurementData;
  /** The current line being drawn */
  currentLine: any | null;
}
