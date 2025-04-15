
import { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { loadCanvasFromIDB } from '@/utils/storage/idbCanvasStore';
import { getTimeElapsedString } from '@/utils/datetime';

interface UseRestorePromptProps {
  canvas: FabricCanvas | null;
  canvasId?: string;
  onRestore?: (success: boolean) => void;
}

/**
 * Hook to manage restoration prompt for unsaved canvas
 */
export function useRestorePrompt({
  canvas,
  canvasId = 'default-canvas',
  onRestore
}: UseRestorePromptProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  
  // Check if there's a saved canvas to restore
  useEffect(() => {
    const checkForSavedCanvas = async () => {
      try {
        // Check if we have a saved canvas in IndexedDB
        const savedCanvasData = await loadCanvasFromIDB(`${canvasId}-timestamp`);
        
        if (savedCanvasData) {
          const savedDate = new Date(savedCanvasData);
          const elapsed = getTimeElapsedString(savedDate);
          setTimeElapsed(elapsed);
          setShowPrompt(true);
        }
      } catch (error) {
        console.error('Error checking for saved canvas:', error);
      }
    };
    
    // Wait a moment after component mount to check
    const timer = setTimeout(checkForSavedCanvas, 1500);
    return () => clearTimeout(timer);
  }, [canvasId]);
  
  // Handle restore action
  const handleRestore = useCallback(async () => {
    if (!canvas) return;
    
    setIsRestoring(true);
    
    try {
      const json = await loadCanvasFromIDB(canvasId);
      
      if (json) {
        // Store grid objects to preserve them
        const gridObjects = canvas.getObjects().filter(obj => (obj as any).objectType === 'grid');
        
        // Load the saved state
        canvas.loadFromJSON(json, () => {
          // Restore grid objects
          gridObjects.forEach(obj => canvas.add(obj));
          
          // Send grid objects to back
          gridObjects.forEach(obj => canvas.sendToBack(obj));
          
          canvas.renderAll();
          onRestore?.(true);
        });
      } else {
        onRestore?.(false);
      }
    } catch (error) {
      console.error('Error restoring canvas:', error);
      onRestore?.(false);
    } finally {
      setIsRestoring(false);
      setShowPrompt(false);
    }
  }, [canvas, canvasId, onRestore]);
  
  // Handle dismiss action
  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
  }, []);
  
  return {
    showPrompt,
    timeElapsed,
    isRestoring,
    handleRestore,
    handleDismiss
  };
}
