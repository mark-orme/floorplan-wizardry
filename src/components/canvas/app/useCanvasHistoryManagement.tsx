
import { Canvas as FabricCanvas } from 'fabric';
import { useCanvasHistory } from '@/hooks/canvas/useCanvasHistory';
import { usePerUserCanvasHistory } from '@/hooks/usePerUserCanvasHistory';

interface UseCanvasHistoryManagementProps {
  fabricCanvas: FabricCanvas | null;
  userId: string;
  enableSync: boolean;
}

export const useCanvasHistoryManagement = ({
  fabricCanvas,
  userId,
  enableSync
}: UseCanvasHistoryManagementProps) => {
  // Set up per-user canvas history management when collaboration is enabled
  const perUserHistory = usePerUserCanvasHistory({
    canvas: fabricCanvas,
    userId: userId
  });
  
  // Set up regular canvas history when collaboration is disabled
  const regularHistory = useCanvasHistory();
  
  // Use the appropriate history management based on enableSync
  const undo = enableSync ? perUserHistory.undo : regularHistory.undo;
  const redo = enableSync ? perUserHistory.redo : regularHistory.redo;
  const saveCurrentState = enableSync ? perUserHistory.saveCurrentState : regularHistory.saveCurrentState;
  const historyDeleteSelectedObjects = enableSync ? perUserHistory.deleteSelectedObjects : regularHistory.deleteSelectedObjects;

  return {
    undo,
    redo,
    saveCurrentState,
    historyDeleteSelectedObjects
  };
};
