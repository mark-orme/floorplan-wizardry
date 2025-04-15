
import React, { useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useCanvasHistory } from '@/hooks/canvas/useCanvasHistory';
import { useCanvasKeyboardShortcuts } from '@/hooks/canvas/useCanvasKeyboardShortcuts';

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
  // Initialize history manager
  const { canUndo, canRedo, undo, redo } = useCanvasHistory({
    canvas
  });

  // Register keyboard shortcuts
  useCanvasKeyboardShortcuts({
    canvas,
    undo,
    redo
  });

  // Update parent component with undo/redo state
  useEffect(() => {
    onHistoryStateUpdate(canUndo, canRedo);
  }, [canUndo, canRedo, onHistoryStateUpdate]);

  // This component doesn't render anything visible
  return null;
};

// Export hook for direct use in other components
export const useCanvasHistoryManager = (props: CanvasHistoryManagerProps) => {
  const { canUndo, canRedo, undo, redo, saveCurrentState } = useCanvasHistory({
    canvas: props.canvas
  });

  const handleUndo = () => {
    undo();
    
    if (props.onSaveRequired) {
      setTimeout(() => props.onSaveRequired(), 100);
    }
  };

  const handleRedo = () => {
    redo();
    
    if (props.onSaveRequired) {
      setTimeout(() => props.onSaveRequired(), 100);
    }
  };

  // Add keyboard shortcuts
  useCanvasKeyboardShortcuts({
    canvas: props.canvas,
    undo: handleUndo,
    redo: handleRedo
  });

  return {
    canUndo,
    canRedo,
    undo: handleUndo,
    redo: handleRedo,
    saveCurrentState
  };
};
