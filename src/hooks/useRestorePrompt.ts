
import { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useLocalStorage } from './useLocalStorage';

interface UseRestorePromptProps {
  canvas: FabricCanvas | null;
  canvasId: string;
  onRestore: () => void;
}

export const useRestorePrompt = ({
  canvas,
  canvasId,
  onRestore
}: UseRestorePromptProps) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  
  // Storage keys based on canvas ID
  const timestampKey = `canvas_timestamp_${canvasId}`;
  
  // Use local storage hook to check for saved timestamp
  const [savedTimestamp] = useLocalStorage<string | null>(timestampKey, null);
  
  // Check if we should show the restore prompt
  useEffect(() => {
    const checkForRestore = async () => {
      if (!canvas || !savedTimestamp) return;
      
      try {
        const savedDate = new Date(savedTimestamp);
        const now = new Date();
        const diffMs = now.getTime() - savedDate.getTime();
        
        // If the save is less than 5 minutes old, don't show the prompt
        if (diffMs < 5 * 60 * 1000) return;
        
        // Format the time elapsed string
        setTimeElapsed(formatTimeElapsed(diffMs));
        
        // Show the prompt
        setShowPrompt(true);
      } catch (error) {
        console.error('Error checking for restore:', error);
      }
    };
    
    // Check after a short delay to allow the application to initialize
    const timer = setTimeout(() => {
      checkForRestore();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [canvas, canvasId, savedTimestamp]);
  
  // Handle restore button click
  const handleRestore = useCallback(() => {
    if (!canvas) return;
    
    setIsRestoring(true);
    
    // Call the provided restore function
    onRestore();
    
    // Hide the prompt after restoration
    setShowPrompt(false);
    setIsRestoring(false);
  }, [canvas, onRestore]);
  
  // Handle dismiss button click
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
};

// Helper function to format time elapsed
function formatTimeElapsed(diffMs: number): string {
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) {
    return `${diffSec} seconds`;
  }
  
  const diffMin = Math.floor(diffSec / 60);
  
  if (diffMin < 60) {
    return `${diffMin} minute${diffMin !== 1 ? 's' : ''}`;
  }
  
  const diffHour = Math.floor(diffMin / 60);
  
  if (diffHour < 24) {
    return `${diffHour} hour${diffHour !== 1 ? 's' : ''}`;
  }
  
  const diffDay = Math.floor(diffHour / 24);
  
  return `${diffDay} day${diffDay !== 1 ? 's' : ''}`;
}
