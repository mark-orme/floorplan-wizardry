
import { useState, useEffect, useCallback, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";
import { captureMessage, captureError } from "@/utils/sentry";
import logger from "@/utils/logger";

interface UseCanvasHistoryProps {
  canvas: FabricCanvas | null;
}

export const useCanvasHistory = ({ canvas }: UseCanvasHistoryProps) => {
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  // Track if events are being registered to prevent duplicate snapshots
  const isPerformingUndoRedoRef = useRef(false);
  
  // Automatically save state when changes occur
  useEffect(() => {
    if (!canvas) return;
    
    const handleCanvasChange = () => {
      // Don't create snapshot if we're in the middle of undo/redo
      if (isPerformingUndoRedoRef.current) return;
      
      saveCurrentState();
    };
    
    // Track relevant canvas events
    const trackableEvents = ['object:added', 'object:removed', 'object:modified', 'path:created'];
    
    // Add event listeners
    trackableEvents.forEach(event => {
      canvas.on(event, handleCanvasChange);
    });
    
    // Create initial state
    if (historyStack.length === 0) {
      saveCurrentState();
    }
    
    // Cleanup event listeners
    return () => {
      trackableEvents.forEach(event => {
        canvas.off(event, handleCanvasChange);
      });
    };
  }, [canvas]);
  
  // Save current canvas state to history
  const saveCurrentState = useCallback(() => {
    if (!canvas) return;
    
    try {
      const json = canvas.toJSON();
      const jsonStr = JSON.stringify(json);
      
      // If we're not at the end of the history, remove everything after current index
      const newHistory = historyStack.slice(0, historyIndex + 1);
      newHistory.push(jsonStr);
      
      setHistoryStack(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setCanUndo(newHistory.length > 1);
      setCanRedo(false);
      
      const objectCount = canvas.getObjects().filter(obj => (obj as any).objectType !== 'grid').length;
      logger.debug(`Canvas snapshot saved. Object count: ${objectCount}`);
      
      captureMessage("Canvas state saved", "canvas-save-state");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to save canvas state", { error: errorMsg });
      captureError(error as Error, "canvas-save-error");
      toast.error(`Failed to save canvas state: ${errorMsg}`);
    }
  }, [canvas, historyStack, historyIndex]);

  // Undo last action
  const undo = useCallback(() => {
    if (!canvas || historyIndex <= 0) return;
    
    try {
      isPerformingUndoRedoRef.current = true;
      
      const prevState = historyStack[historyIndex - 1];
      const prevStateObj = JSON.parse(prevState);
      
      // Updated to use loadFromJSON correctly, callback is the second parameter
      canvas.loadFromJSON(prevStateObj, () => {
        canvas.renderAll();
        setHistoryIndex(historyIndex - 1);
        setCanUndo(historyIndex - 1 > 0);
        setCanRedo(true);
        
        isPerformingUndoRedoRef.current = false;
      });
      
      captureMessage("Undo performed on canvas", "canvas-undo");
    } catch (error) {
      isPerformingUndoRedoRef.current = false;
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to undo", { error: errorMsg });
      captureError(error as Error, "canvas-undo-error");
      toast.error(`Failed to undo: ${errorMsg}`);
    }
  }, [canvas, historyStack, historyIndex]);

  // Redo last undone action
  const redo = useCallback(() => {
    if (!canvas || historyIndex >= historyStack.length - 1) return;
    
    try {
      isPerformingUndoRedoRef.current = true;
      
      const nextState = historyStack[historyIndex + 1];
      const nextStateObj = JSON.parse(nextState);
      
      // Updated to use loadFromJSON correctly, callback is the second parameter
      canvas.loadFromJSON(nextStateObj, () => {
        canvas.renderAll();
        setHistoryIndex(historyIndex + 1);
        setCanUndo(true);
        setCanRedo(historyIndex + 1 < historyStack.length - 1);
        
        isPerformingUndoRedoRef.current = false;
      });
      
      captureMessage("Redo performed on canvas", "canvas-redo");
    } catch (error) {
      isPerformingUndoRedoRef.current = false;
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to redo", { error: errorMsg });
      captureError(error as Error, "canvas-redo-error");
      toast.error(`Failed to redo: ${errorMsg}`);
    }
  }, [canvas, historyStack, historyIndex]);

  // Explicitly request state save (for operations not tracked by events)
  const requestStateSave = useCallback(() => {
    saveCurrentState();
  }, [saveCurrentState]);

  return {
    historyStack,
    historyIndex,
    canUndo,
    canRedo,
    saveCurrentState: requestStateSave,
    undo,
    redo
  };
};
