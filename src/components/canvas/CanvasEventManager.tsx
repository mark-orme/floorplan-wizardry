
import React from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

export interface CanvasEventManagerProps {
  canvas: FabricCanvas;
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  gridLayerRef: React.MutableRefObject<any[]>;
  saveCurrentState: () => void;
  undo: () => void;
  redo: () => void;
  deleteSelectedObjects: () => void;
  enableSync?: boolean;
  onDrawingComplete?: () => void;
}

export const CanvasEventManager: React.FC<CanvasEventManagerProps> = ({
  canvas,
  tool,
  lineColor,
  lineThickness,
  gridLayerRef,
  saveCurrentState,
  undo,
  redo,
  deleteSelectedObjects,
  enableSync = true,
  onDrawingComplete
}) => {
  // This component doesn't render anything visible
  // It just attaches event handlers to the canvas
  React.useEffect(() => {
    if (!canvas) return;
    
    console.log(`[CanvasEventManager] Setting up canvas with tool: ${tool}`);
    
    // Setup drawing mode based on tool
    canvas.isDrawingMode = tool === DrawingMode.DRAW || 
                          tool === DrawingMode.PENCIL;
    
    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
    }
    
    // Clean up function
    return () => {
      // Clean up event listeners when component unmounts
      console.log('[CanvasEventManager] Cleaning up event listeners');
    };
  }, [canvas, tool, lineColor, lineThickness]);
  
  return null;
};
