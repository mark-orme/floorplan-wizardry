
/**
 * Hook for efficient undo/redo functionality with canvas snapshots
 * Uses throttled/debounced state capture for better performance
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { useThrottledCanvasUpdate } from './useThrottledCanvasUpdate';

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
  
  // Use refs for the history to avoid re-renders when history changes
  const historyRef = useRef<string[]>([]);
  const currentIndexRef = useRef<number>(-1);
  const isManualCaptureRef = useRef<boolean>(false);
  const ignoreNextSnapshotRef = useRef<boolean>(false);
  
  // Create throttled/debounced canvas state capture
  const { debouncedUpdate: debouncedCapture } = useThrottledCanvasUpdate((forceCapture = false) => {
    if (!canvas || (ignoreNextSnapshotRef.current && !forceCapture)) {
      ignoreNextSnapshotRef.current = false;
      return;
    }
    
    // Only capture if canvas is ready
    try {
      captureCurrentState();
    } catch (error) {
      console.error('Error capturing canvas state:', error);
    }
  }, { debounceMs: captureDelay, throttleMs: 50 });
  
  /**
   * Capture the current canvas state as a JSON string
   */
  const captureCurrentState = useCallback(() => {
    if (!canvas) return;
    
    try {
      // Get canvas as JSON
      const json = JSON.stringify(canvas.toJSON(['id', 'objectType', 'customProps']));
      
      // If this is a manual capture, or the state is different from the current state
      const currentStateIndex = currentIndexRef.current;
      const currentState = currentStateIndex >= 0 ? historyRef.current[currentStateIndex] : null;
      
      if (isManualCaptureRef.current || json !== currentState) {
        // Remove future states if we're not at the end of history
        if (currentStateIndex < historyRef.current.length - 1) {
          historyRef.current = historyRef.current.slice(0, currentStateIndex + 1);
        }
        
        // Add new state to history
        historyRef.current.push(json);
        
        // Update current index
        currentIndexRef.current = historyRef.current.length - 1;
        
        // Limit history size
        if (historyRef.current.length > maxHistoryStates) {
          historyRef.current.shift();
          currentIndexRef.current--;
        }
        
        // Update undo/redo availability
        setCanUndo(currentIndexRef.current > 0);
        setCanRedo(false);
        
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
   * Apply a state from history to the canvas
   */
  const applyState = useCallback((stateJson: string) => {
    if (!canvas) return;
    
    try {
      // Prevent capturing this change as a new history state
      ignoreNextSnapshotRef.current = true;
      
      // Parse the JSON state
      const state = JSON.parse(stateJson);
      
      // Load state into canvas
      canvas.loadFromJSON(state, () => {
        canvas.renderAll();
      });
    } catch (error) {
      console.error('Error applying canvas state:', error);
      toast.error('Failed to apply canvas state');
    }
  }, [canvas]);
  
  /**
   * Undo the last action
   */
  const undo = useCallback(() => {
    if (!canUndo) {
      toast.info('Nothing to undo');
      return;
    }
    
    try {
      // Move to previous state
      currentIndexRef.current--;
      
      // Apply the previous state
      applyState(historyRef.current[currentIndexRef.current]);
      
      // Update undo/redo availability
      setCanUndo(currentIndexRef.current > 0);
      setCanRedo(true);
      
      toast.success('Undo successful');
    } catch (error) {
      console.error('Error during undo:', error);
      toast.error('Failed to undo');
    }
  }, [canUndo, applyState]);
  
  /**
   * Redo the last undone action
   */
  const redo = useCallback(() => {
    if (!canRedo) {
      toast.info('Nothing to redo');
      return;
    }
    
    try {
      // Move to next state
      currentIndexRef.current++;
      
      // Apply the next state
      applyState(historyRef.current[currentIndexRef.current]);
      
      // Update undo/redo availability
      setCanUndo(true);
      setCanRedo(currentIndexRef.current < historyRef.current.length - 1);
      
      toast.success('Redo successful');
    } catch (error) {
      console.error('Error during redo:', error);
      toast.error('Failed to redo');
    }
  }, [canRedo, applyState]);
  
  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    historyRef.current = [];
    currentIndexRef.current = -1;
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
      'object:added',
      'object:removed',
      'object:modified',
      'path:created'
    ];
    
    // Create handlers
    const handleModification = () => {
      debouncedCapture();
    };
    
    // Add event listeners
    captureEvents.forEach(event => {
      canvas.on(event, handleModification);
    });
    
    // Capture initial state
    if (historyRef.current.length === 0) {
      // Delay initial capture to ensure canvas is fully loaded
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
