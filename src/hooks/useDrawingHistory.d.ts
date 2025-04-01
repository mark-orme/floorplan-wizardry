
/**
 * Type definitions for useDrawingHistory hook
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

export interface HistoryState {
  past: FabricObject[][];
  future: FabricObject[][];
}

export interface UseDrawingHistoryProps {
  /** Reference to fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Reference to history state */
  historyRef: React.MutableRefObject<HistoryState>;
  /** Function to clear all drawings */
  clearDrawings: () => void;
  /** Function to recalculate area */
  recalculateGIA: () => void;
}

export interface UseDrawingHistoryResult {
  /** Handle undo action */
  handleUndo: () => void;
  /** Handle redo action */
  handleRedo: () => void;
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
  /** Save current canvas state */
  saveCurrentState: () => void;
}
