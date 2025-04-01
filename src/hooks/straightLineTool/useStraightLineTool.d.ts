
/**
 * Type definitions for the straight line tool hook
 */
import { Line } from 'fabric';
import { Point } from '@/types/core/Geometry';

export interface UseStraightLineToolResult {
  /** Whether the line tool is active */
  isActive: boolean;
  /** Whether the line tool is initialized */
  isToolInitialized: boolean;
  /** Current line being drawn */
  currentLine: Line | null;
  /** Whether currently drawing a line */
  isDrawing: boolean;
  /** Cancel the current drawing */
  cancelDrawing: () => void;
  /** Start drawing a line from a point */
  startDrawing?: (point: Point) => void;
  /** Continue drawing to a point */
  continueDrawing?: (point: Point) => void;
  /** End drawing at current point */
  endDrawing?: () => void;
}
