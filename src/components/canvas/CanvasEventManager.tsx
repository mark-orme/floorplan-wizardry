
import React, { useEffect } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useStraightLineTool } from '@/hooks/straightLineTool/useStraightLineTool';
import { useDrawingContext } from '@/contexts/DrawingContext';

interface CanvasEventManagerProps {
  canvas: FabricCanvas;
  tool: DrawingMode;
  lineThickness: number;
  lineColor: string;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  saveCurrentState?: () => void;
  undo?: () => void;
  redo?: () => void;
  deleteSelectedObjects?: () => void;
  enableSync?: boolean;
  onDrawingComplete?: () => void;
}

export const CanvasEventManager: React.FC<CanvasEventManagerProps> = ({
  canvas,
  tool,
  lineThickness,
  lineColor,
  gridLayerRef,
  saveCurrentState = () => {},
  undo,
  redo,
  deleteSelectedObjects,
  enableSync = true,
  onDrawingComplete
}) => {
  const { setActiveTool } = useDrawingContext();
  
  // Hook for straight line tool
  const straightLineTool = useStraightLineTool({
    canvas,
    enabled: tool === DrawingMode.STRAIGHT_LINE,
    lineColor,
    lineThickness,
    saveCurrentState
  });
  
  // Update active tool in context when it changes
  useEffect(() => {
    setActiveTool(tool);
  }, [tool, setActiveTool]);
  
  // Tool-specific setup
  useEffect(() => {
    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    canvas.selection = tool === DrawingMode.SELECT;
    
    if (tool === DrawingMode.SELECT) {
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'move';
      
      // Make objects selectable
      canvas.getObjects().forEach(obj => {
        if ((obj as any).objectType !== 'grid') {
          obj.selectable = true;
        }
      });
    } else {
      // For drawing tools
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
      
      // Make objects non-selectable during drawing
      canvas.getObjects().forEach(obj => {
        obj.selectable = false;
      });
    }
    
    canvas.renderAll();
    
    return () => {
      // Cleanup
    };
  }, [canvas, tool]);
  
  return null;
};
