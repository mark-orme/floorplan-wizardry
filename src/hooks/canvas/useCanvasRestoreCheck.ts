
/**
 * Canvas restore check hook
 * Checks if there is saved canvas data available to restore
 */
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { loadCanvasFromIDB } from '@/utils/storage/idbCanvasStore';

interface UseCanvasRestoreCheckProps {
  canvasId: string;
}

/**
 * Hook to check if canvas data is available for restoration
 */
export function useCanvasRestoreCheck({ canvasId }: UseCanvasRestoreCheckProps) {
  const [canRestore, setCanRestore] = useState(false);
  
  const canvasKey = `canvas_state_${canvasId}`;
  const timestampKey = `canvas_timestamp_${canvasId}`;
  
  const [savedCanvas] = useLocalStorage<string | null>(canvasKey, null);
  const [savedTimestamp] = useLocalStorage<string | null>(timestampKey, null);
  
  // Check if we have data to restore from either localStorage or IndexedDB
  useEffect(() => {
    const checkCanRestore = async () => {
      // First check localStorage
      if (savedCanvas && savedTimestamp) {
        setCanRestore(true);
        return;
      }
      
      // Then check IndexedDB
      try {
        const idbData = await loadCanvasFromIDB(canvasId);
        if (idbData) {
          setCanRestore(true);
        }
      } catch (error) {
        console.error('Error checking IndexedDB for canvas data:', error);
      }
    };
    
    checkCanRestore();
  }, [savedCanvas, savedTimestamp, canvasId]);
  
  return { canRestore };
}
