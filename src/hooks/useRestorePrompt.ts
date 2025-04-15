
/**
 * Hook for handling canvas restore prompts
 * @module hooks/useRestorePrompt
 */
import { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useLocalStorage } from './useLocalStorage';
import { toast } from 'sonner';

interface UseRestorePromptProps {
  canvas: FabricCanvas | null;
  canvasId: string;
  onRestore?: (success: boolean) => void;
}

/**
 * Hook for handling canvas restore prompts
 */
export const useRestorePrompt = ({
  canvas,
  canvasId,
  onRestore
}: UseRestorePromptProps) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  
  // Storage keys based on canvas ID
  const canvasKey = `canvas_state_${canvasId}`;
  const timestampKey = `canvas_timestamp_${canvasId}`;
  
  // Use local storage to check for saved data
  const [savedCanvas] = useLocalStorage<string | null>(canvasKey, null);
  const [savedTimestamp] = useLocalStorage<string | null>(timestampKey, null);
  
  // Check if we have data to restore on mount
  useEffect(() => {
    if (savedCanvas && savedTimestamp) {
      const savedDate = new Date(savedTimestamp);
      const now = new Date();
      const diffMs = now.getTime() - savedDate.getTime();
      
      // Only show prompt if the saved data is less than 7 days old
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      
      if (diffMs < maxAge) {
        setShowPrompt(true);
      }
    }
  }, [savedCanvas, savedTimestamp]);
  
  // Format time elapsed since save
  const getTimeElapsed = useCallback(() => {
    if (!savedTimestamp) return '';
    
    const savedDate = new Date(savedTimestamp);
    const now = new Date();
    const diffMs = now.getTime() - savedDate.getTime();
    
    // Convert to minutes
    const diffMin = Math.floor(diffMs / 60000);
    
    if (diffMin < 60) {
      return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    }
    
    // Convert to hours
    const diffHour = Math.floor(diffMin / 60);
    
    if (diffHour < 24) {
      return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    }
    
    // Convert to days
    const diffDay = Math.floor(diffHour / 24);
    
    return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
  }, [savedTimestamp]);
  
  // Restore saved canvas
  const handleRestore = useCallback(() => {
    if (!canvas || !savedCanvas) return;
    
    try {
      setIsRestoring(true);
      
      // Store grid objects to preserve them
      const gridObjects = canvas.getObjects().filter(obj => (obj as any).objectType === 'grid');
      
      // Load the saved state
      canvas.loadFromJSON(JSON.parse(savedCanvas), () => {
        // Restore grid objects
        gridObjects.forEach(obj => canvas.add(obj));
        
        // Send grid objects to back
        gridObjects.forEach(obj => canvas.sendToBack(obj));
        
        canvas.renderAll();
        toast.success('Your drawing has been restored');
        
        if (onRestore) onRestore(true);
        setShowPrompt(false);
      });
    } catch (error) {
      console.error('Error restoring canvas:', error);
      toast.error('Failed to restore your drawing');
      
      if (onRestore) onRestore(false);
    } finally {
      setIsRestoring(false);
    }
  }, [canvas, savedCanvas, onRestore]);
  
  // Dismiss the prompt
  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
  }, []);
  
  return {
    showPrompt,
    isRestoring,
    timeElapsed: getTimeElapsed(),
    handleRestore,
    handleDismiss
  };
};
