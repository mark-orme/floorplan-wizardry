
/**
 * Type definitions for drawing history hook
 */

/**
 * Props for useDrawingHistory hook
 */
export interface UseDrawingHistoryProps {
  /** Reference to Fabric canvas */
  fabricCanvasRef: React.MutableRefObject<any>;
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<any[]>;
  /** Optional reference to history state */
  historyRef?: React.MutableRefObject<{
    past: any[];
    future: any[];
  }>;
  /** Function to recalculate grid info area */
  recalculateGIA?: () => void;
  /** Function to clear all drawings */
  clearDrawings?: () => void;
}

/**
 * Return type for useDrawingHistory hook
 */
export interface UseDrawingHistoryResult {
  /** Handle undo operation */
  handleUndo: () => void;
  /** Handle redo operation */
  handleRedo: () => void;
  /** Save current state for history */
  saveCurrentState: () => void;
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
}
