
/**
 * Canvas history hook
 * Manages undo/redo history for canvas operations
 * @module hooks/useCanvasHistory
 */
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

/**
 * Maximum number of history states to keep
 */
const MAX_HISTORY_STATES = 50;

/**
 * Props for the canvas history hook
 */
export interface UseCanvasHistoryProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to the grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Reference to the history object */
  historyRef: React.MutableRefObject<{past: FabricObject[][], future: FabricObject[][]}>;
  /** Function to recalculate gross internal area */
  recalculateGIA?: () => void;
}

/**
 * Result type for the canvas history hook
 */
interface UseCanvasHistoryResult {
  /** Save current canvas state to history */
  saveCurrentState: () => void;
  /** Handle undo operation */
  handleUndo: () => void;
  /** Handle redo operation */
  handleRedo: () => void;
}

/**
 * Hook for managing canvas history and undo/redo operations
 * 
 * @param props - Hook properties
 * @returns Operations for history management
 */
export const useCanvasHistory = ({
  fabricCanvasRef,
  gridLayerRef,
  historyRef,
  recalculateGIA = () => {}
}: UseCanvasHistoryProps): UseCanvasHistoryResult => {
  
  /**
   * Save the current canvas state to history
   */
  const saveCurrentState = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Get all objects except grid
    const allCanvasObjects = canvas.getObjects();
    const gridObjectIds = gridLayerRef.current.map(obj => obj.id);
    
    // Filter out grid objects from state to save
    const objectsToSave = allCanvasObjects.filter(obj => !gridObjectIds.includes(obj.id));
    
    // Clone the objects to avoid reference issues
    const objectsClone = objectsToSave.map(obj => canvas.getActiveObject() === obj ? null : obj);
    
    // Add to past, clear future
    historyRef.current.past = [
      ...historyRef.current.past.slice(-MAX_HISTORY_STATES + 1),
      objectsClone
    ];
    historyRef.current.future = [];
  }, [fabricCanvasRef, gridLayerRef, historyRef]);
  
  /**
   * Handle undo operation
   */
  const handleUndo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || historyRef.current.past.length === 0) return;
    
    // Get current objects except grid
    const allCanvasObjects = canvas.getObjects();
    const gridObjectIds = gridLayerRef.current.map(obj => obj.id);
    const currentObjects = allCanvasObjects.filter(obj => !gridObjectIds.includes(obj.id));
    
    // Move current state to future
    historyRef.current.future = [currentObjects, ...historyRef.current.future];
    
    // Get the last past state
    const lastPastState = historyRef.current.past.pop();
    if (!lastPastState) return;
    
    // Clear current non-grid objects
    currentObjects.forEach(obj => canvas.remove(obj));
    
    // Add objects from past state
    lastPastState.forEach(obj => {
      if (obj) canvas.add(obj);
    });
    
    canvas.renderAll();
    
    // Recalculate GIA based on new canvas state
    recalculateGIA();
  }, [fabricCanvasRef, gridLayerRef, historyRef, recalculateGIA]);
  
  /**
   * Handle redo operation
   */
  const handleRedo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || historyRef.current.future.length === 0) return;
    
    // Get current objects except grid
    const allCanvasObjects = canvas.getObjects();
    const gridObjectIds = gridLayerRef.current.map(obj => obj.id);
    const currentObjects = allCanvasObjects.filter(obj => !gridObjectIds.includes(obj.id));
    
    // Move current state to past
    historyRef.current.past = [...historyRef.current.past, currentObjects];
    
    // Get the first future state
    const firstFutureState = historyRef.current.future.shift();
    if (!firstFutureState) return;
    
    // Clear current non-grid objects
    currentObjects.forEach(obj => canvas.remove(obj));
    
    // Add objects from future state
    firstFutureState.forEach(obj => {
      if (obj) canvas.add(obj);
    });
    
    canvas.renderAll();
    
    // Recalculate GIA based on new canvas state
    recalculateGIA();
  }, [fabricCanvasRef, gridLayerRef, historyRef, recalculateGIA]);
  
  return {
    saveCurrentState,
    handleUndo,
    handleRedo
  };
};
