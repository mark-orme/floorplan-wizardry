
import { useCallback, useRef, useState, useEffect } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';

/**
 * Per-user canvas history management
 * Creates separate history stacks per user for collaborative editing
 */
interface UsePerUserCanvasHistoryProps {
  canvas: FabricCanvas | null;
  userId: string;
  maxHistoryLength?: number;
}

type HistoryState = {
  canvasState: string;
  timestamp: number;
  userId: string;
};

export function usePerUserCanvasHistory({
  canvas,
  userId,
  maxHistoryLength = 30
}: UsePerUserCanvasHistoryProps) {
  // Create a history map of user ID -> history stack
  const historyMapRef = useRef<Map<string, HistoryState[]>>(new Map());
  const futureMapRef = useRef<Map<string, HistoryState[]>>(new Map());
  
  // Current history pointer for this user
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Initialize user's history stack if needed
  useEffect(() => {
    if (!historyMapRef.current.has(userId)) {
      historyMapRef.current.set(userId, []);
    }
    if (!futureMapRef.current.has(userId)) {
      futureMapRef.current.set(userId, []);
    }
  }, [userId]);

  // Save the current canvas state to history
  const saveCurrentState = useCallback(() => {
    if (!canvas) return;
    
    try {
      // Get the user's history stack
      const userHistory = historyMapRef.current.get(userId) || [];
      
      // Serialize the canvas state
      const canvasState = JSON.stringify(canvas.toJSON(['id', 'objectType']));
      
      // Create a new history state
      const newState: HistoryState = {
        canvasState,
        timestamp: Date.now(),
        userId
      };
      
      // Add state to the user's history
      userHistory.push(newState);
      
      // Trim history if needed
      if (userHistory.length > maxHistoryLength) {
        userHistory.shift();
      }
      
      // Update history map
      historyMapRef.current.set(userId, userHistory);
      
      // Clear future states for this user
      futureMapRef.current.set(userId, []);
      
      // Update can undo/redo states
      setCanUndo(true);
      setCanRedo(false);
      
      logger.debug(`Saved history state for user ${userId}`);
    } catch (error) {
      logger.error('Error saving canvas state:', error);
    }
  }, [canvas, userId, maxHistoryLength]);

  // Undo action - apply previous state
  const undo = useCallback(() => {
    if (!canvas) return;
    
    // Get the user's history stack
    const userHistory = historyMapRef.current.get(userId) || [];
    
    if (userHistory.length <= 1) {
      toast.info('Nothing to undo');
      setCanUndo(false);
      return;
    }
    
    try {
      // Get the current state and move it to future
      const currentState = userHistory.pop();
      if (currentState) {
        const userFuture = futureMapRef.current.get(userId) || [];
        userFuture.push(currentState);
        futureMapRef.current.set(userId, userFuture);
      }
      
      // Apply the previous state
      const previousState = userHistory[userHistory.length - 1];
      if (previousState) {
        canvas.loadFromJSON(JSON.parse(previousState.canvasState), () => {
          canvas.renderAll();
          logger.debug(`Undo to state at ${new Date(previousState.timestamp).toLocaleString()}`);
        });
      }
      
      // Update can undo/redo states
      setCanUndo(userHistory.length > 1);
      setCanRedo(true);
      
      toast.success('Undo successful');
    } catch (error) {
      logger.error('Error during undo:', error);
      toast.error('Failed to undo');
    }
  }, [canvas, userId]);

  // Redo action - apply next state
  const redo = useCallback(() => {
    if (!canvas) return;
    
    // Get the user's future stack
    const userFuture = futureMapRef.current.get(userId) || [];
    
    if (userFuture.length === 0) {
      toast.info('Nothing to redo');
      setCanRedo(false);
      return;
    }
    
    try {
      // Get the next state
      const nextState = userFuture.pop();
      if (nextState) {
        // Apply the state
        canvas.loadFromJSON(JSON.parse(nextState.canvasState), () => {
          canvas.renderAll();
          logger.debug(`Redo to state at ${new Date(nextState.timestamp).toLocaleString()}`);
        });
        
        // Add to history
        const userHistory = historyMapRef.current.get(userId) || [];
        userHistory.push(nextState);
        historyMapRef.current.set(userId, userHistory);
      }
      
      // Update can undo/redo states
      setCanUndo(true);
      setCanRedo(userFuture.length > 0);
      
      toast.success('Redo successful');
    } catch (error) {
      logger.error('Error during redo:', error);
      toast.error('Failed to redo');
    }
  }, [canvas, userId]);
  
  // Delete selected objects and save state
  const deleteSelectedObjects = useCallback(() => {
    if (!canvas) return;
    
    const selectedObjects = canvas.getActiveObjects();
    if (selectedObjects.length === 0) {
      toast.info('No objects selected');
      return;
    }
    
    // Save current state before deletion
    saveCurrentState();
    
    // Delete objects
    canvas.discardActiveObject();
    selectedObjects.forEach((obj: FabricObject) => {
      canvas.remove(obj);
    });
    
    canvas.requestRenderAll();
    
    // Save state after deletion
    saveCurrentState();
    
    toast.success(`Deleted ${selectedObjects.length} object(s)`);
  }, [canvas, saveCurrentState]);

  return {
    undo,
    redo,
    saveCurrentState,
    deleteSelectedObjects,
    canUndo,
    canRedo
  };
}
