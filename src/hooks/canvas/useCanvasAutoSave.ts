
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

export const useCanvasAutoSave = ({
  canvas,
  historyStack,
  historyIndex
}: UseCanvasAutoSaveProps) => {
  const { saveToSupabase, isLoggedIn } = useSupabaseFloorPlans();
  const syncTimeoutRef = useRef<number | null>(null);
  const lastSaveRef = useRef<string | null>(null);

  // Debounced sync with Supabase if user is logged in
  useEffect(() => {
    if (!canvas || !isLoggedIn || historyStack.length === 0) return;

    // Don't sync if content hasn't changed
    const currentState = historyStack[historyIndex];
    if (currentState === lastSaveRef.current) return;

    // Clear existing timeout
    if (syncTimeoutRef.current) {
      window.clearTimeout(syncTimeoutRef.current);
    }
    
    // Set new timeout for cloud sync
    syncTimeoutRef.current = window.setTimeout(() => {
      // Use the most recent canvas state for cloud sync
      const canvasState = JSON.parse(historyStack[historyIndex]);
      
      // Format as a FloorPlan for Supabase
      const floorPlan: FloorPlan = {
        id: HISTORY_KEY,
        name: `Floor Plan (${new Date().toLocaleDateString()})`,
        label: `Floor Plan (${new Date().toLocaleDateString()})`,
        walls: [],
        rooms: [],
        strokes: [],
        canvasData: null,
        canvasJson: canvasState,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        gia: 0,
        level: 0,
        index: 0,
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          paperSize: 'A4',
          level: 0
        }
      };
      
      saveToSupabase([floorPlan]);
      lastSaveRef.current = currentState;
      logger.debug("Canvas state synced to cloud");
    }, 5000); // Sync after 5 seconds of inactivity
    
    // Cleanup timeout on unmount/dependency change
    return () => {
      if (syncTimeoutRef.current) {
        window.clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [canvas, historyStack, historyIndex, isLoggedIn, saveToSupabase]);

  return {
    lastSaveRef
  };
};
