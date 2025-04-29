
/**
 * Hook for managing per-user canvas history
 */
import { Canvas } from 'fabric';

interface UsePerUserCanvasHistoryProps {
  canvas: Canvas | null;
  userId: string;
}

export const usePerUserCanvasHistory = ({ canvas, userId }: UsePerUserCanvasHistoryProps) => {
  return {
    undo: () => console.log(`User ${userId} undo`),
    redo: () => console.log(`User ${userId} redo`),
    saveCurrentState: () => console.log(`User ${userId} save state`),
    deleteSelectedObjects: () => console.log(`User ${userId} delete objects`),
  };
};
