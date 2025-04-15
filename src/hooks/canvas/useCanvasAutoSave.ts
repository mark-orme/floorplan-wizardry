
import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useSupabaseFloorPlans } from '@/hooks/useSupabaseFloorPlans';
import logger from '@/utils/logger';
import { HISTORY_KEY } from './useCanvasPersistence';
import { FloorPlan } from '@/types/floorPlanTypes';

interface UseCanvasAutoSaveProps {
  canvas: FabricCanvas | null;
  historyStack: string[];
  historyIndex: number;
}

/**
 * Hook to handle auto-saving the canvas to Supabase
 */
export const useCanvasAutoSave = ({
  canvas,
  historyStack,
  historyIndex
}: UseCanvasAutoSaveProps) => {
  const { saveToSupabase, isLoggedIn } = useSupabaseFloorPlans();
  const syncTimeoutRef = useRef<number | null>(null);

  // Debounced sync with Supabase if user is logged in
  useEffect(() => {
    if (!canvas || !isLoggedIn || historyStack.length === 0) return;

    // Clear existing timeout
    if (syncTimeoutRef.current) {
      window.clearTimeout(syncTimeoutRef.current);
    }
    
    // Set new timeout for cloud sync
    syncTimeoutRef.current = window.setTimeout(() => {
      // Use the most recent canvas state for cloud sync
      const canvasState = JSON.parse(historyStack[historyIndex]);
      
      // We need to format this as a FloorPlan for Supabase
      const floorPlans: FloorPlan[] = [{ 
        data: canvasState,
        name: `Floor Plan (${new Date().toLocaleDateString()})`,
        id: HISTORY_KEY
      }];
      
      saveToSupabase(floorPlans);
      logger.debug("Canvas state synced to cloud");
    }, 5000); // Sync after 5 seconds of inactivity
    
    // Cleanup timeout on unmount/dependency change
    return () => {
      if (syncTimeoutRef.current) {
        window.clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [canvas, historyStack, historyIndex, isLoggedIn, saveToSupabase]);
};
