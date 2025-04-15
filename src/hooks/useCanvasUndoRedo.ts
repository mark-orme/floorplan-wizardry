
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useThrottledCanvasUpdate } from './useThrottledCanvasUpdate';
import { captureCanvasState, applyCanvasState } from '@/utils/canvas/canvasStateCapture';
import { 
  HistoryState, 
  createInitialHistoryState, 
  addStateToHistory, 
  moveBackInHistory, 
  moveForwardInHistory,
  canUndo as getCanUndo,
  canRedo as getCanRedo,
  showHistoryActionToast
} from '@/utils/canvas/historyStateManager';
import { FabricEventTypes } from '@/types/fabric-events';

interface UseCanvasUndoRedoProps {
  canvas: FabricCanvas | null;
  maxHistoryStates?: number;
  captureDelay?: number;
}

export const useCanvasUndoRedo = ({
  canvas,
  maxHistoryStates = 50,
  captureDelay = 300
}: UseCanvasUndoRedoProps) => {
  // History state references
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  // Use ref for the history to avoid re-renders when history changes
  const historyRef = useRef<HistoryState>(createInitialHistoryState());
  const isManualCaptureRef = useRef<boolean>(false);
  const ignoreNextSnapshotRef = useRef<boolean>(false);
  
  // Create throttled/debounced canvas state capture
  const { debouncedUpdate: debouncedCapture } = useThrottledCanvasUpdate(() => {
    if (!canvas || ignoreNextSnapshotRef.current) {
      ignoreNextSnapshotRef.current = false;
      return;
    }
    
    // Only capture if canvas is ready
    try {
      captureCurrentState();
    } catch (error) {
      console.error('Error capturing canvas state:', error);
    }
  }, { 
    debounceMs: captureDelay, 
    throttleMs: 50,
    immediate: false
  });
  
  /**
   * Capture the current canvas state
   */
  const captureCurrentState = useCallback(() => {
    if (!canvas) return;
    
    try {
      // Get canvas as JSON
      const json = captureCanvasState(canvas);
      if (!json) return;
      
      // If this is a manual capture, or the state is different from the current state
      const currentStateIndex = historyRef.current.current;
      const currentState = currentStateIndex >= 0 ? historyRef.current.past[currentStateIndex] : null;
      
      if (isManualCaptureRef.current || json !== currentState) {
        // Update history state
        historyRef.current = addStateToHistory(historyRef.current, json, maxHistoryStates);
        
        // Update undo/redo availability
        setCanUndo(getCanUndo(historyRef.current));
        setCanRedo(getCanRedo(historyRef.current));
        
        // Reset manual capture flag
        isManualCaptureRef.current = false;
      }
    } catch (error) {
      console.error('Error capturing canvas state:', error);
    }
  }, [canvas, maxHistoryStates]);
  
  /**
   * Manually trigger a state capture
   * Use this when making programmatic changes
   */
  const saveState = useCallback(() => {
    if (!canvas) return;
    
    // Mark as manual capture
    isManualCaptureRef.current = true;
    
    // Capture immediately
    captureCurrentState();
  }, [canvas, captureCurrentState]);
  
  /**
   * Undo the last action
   */
  const undo = useCallback(() => {
    if (!canUndo || !canvas) {
      showHistoryActionToast('undo', false);
      return;
    }
    
    try {
      // Move back in history
      const { newHistory, previousState } = moveBackInHistory(historyRef.current);
      
      if (previousState) {
        // Update history reference
        historyRef.current = newHistory;
        
        // Prevent capturing this change as a new history state
        ignoreNextSnapshotRef.current = true;
        
        // Apply the previous state
        applyCanvasState(canvas, previousState);
        
        // Update undo/redo availability
        setCanUndo(getCanUndo(historyRef.current));
        setCanRedo(getCanRedo(historyRef.current));
        
        showHistoryActionToast('undo', true);
      } else {
        showHistoryActionToast('undo', false);
      }
    } catch (error) {
      console.error('Error during undo:', error);
      showHistoryActionToast('undo', false);
    }
  }, [canUndo, canvas]);
  
  /**
   * Redo the last undone action
   */
  const redo = useCallback(() => {
    if (!canRedo || !canvas) {
      showHistoryActionToast('redo', false);
      return;
    }
    
    try {
      // Move forward in history
      const { newHistory, nextState } = moveForwardInHistory(historyRef.current);
      
      if (nextState) {
        // Update history reference
        historyRef.current = newHistory;
        
        // Prevent capturing this change as a new history state
        ignoreNextSnapshotRef.current = true;
        
        // Apply the next state
        applyCanvasState(canvas, nextState);
        
        // Update undo/redo availability
        setCanUndo(getCanUndo(historyRef.current));
        setCanRedo(getCanRedo(historyRef.current));
        
        showHistoryActionToast('redo', true);
      } else {
        showHistoryActionToast('redo', false);
      }
    } catch (error) {
      console.error('Error during redo:', error);
      showHistoryActionToast('redo', false);
    }
  }, [canRedo, canvas]);
  
  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    historyRef.current = createInitialHistoryState();
    setCanUndo(false);
    setCanRedo(false);
  }, []);
  
  /**
   * Set up canvas event listeners for automatic state capture
   */
  useEffect(() => {
    if (!canvas) return;
    
    // Events that should trigger state capture
    const captureEvents = [
      FabricEventTypes.OBJECT_ADDED,
      FabricEventTypes.OBJECT_MODIFIED,
      FabricEventTypes.OBJECT_REMOVED
    ];
    
    // Create handlers
    const handleModification = () => {
      // Call debouncedCapture without arguments
      debouncedCapture();
    };
    
    // Add event listeners
    captureEvents.forEach(event => {
      canvas.on(event, handleModification);
    });
    
    // Capture initial state
    if (historyRef.current.past.length === 0) {
      setTimeout(() => {
        captureCurrentState();
      }, 500);
    }
    
    // Clean up event listeners
    return () => {
      if (canvas) {
        captureEvents.forEach(event => {
          canvas.off(event, handleModification);
        });
      }
    };
  }, [canvas, debouncedCapture, captureCurrentState]);
  
  return {
    undo,
    redo,
    canUndo,
    canRedo,
    saveState,
    clearHistory
  };
};
