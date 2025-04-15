
import { useState, useEffect, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";
import { captureMessage, captureError } from "@/utils/sentry";
import logger from "@/utils/logger";
import { MAX_HISTORY_STATES } from "@/utils/storage/historyStorage";
import { 
  useCanvasPersistence, 
  useCanvasAutoSave, 
  useCanvasRestoreCheck 
} from './index';

// History key for storage
const HISTORY_KEY = 'canvas-v1';

interface UseCanvasHistoryProps {
  canvas: FabricCanvas | null;
  maxHistoryStates?: number;
}

export const useCanvasHistory = ({ 
  canvas, 
  maxHistoryStates = MAX_HISTORY_STATES 
}: UseCanvasHistoryProps) => {
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  // Setup canvas restore check
  const saveCurrentState = useCallback(() => {
    if (!canvas) return;
    
    try {
      const json = canvas.toJSON();
      const jsonStr = JSON.stringify(json);
      
      // If we're not at the end of the history, remove everything after current index
      const newHistory = historyStack.slice(0, historyIndex + 1);
      newHistory.push(jsonStr);
      
      // Trim history if it exceeds maxHistoryStates
      const trimmedHistory = newHistory.length > maxHistoryStates 
        ? newHistory.slice(newHistory.length - maxHistoryStates) 
        : newHistory;
      
      setHistoryStack(trimmedHistory);
      setHistoryIndex(trimmedHistory.length - 1);
      setCanUndo(trimmedHistory.length > 1);
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
  }, [canvas, historyStack, historyIndex, maxHistoryStates]);

  // Setup canvas history persistence
  const { persistHistory } = useCanvasPersistence({
    canvas,
    historyStack,
    historyIndex,
    onHistoryLoaded: (history, index) => {
      setHistoryStack(history);
      setHistoryIndex(index);
      setCanUndo(index > 0);
      setCanRedo(index < history.length - 1);
    }
  });

  // Setup canvas auto-save
  useCanvasAutoSave({
    canvas,
    historyStack,
    historyIndex
  });
  
  // Setup change handlers
  const { 
    setIsPerformingUndoRedo,
    registerCanvasChangeHandlers 
  } = useCanvasRestoreCheck({
    canvas,
    saveCurrentState
  });
  
  // Register canvas change handlers
  useEffect(() => {
    const cleanup = registerCanvasChangeHandlers();
    
    // Create initial state if no history exists
    if (historyStack.length === 0 && canvas) {
      saveCurrentState();
    }
    
    return cleanup;
  }, [canvas, registerCanvasChangeHandlers, historyStack, saveCurrentState]);

  // Undo last action
  const undo = useCallback(() => {
    if (!canvas || historyIndex <= 0) return;
    
    try {
      setIsPerformingUndoRedo(true);
      
      const prevState = historyStack[historyIndex - 1];
      const prevStateObj = JSON.parse(prevState);
      
      // Load from JSON with proper callback
      canvas.loadFromJSON(prevStateObj, () => {
        canvas.renderAll();
        setHistoryIndex(historyIndex - 1);
        setCanUndo(historyIndex - 1 > 0);
        setCanRedo(true);
        
        setIsPerformingUndoRedo(false);
      });
      
      captureMessage("Undo performed on canvas", "canvas-undo");
    } catch (error) {
      setIsPerformingUndoRedo(false);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to undo", { error: errorMsg });
      captureError(error as Error, "canvas-undo-error");
      toast.error(`Failed to undo: ${errorMsg}`);
    }
  }, [canvas, historyStack, historyIndex, setIsPerformingUndoRedo]);

  // Redo last undone action
  const redo = useCallback(() => {
    if (!canvas || historyIndex >= historyStack.length - 1) return;
    
    try {
      setIsPerformingUndoRedo(true);
      
      const nextState = historyStack[historyIndex + 1];
      const nextStateObj = JSON.parse(nextState);
      
      // Load from JSON with proper callback
      canvas.loadFromJSON(nextStateObj, () => {
        canvas.renderAll();
        setHistoryIndex(historyIndex + 1);
        setCanUndo(true);
        setCanRedo(historyIndex + 1 < historyStack.length - 1);
        
        setIsPerformingUndoRedo(false);
      });
      
      captureMessage("Redo performed on canvas", "canvas-redo");
    } catch (error) {
      setIsPerformingUndoRedo(false);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to redo", { error: errorMsg });
      captureError(error as Error, "canvas-redo-error");
      toast.error(`Failed to redo: ${errorMsg}`);
    }
  }, [canvas, historyStack, historyIndex, setIsPerformingUndoRedo]);

  return {
    historyStack,
    historyIndex,
    canUndo,
    canRedo,
    saveCurrentState,
    undo,
    redo
  };
};
