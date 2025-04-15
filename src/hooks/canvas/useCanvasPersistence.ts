
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { saveCanvasHistory, loadCanvasHistory } from '@/utils/storage/historyStorage';
import { toast } from 'sonner';
import logger from '@/utils/logger';
import { captureMessage, captureError } from '@/utils/sentry';

// History key for storage
export const HISTORY_KEY = 'canvas-v1';

interface UseCanvasPersistenceProps {
  canvas: FabricCanvas | null;
  historyStack: string[];
  historyIndex: number;
  onHistoryLoaded: (history: string[], index: number) => void;
}

/**
 * Hook for persisting canvas history to storage
 */
export const useCanvasPersistence = ({
  canvas,
  historyStack,
  historyIndex,
  onHistoryLoaded
}: UseCanvasPersistenceProps) => {
  const initialLoadDoneRef = useRef(false);

  // Load initial history from storage
  useEffect(() => {
    if (!canvas || initialLoadDoneRef.current) return;

    const loadInitialHistory = async () => {
      try {
        const savedHistory = await loadCanvasHistory(HISTORY_KEY);
        
        if (savedHistory && savedHistory.length > 0) {
          // Load the history into state management
          onHistoryLoaded(savedHistory, savedHistory.length - 1);
          
          // Load the last state into the canvas
          const lastState = savedHistory[savedHistory.length - 1];
          const lastStateObj = JSON.parse(lastState);
          
          canvas.loadFromJSON(lastStateObj, () => {
            canvas.renderAll();
            logger.debug("Restored canvas from saved history");
            captureMessage("Canvas restored from history", "canvas-restore");
          });
        }
        
        initialLoadDoneRef.current = true;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        logger.error("Failed to load history", { error: errorMsg });
        captureError(error as Error, "history-load-error");
        toast.error(`Failed to load history: ${errorMsg}`);
        
        initialLoadDoneRef.current = true;
      }
    };
    
    loadInitialHistory();
  }, [canvas, onHistoryLoaded]);

  // Persist history to storage when it changes
  const persistHistory = useCallback(async () => {
    if (historyStack.length === 0) return;
    
    try {
      await saveCanvasHistory(HISTORY_KEY, historyStack);
      logger.debug(`Persisted ${historyStack.length} history states`);
    } catch (error) {
      logger.error("Failed to persist history", { error });
      // Don't show a toast for this error to avoid overwhelming the user
    }
  }, [historyStack]);

  useEffect(() => {
    if (historyStack.length > 0) {
      persistHistory();
    }
  }, [historyStack, historyIndex, persistHistory]);

  return {
    persistHistory
  };
};
