
import { useState, useEffect, useCallback } from "react";
import { Canvas as FabricCanvas, ActiveSelection } from "fabric";
import { toast } from "sonner";
import { captureMessage, captureError } from "@/utils/sentry";
import logger from "@/utils/logger";
import { MAX_HISTORY_STATES } from "@/utils/storage/historyStorage";

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
  const [isPerformingUndoRedo, setIsPerformingUndoRedo] = useState(false);
  
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

  // Register canvas change handlers
  const registerCanvasChangeHandlers = useCallback(() => {
    if (!canvas) return () => {};
    
    const handleObjectAdded = (e: any) => {
      if (isPerformingUndoRedo) return;
      // Don't save for grid objects
      if (e.target && (e.target as any).objectType === 'grid') return;
      
      saveCurrentState();
    };
    
    const handleObjectModified = (e: any) => {
      if (isPerformingUndoRedo) return;
      // Don't save for grid objects
      if (e.target && (e.target as any).objectType === 'grid') return;
      
      saveCurrentState();
    };
    
    const handleObjectRemoved = (e: any) => {
      if (isPerformingUndoRedo) return;
      // Don't save for grid objects
      if (e.target && (e.target as any).objectType === 'grid') return;
      
      saveCurrentState();
    };
    
    // Add event listeners
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:removed', handleObjectRemoved);
    
    // Return cleanup function
    return () => {
      if (canvas) {
        canvas.off('object:added', handleObjectAdded);
        canvas.off('object:modified', handleObjectModified);
        canvas.off('object:removed', handleObjectRemoved);
      }
    };
  }, [canvas, isPerformingUndoRedo, saveCurrentState]);
  
  // Register event listeners
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
    if (!canvas || historyIndex <= 0) {
      toast.info('Nothing to undo');
      return;
    }
    
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
        toast.success('Undo successful');
      });
      
      captureMessage("Undo performed on canvas", "canvas-undo");
    } catch (error) {
      setIsPerformingUndoRedo(false);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to undo", { error: errorMsg });
      captureError(error as Error, "canvas-undo-error");
      toast.error(`Failed to undo: ${errorMsg}`);
    }
  }, [canvas, historyStack, historyIndex]);

  // Redo last undone action
  const redo = useCallback(() => {
    if (!canvas || historyIndex >= historyStack.length - 1) {
      toast.info('Nothing to redo');
      return;
    }
    
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
        toast.success('Redo successful');
      });
      
      captureMessage("Redo performed on canvas", "canvas-redo");
    } catch (error) {
      setIsPerformingUndoRedo(false);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to redo", { error: errorMsg });
      captureError(error as Error, "canvas-redo-error");
      toast.error(`Failed to redo: ${errorMsg}`);
    }
  }, [canvas, historyStack, historyIndex]);

  // Delete selected objects
  const deleteSelectedObjects = useCallback(() => {
    if (!canvas) return;
    
    try {
      const activeObject = canvas.getActiveObject();
      if (!activeObject) {
        logger.info("No active object to delete");
        return;
      }
      
      // Save current state before deleting
      saveCurrentState();
      
      if (activeObject.type === 'activeSelection') {
        // Delete multiple selected objects
        const activeSelection = activeObject as ActiveSelection;
        
        activeSelection.forEachObject((obj: any) => {
          canvas.remove(obj);
        });
        
        canvas.discardActiveObject();
        logger.info(`Deleted multiple objects`);
        
        captureMessage("Objects deleted", "objects-deleted");
      } else {
        // Delete single object
        canvas.remove(activeObject);
        canvas.discardActiveObject();
        logger.info("Deleted single object");
        
        captureMessage("Object deleted", "object-deleted");
      }
      
      canvas.requestRenderAll();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to delete objects", { error: errorMsg });
      captureError(error as Error, "delete-objects-error");
      toast.error(`Failed to delete objects: ${errorMsg}`);
    }
  }, [canvas, saveCurrentState]);

  return {
    historyStack,
    historyIndex,
    canUndo,
    canRedo,
    saveCurrentState,
    undo,
    redo,
    deleteSelectedObjects,
    setIsPerformingUndoRedo,
    registerCanvasChangeHandlers
  };
};
