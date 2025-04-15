
import { useState, useEffect, useCallback, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";
import { captureMessage, captureError } from "@/utils/sentry";
import logger from "@/utils/logger";
import { FabricEventTypes } from "@/types/fabric-events";
import { 
  saveCanvasHistory, 
  loadCanvasHistory, 
  MAX_HISTORY_STATES
} from "@/utils/storage/historyStorage";
import { useSupabaseFloorPlans } from "@/hooks/useSupabaseFloorPlans";

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
  
  // Sync with Supabase if user is logged in
  const { saveToSupabase, isLoggedIn } = useSupabaseFloorPlans();
  const syncTimeoutRef = useRef<number | null>(null);
  
  // Track if events are being registered to prevent duplicate snapshots
  const isPerformingUndoRedoRef = useRef(false);
  const initialLoadDoneRef = useRef(false);
  
  // Initialize history from storage
  useEffect(() => {
    if (!canvas || initialLoadDoneRef.current) return;
    
    const loadInitialHistory = async () => {
      try {
        const savedHistory = await loadCanvasHistory(HISTORY_KEY);
        
        if (savedHistory && savedHistory.length > 0) {
          // Ensure we don't exceed max states by trimming if needed
          const trimmedHistory = savedHistory.length > maxHistoryStates 
            ? savedHistory.slice(savedHistory.length - maxHistoryStates) 
            : savedHistory;
            
          setHistoryStack(trimmedHistory);
          setHistoryIndex(trimmedHistory.length - 1);
          setCanUndo(trimmedHistory.length > 1);
          setCanRedo(false);
          
          // Load the last state into the canvas
          const lastState = trimmedHistory[trimmedHistory.length - 1];
          const lastStateObj = JSON.parse(lastState);
          
          canvas.loadFromJSON(lastStateObj, () => {
            canvas.renderAll();
            logger.debug("Restored canvas from saved history");
            captureMessage("Canvas restored from history", "canvas-restore");
          });
        } else {
          // Create initial snapshot if no history exists
          saveCurrentState();
        }
        
        initialLoadDoneRef.current = true;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        logger.error("Failed to load history", { error: errorMsg });
        captureError(error as Error, "history-load-error");
        toast.error(`Failed to load history: ${errorMsg}`);
        
        // Fallback to empty history
        saveCurrentState();
        initialLoadDoneRef.current = true;
      }
    };
    
    loadInitialHistory();
  }, [canvas]);
  
  // Automatically save state when changes occur
  useEffect(() => {
    if (!canvas) return;
    
    const handleCanvasChange = () => {
      // Don't create snapshot if we're in the middle of undo/redo
      if (isPerformingUndoRedoRef.current) return;
      
      saveCurrentState();
    };
    
    // Track relevant canvas events
    const trackableEvents = [
      FabricEventTypes.OBJECT_ADDED, 
      FabricEventTypes.OBJECT_REMOVED, 
      FabricEventTypes.OBJECT_MODIFIED, 
      FabricEventTypes.PATH_CREATED
    ];
    
    // Add event listeners
    trackableEvents.forEach(event => {
      canvas.on(event, handleCanvasChange);
    });
    
    // Create initial state if no history exists
    if (historyStack.length === 0 && initialLoadDoneRef.current) {
      saveCurrentState();
    }
    
    // Cleanup event listeners
    return () => {
      trackableEvents.forEach(event => {
        canvas.off(event, handleCanvasChange);
      });
    };
  }, [canvas, historyStack, historyIndex]);
  
  // Save current canvas state to history and persist it
  const saveCurrentState = useCallback(async () => {
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
      
      // Persist history to IndexedDB
      await saveCanvasHistory(HISTORY_KEY, trimmedHistory, maxHistoryStates);
      
      // Debounced sync with Supabase if user is logged in
      if (isLoggedIn) {
        if (syncTimeoutRef.current) {
          window.clearTimeout(syncTimeoutRef.current);
        }
        
        syncTimeoutRef.current = window.setTimeout(() => {
          // Use the most recent canvas state for cloud sync
          const canvasState = JSON.parse(trimmedHistory[trimmedHistory.length - 1]);
          saveToSupabase([{ type: 'floorplan', data: canvasState }]);
          logger.debug("Canvas state synced to cloud");
        }, 5000); // Sync after 5 seconds of inactivity
      }
      
      const objectCount = canvas.getObjects().filter(obj => (obj as any).objectType !== 'grid').length;
      logger.debug(`Canvas snapshot saved. Object count: ${objectCount}`);
      
      captureMessage("Canvas state saved", "canvas-save-state");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to save canvas state", { error: errorMsg });
      captureError(error as Error, "canvas-save-error");
      toast.error(`Failed to save canvas state: ${errorMsg}`);
    }
  }, [canvas, historyStack, historyIndex, maxHistoryStates, isLoggedIn, saveToSupabase]);

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
