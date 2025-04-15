import { useState, useRef, useCallback, useEffect } from 'react';
import { Canvas } from 'fabric';
import { requestOptimizedRender } from '@/utils/canvas/renderOptimizer';
import logger from '@/utils/logger';
import { toast } from 'sonner';

interface HistoryState {
  canvasState: string | null;
  userId: string;
  timestamp: number;
}

interface UsePerUserCanvasHistoryProps {
  canvas: Canvas | null;
  userId?: string;
  maxHistoryLength?: number;
}

/**
 * Hook for managing per-user canvas history for collaborative editing
 * Each user has their own independent undo/redo stack
 */
export const usePerUserCanvasHistory = ({
  canvas,
  userId = 'anonymous',
  maxHistoryLength = 30
}: UsePerUserCanvasHistoryProps) => {
  // Store history stacks per user
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const historyStackRef = useRef<HistoryState[]>([]);
  const isUndoRedoOperationRef = useRef<boolean>(false);
  
  // Save the current canvas state to history
  const saveCurrentState = useCallback(() => {
    if (!canvas) return;
    
    try {
      // Convert canvas to JSON string
      const canvasStateJson = JSON.stringify(canvas.toJSON());
      
      if (historyIndex >= 0) {
        // If we're not at the end of the history (user has undone some changes)
        // Remove all future states
        historyStackRef.current = historyStackRef.current.slice(0, historyIndex + 1);
      }
      
      // Check if we should add to history
      // Don't add if the current state is identical to the last state
      const currentStateLength = historyStackRef.current.length;
      
      if (
        currentStateLength === 0 ||
        historyStackRef.current[currentStateLength - 1].canvasState !== canvasStateJson
      ) {
        // Add new state to history
        historyStackRef.current.push({
          canvasState: canvasStateJson,
          userId,
          timestamp: Date.now()
        });
        
        // Limit history length to prevent memory issues
        if (historyStackRef.current.length > maxHistoryLength) {
          historyStackRef.current.shift();
        }
        
        setHistoryIndex(historyStackRef.current.length - 1);
        logger.info(`Canvas state saved for user ${userId}, index: ${historyStackRef.current.length - 1}`);
      }
    } catch (error) {
      logger.error('Error saving canvas state:', error);
    }
  }, [canvas, historyIndex, userId, maxHistoryLength]);
  
  // Undo action - move back in history
  const undo = useCallback(() => {
    if (!canvas || historyIndex <= 0) return;
    
    try {
      isUndoRedoOperationRef.current = true;
      
      // Go to previous state that belongs to current user
      let targetIndex = historyIndex - 1;
      
      // Find the last state that belongs to this user
      while (targetIndex >= 0) {
        if (historyStackRef.current[targetIndex].userId === userId) {
          break;
        }
        targetIndex--;
      }
      
      if (targetIndex < 0) {
        toast.info('No more actions to undo for this user');
        return;
      }
      
      // Apply the state
      const historyState = historyStackRef.current[targetIndex];
      if (historyState.canvasState) {
        canvas.loadFromJSON(JSON.parse(historyState.canvasState), () => {
          canvas.renderAll();
          setHistoryIndex(targetIndex);
          logger.info(`Canvas state restored from history for user ${userId}, index: ${targetIndex}`);
        });
      }
    } catch (error) {
      logger.error('Error during undo operation:', error);
    } finally {
      isUndoRedoOperationRef.current = false;
    }
  }, [canvas, historyIndex, userId]);
  
  // Redo action - move forward in history
  const redo = useCallback(() => {
    if (!canvas || historyIndex >= historyStackRef.current.length - 1) return;
    
    try {
      isUndoRedoOperationRef.current = true;
      
      // Go to next state that belongs to current user
      let targetIndex = historyIndex + 1;
      
      // Find the next state that belongs to this user
      while (targetIndex < historyStackRef.current.length) {
        if (historyStackRef.current[targetIndex].userId === userId) {
          break;
        }
        targetIndex++;
      }
      
      if (targetIndex >= historyStackRef.current.length) {
        toast.info('No more actions to redo for this user');
        return;
      }
      
      // Apply the state
      const historyState = historyStackRef.current[targetIndex];
      if (historyState.canvasState) {
        canvas.loadFromJSON(JSON.parse(historyState.canvasState), () => {
          canvas.renderAll();
          setHistoryIndex(targetIndex);
          logger.info(`Canvas state restored from history for user ${userId}, index: ${targetIndex}`);
        });
      }
    } catch (error) {
      logger.error('Error during redo operation:', error);
    } finally {
      isUndoRedoOperationRef.current = false;
    }
  }, [canvas, historyIndex, userId]);
  
  // Function to handle another user's state change
  const applyExternalStateChange = useCallback((
    canvasState: string,
    externalUserId: string,
    preserveSelection: boolean = false
  ) => {
    if (!canvas) return;
    
    try {
      // Keep track of current selection if needed
      const activeObject = preserveSelection ? canvas.getActiveObject() : null;
      
      // Add to history but don't apply if it's from another user
      historyStackRef.current.push({
        canvasState,
        userId: externalUserId,
        timestamp: Date.now()
      });
      
      // Limit history length
      if (historyStackRef.current.length > maxHistoryLength) {
        historyStackRef.current.shift();
      }
      
      setHistoryIndex(historyStackRef.current.length - 1);
      logger.info(`External canvas state saved for user ${externalUserId}`);
      
      // Apply the state to canvas if it's from another user
      canvas.loadFromJSON(JSON.parse(canvasState), () => {
        // Restore selection if needed
        if (activeObject && preserveSelection) {
          // Try to find the same object in the new state
          const objects = canvas.getObjects();
          const similarObject = objects.find(obj => 
            obj.type === activeObject.type
          );
          
          if (similarObject) {
            canvas.setActiveObject(similarObject);
          }
        }
        
        requestOptimizedRender(canvas, 'external-state-change');
      });
    } catch (error) {
      logger.error('Error applying external state change:', error);
    }
  }, [canvas, maxHistoryLength]);
  
  // Delete selected objects with history tracking
  const deleteSelectedObjects = useCallback(() => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    if (activeObject.type === 'activeSelection') {
      // @ts-ignore - activeSelection has forEachObject method
      activeObject.forEachObject((obj: any) => {
        canvas.remove(obj);
      });
      canvas.discardActiveObject();
    } else {
      canvas.remove(activeObject);
    }
    
    requestOptimizedRender(canvas, 'delete-selection');
    saveCurrentState();
  }, [canvas, saveCurrentState]);
  
  // Initialize with an empty state when canvas changes
  useEffect(() => {
    if (!canvas) return;
    
    // Save initial state
    if (historyStackRef.current.length === 0) {
      saveCurrentState();
    }
    
    // Update history when objects are added, modified, or removed
    const handleObjectModified = () => {
      if (!isUndoRedoOperationRef.current) {
        saveCurrentState();
      }
    };
    
    // Listen for canvas changes
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectModified);
    canvas.on('object:removed', handleObjectModified);
    
    return () => {
      // Remove event listeners
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:added', handleObjectModified);
      canvas.off('object:removed', handleObjectModified);
    };
  }, [canvas, saveCurrentState]);
  
  return {
    undo,
    redo,
    saveCurrentState,
    deleteSelectedObjects,
    applyExternalStateChange,
    historyIndex,
    historyLength: historyStackRef.current.length,
    hasUndo: historyIndex > 0,
    hasRedo: historyIndex < historyStackRef.current.length - 1
  };
};
