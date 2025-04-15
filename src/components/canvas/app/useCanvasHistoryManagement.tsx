
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
  const { 
    undo: perUserUndo, 
    redo: perUserRedo, 
    saveCurrentState: perUserSaveState,
    deleteSelectedObjects: perUserDeleteSelectedObjects
  } = usePerUserCanvasHistory({
    canvas: fabricCanvas,
    userId: userId
  });
  
  // Set up regular canvas history when collaboration is disabled
  const { 
    undo: regularUndo, 
    redo: regularRedo, 
    saveCurrentState: regularSaveState,
    deleteSelectedObjects: regularDeleteSelectedObjects
  } = useCanvasHistory({
    canvas: fabricCanvas
  });
  
  // Use the appropriate history management based on enableSync
  const undo = enableSync ? perUserUndo : regularUndo;
  const redo = enableSync ? perUserRedo : regularRedo;
  const saveCurrentState = enableSync ? perUserSaveState : regularSaveState;
  const historyDeleteSelectedObjects = enableSync ? perUserDeleteSelectedObjects : regularDeleteSelectedObjects;

  return {
    undo,
    redo,
    saveCurrentState,
    historyDeleteSelectedObjects
  };
};
