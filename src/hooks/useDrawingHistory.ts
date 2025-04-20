
import { useCallback, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

export interface UseDrawingHistoryProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  historyRef: React.MutableRefObject<{
    past: any[][];
    future: any[][];
  }>;
  gridLayerRef?: React.MutableRefObject<FabricObject[]>;
  clearDrawings?: () => void;
  recalculateGIA?: () => void;
}

export interface UseDrawingHistoryResult {
  canUndo: boolean;
  canRedo: boolean;
  handleUndo: () => void;
  handleRedo: () => void;
  saveCurrentState: () => void;
}

export const useDrawingHistory = ({
  fabricCanvasRef,
  historyRef,
  gridLayerRef,
  clearDrawings,
  recalculateGIA
}: UseDrawingHistoryProps): UseDrawingHistoryResult => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const saveCurrentState = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Serialize the canvas objects
    const currentObjects = canvas.getObjects().filter(obj => {
      // Skip grid objects
      return (obj as any).objectType !== 'grid';
    });

    const serializedObjects = currentObjects.map(obj => {
      return canvas.toJSON(['objectType', 'id']).objects.find(
        (o: any) => o.objectID === (obj as any).objectID
      );
    });

    // Add current state to past and clear future
    historyRef.current.past.push(serializedObjects);
    historyRef.current.future = [];

    // Update state
    setCanUndo(historyRef.current.past.length > 0);
    setCanRedo(historyRef.current.future.length > 0);
  }, [fabricCanvasRef, historyRef]);

  const handleUndo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || historyRef.current.past.length === 0) return;

    // Remove all non-grid objects
    const nonGridObjects = canvas.getObjects().filter(
      obj => (obj as any).objectType !== 'grid'
    );
    
    if (nonGridObjects.length > 0) {
      // Save current state to future history
      const serializedObjects = nonGridObjects.map(obj => {
        return canvas.toJSON(['objectType', 'id']).objects.find(
          (o: any) => o.objectID === (obj as any).objectID
        );
      });
      historyRef.current.future.unshift(serializedObjects);
    }

    // Remove all non-grid objects
    canvas.remove(...nonGridObjects);

    // Restore previous state
    const previousState = historyRef.current.past.pop();
    if (previousState && previousState.length > 0) {
      canvas.loadFromJSON({ objects: previousState }, () => {
        canvas.requestRenderAll();
        if (recalculateGIA) {
          recalculateGIA();
        }
      });
    }

    // Update state
    setCanUndo(historyRef.current.past.length > 0);
    setCanRedo(true);
  }, [fabricCanvasRef, historyRef, recalculateGIA]);

  const handleRedo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || historyRef.current.future.length === 0) return;

    // Remove all non-grid objects
    const nonGridObjects = canvas.getObjects().filter(
      obj => (obj as any).objectType !== 'grid'
    );
    
    if (nonGridObjects.length > 0) {
      // Save current state to past history
      const serializedObjects = nonGridObjects.map(obj => {
        return canvas.toJSON(['objectType', 'id']).objects.find(
          (o: any) => o.objectID === (obj as any).objectID
        );
      });
      historyRef.current.past.push(serializedObjects);
    }

    // Remove all non-grid objects
    canvas.remove(...nonGridObjects);

    // Restore next state
    const nextState = historyRef.current.future.shift();
    if (nextState && nextState.length > 0) {
      canvas.loadFromJSON({ objects: nextState }, () => {
        canvas.requestRenderAll();
        if (recalculateGIA) {
          recalculateGIA();
        }
      });
    }

    // Update state
    setCanUndo(true);
    setCanRedo(historyRef.current.future.length > 0);
  }, [fabricCanvasRef, historyRef, recalculateGIA]);

  return {
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
    saveCurrentState
  };
};
