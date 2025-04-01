
export interface UseDrawingHistoryProps {
  fabricCanvasRef: React.MutableRefObject<Canvas | null>;
  gridLayerRef: React.MutableRefObject<any[]>;
  historyRef: React.MutableRefObject<{
    past: any[][];
    future: any[][];
  }>;
  clearDrawings?: () => void;
  recalculateGIA?: () => void;
}

export interface UseDrawingHistoryResult {
  handleUndo: () => void;
  handleRedo: () => void;
  saveCurrentState: () => void;
  canUndo: boolean;
  canRedo: boolean;
}
