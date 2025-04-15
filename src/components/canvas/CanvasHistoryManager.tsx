
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { useCanvasHistory } from '@/hooks/useCanvasHistory';

interface CanvasHistoryManagerProps {
  canvas: FabricCanvas | null;
  onHistoryStateUpdate: (canUndo: boolean, canRedo: boolean) => void;
  onSaveRequired?: () => void;
}

/**
 * Manages undo/redo history for the canvas
 */
export const CanvasHistoryManager: React.FC<CanvasHistoryManagerProps> = ({
  canvas,
  onHistoryStateUpdate,
  onSaveRequired
}) => {
  // History for undo/redo
  const historyRef = useRef<{past: FabricObject[][], future: FabricObject[][]}>({
    past: [],
    future: []
  });
  
  // Initialize history manager
  const { saveCurrentState, undo, redo } = useCanvasHistory({
    fabricCanvasRef: { current: canvas },
    historyRef
  });

  // Update history state whenever it changes
  useEffect(() => {
    if (!canvas) return;
    
    // Function to update undo/redo state
    const updateHistoryState = () => {
      onHistoryStateUpdate(
        historyRef.current.past.length > 0,
        historyRef.current.future.length > 0
      );
    };

    // Listen for history state changes
    const handleObjectModified = () => {
      updateHistoryState();
    };

    const handleObjectAdded = () => {
      updateHistoryState();
    };

    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:modified', handleObjectModified);

    // Initial state update
    updateHistoryState();

    return () => {
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:modified', handleObjectModified);
    };
  }, [canvas, onHistoryStateUpdate]);

  // Enhanced undo function with state update
  const handleUndo = () => {
    undo();
    onHistoryStateUpdate(
      historyRef.current.past.length > 0,
      historyRef.current.future.length > 0
    );
    
    // Save the state after undoing
    if (onSaveRequired) {
      setTimeout(() => onSaveRequired(), 100);
    }
  };

  // Enhanced redo function with state update
  const handleRedo = () => {
    redo();
    onHistoryStateUpdate(
      historyRef.current.past.length > 0,
      historyRef.current.future.length > 0
    );
    
    // Save the state after redoing
    if (onSaveRequired) {
      setTimeout(() => onSaveRequired(), 100);
    }
  };

  // Return an empty fragment - this component only provides functionality
  return (
    <>{/* This component doesn't render anything visible */}</>
  );
};

// Export the functions for use in other components
export const useCanvasHistoryManager = (props: CanvasHistoryManagerProps) => {
  const historyRef = useRef<{past: FabricObject[][], future: FabricObject[][]}>({
    past: [],
    future: []
  });
  
  const { saveCurrentState, undo, redo } = useCanvasHistory({
    fabricCanvasRef: { current: props.canvas },
    historyRef
  });

  const handleUndo = () => {
    undo();
    props.onHistoryStateUpdate(
      historyRef.current.past.length > 0,
      historyRef.current.future.length > 0
    );
    
    if (props.onSaveRequired) {
      setTimeout(() => props.onSaveRequired(), 100);
    }
  };

  const handleRedo = () => {
    redo();
    props.onHistoryStateUpdate(
      historyRef.current.past.length > 0,
      historyRef.current.future.length > 0
    );
    
    if (props.onSaveRequired) {
      setTimeout(() => props.onSaveRequired(), 100);
    }
  };

  return {
    saveCurrentState,
    undo: handleUndo,
    redo: handleRedo
  };
};
