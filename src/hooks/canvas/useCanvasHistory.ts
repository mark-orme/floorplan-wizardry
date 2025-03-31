
import { useState, useCallback } from "react";
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

  // Save current canvas state to history
  const saveCurrentState = useCallback(() => {
    if (!canvas) return;
    
    try {
      const json = canvas.toJSON(['objectType']);
      const jsonStr = JSON.stringify(json);
      
      // If we're not at the end of the history, remove everything after current index
      const newHistory = historyStack.slice(0, historyIndex + 1);
      newHistory.push(jsonStr);
      
      setHistoryStack(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setCanUndo(newHistory.length > 1);
      setCanRedo(false);
      
      const objectCount = canvas.getObjects().filter(obj => (obj as any).objectType !== 'grid').length;
      
      captureMessage(
        "Canvas state saved",
        "canvas-save-state",
        {
          tags: { component: "ConnectedDrawingCanvas", action: "saveState" },
          extra: { count: objectCount }
        }
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to save canvas state", { error: errorMsg });
      captureError(
        error as Error,
        "canvas-save-error"
      );
      toast.error(`Failed to save canvas state: ${errorMsg}`);
    }
  }, [canvas, historyStack, historyIndex]);

  // Undo last action
  const undo = useCallback(() => {
    if (!canvas || historyIndex <= 0) return;
    
    try {
      const prevState = historyStack[historyIndex - 1];
      const prevStateObj = JSON.parse(prevState);
      
      // Updated to use loadFromJSON correctly, callback is the second parameter
      canvas.loadFromJSON(prevStateObj, () => {
        canvas.renderAll();
        setHistoryIndex(historyIndex - 1);
        setCanUndo(historyIndex - 1 > 0);
        setCanRedo(true);
      });
      
      captureMessage(
        "Undo performed on canvas",
        "canvas-undo",
        {
          tags: { component: "ConnectedDrawingCanvas", action: "undo" }
        }
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to undo", { error: errorMsg });
      captureError(
        error as Error,
        "canvas-undo-error"
      );
      toast.error(`Failed to undo: ${errorMsg}`);
    }
  }, [canvas, historyStack, historyIndex]);

  // Redo last undone action
  const redo = useCallback(() => {
    if (!canvas || historyIndex >= historyStack.length - 1) return;
    
    try {
      const nextState = historyStack[historyIndex + 1];
      const nextStateObj = JSON.parse(nextState);
      
      // Updated to use loadFromJSON correctly, callback is the second parameter
      canvas.loadFromJSON(nextStateObj, () => {
        canvas.renderAll();
        setHistoryIndex(historyIndex + 1);
        setCanUndo(true);
        setCanRedo(historyIndex + 1 < historyStack.length - 1);
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to redo", { error: errorMsg });
      captureError(
        error as Error,
        "canvas-redo-error"
      );
      toast.error(`Failed to redo: ${errorMsg}`);
    }
  }, [canvas, historyStack, historyIndex]);

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
