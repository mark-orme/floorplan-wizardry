
import { Canvas } from 'fabric';

/**
 * Props for the useDrawingHistory hook
 */
export interface UseDrawingHistoryProps {
  /** Reference to the Fabric canvas */
  fabricCanvasRef: React.MutableRefObject<Canvas | null>;
  
  /** Reference to the grid layer objects */
  gridLayerRef: React.MutableRefObject<any[]>;
  
  /** Reference to the history state */
  historyRef: React.MutableRefObject<{
    past: any[][];
    future: any[][];
  }>;
  
  /** Function to clear all drawings from the canvas */
  clearDrawings: () => void;
  
  /** Function to recalculate Gross Internal Area */
  recalculateGIA: () => void;
}

/**
 * Result interface for the useDrawingHistory hook
 */
export interface UseDrawingHistoryResult {
  /** Undo the last drawing operation */
  handleUndo: () => void;
  
  /** Redo a previously undone drawing operation */
  handleRedo: () => void;
  
  /** Save the current canvas state to history */
  saveCurrentState: () => void;
  
  /** Whether undo is available */
  canUndo: boolean;
  
  /** Whether redo is available */
  canRedo: boolean;
}
