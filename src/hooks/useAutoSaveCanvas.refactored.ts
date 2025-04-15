
/**
 * Refactored version of useAutoSaveCanvas
 * Uses the modular hooks approach
 * @module hooks/useAutoSaveCanvas
 */
import { Canvas as FabricCanvas } from 'fabric';
import { useCanvasAutoSave } from './canvas/useCanvasAutoSave';
import { useCanvasRestoreCheck } from './canvas/useCanvasRestoreCheck';

interface UseAutoSaveCanvasProps {
  canvas: FabricCanvas | null;
  canvasId: string;
  debounceMs?: number;
  onSave?: (success: boolean) => void;
  onRestore?: (success: boolean) => void;
}

/**
 * Hook for automatic canvas saving and restoring
 * Provides both localStorage and IndexedDB persistence options
 */
export const useAutoSaveCanvas = ({
  canvas,
  canvasId,
  debounceMs = 2000,
  onSave,
  onRestore
}: UseAutoSaveCanvasProps) => {
  // Check if we have saved data to restore
  const { canRestore } = useCanvasRestoreCheck({ canvasId });
  
  // Set up auto-save functionality
  const {
    isSaving,
    isLoading,
    lastSaved,
    saveCanvas,
    restoreCanvas,
    clearSavedCanvas
  } = useCanvasAutoSave({
    canvas,
    canvasId,
    debounceMs,
    onSave,
    onRestore
  });
  
  return {
    isSaving,
    isLoading,
    lastSaved,
    canRestore,
    saveCanvas,
    restoreCanvas,
    clearSavedCanvas
  };
};
