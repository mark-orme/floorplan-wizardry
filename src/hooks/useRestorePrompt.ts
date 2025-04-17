
import { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { loadCanvasFromLocalStorage, clearSavedCanvasData } from '@/utils/autosave/canvasAutoSave';
import logger from '@/utils/logger';

interface UseRestorePromptProps {
  canvas: FabricCanvas | null;
  canvasId: string;
  onRestore: () => void;
}

/**
 * Hook to manage the canvas restore prompt
 */
export const useRestorePrompt = ({
  canvas,
  canvasId,
  onRestore
}: UseRestorePromptProps) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  
  // Check for saved data on mount
  useEffect(() => {
    if (!canvas) return;
    
    const savedTimestamp = localStorage.getItem('canvas_autosave_timestamp');
    if (!savedTimestamp) return;
    
    try {
      const savedDate = new Date(savedTimestamp);
      const now = new Date();
      
      // Calculate time difference
      const diffMs = now.getTime() - savedDate.getTime();
      
      // Only show prompt if saved less than 7 days ago
      if (diffMs > 7 * 24 * 60 * 60 * 1000) {
        clearSavedCanvasData();
        return;
      }
      
      // Calculate human-readable time elapsed
      let timeString = '';
      
      // Convert to seconds
      const diffSec = Math.floor(diffMs / 1000);
      
      if (diffSec < 60) {
        timeString = `${diffSec} seconds`;
      } else if (diffSec < 3600) {
        const minutes = Math.floor(diffSec / 60);
        timeString = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
      } else if (diffSec < 86400) {
        const hours = Math.floor(diffSec / 3600);
        timeString = `${hours} hour${hours !== 1 ? 's' : ''}`;
      } else {
        const days = Math.floor(diffSec / 86400);
        timeString = `${days} day${days !== 1 ? 's' : ''}`;
      }
      
      setTimeElapsed(timeString);
      setShowPrompt(true);
    } catch (error) {
      logger.error('Error calculating restore prompt time:', error);
    }
  }, [canvas, canvasId]);
  
  // Handle restore action
  const handleRestore = useCallback(() => {
    if (!canvas) return;
    
    setIsRestoring(true);
    
    try {
      const success = loadCanvasFromLocalStorage(canvas);
      
      if (success) {
        // If successful, call the onRestore callback
        onRestore();
      }
    } catch (error) {
      logger.error('Error restoring canvas:', error);
    } finally {
      setIsRestoring(false);
      setShowPrompt(false);
    }
  }, [canvas, onRestore]);
  
  // Handle dismiss action
  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    
    // Clear the saved data when dismissed
    clearSavedCanvasData();
  }, []);
  
  return {
    showPrompt,
    timeElapsed,
    isRestoring,
    handleRestore,
    handleDismiss
  };
};
