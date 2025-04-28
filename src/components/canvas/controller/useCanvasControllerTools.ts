import { MutableRefObject, useCallback } from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';
import { ExtendedFabricCanvas } from '@/types/canvas-types';

interface UseCanvasToolsProps {
  canvasRef: MutableRefObject<ExtendedFabricCanvas | null>;
  activeTool: DrawingMode;
  setActiveTool: (tool: DrawingMode) => void;
}

export const useCanvasControllerTools = ({
  canvasRef,
  activeTool,
  setActiveTool
}: UseCanvasToolsProps) => {
  const switchTool = useCallback((tool: DrawingMode) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Disable current tool
    canvas.isDrawingMode = false;
    canvas.selection = false;
    
    // Enable new tool
    switch (tool) {
      case DrawingMode.DRAW:
        canvas.isDrawingMode = true;
        break;
      case DrawingMode.SELECT:
        canvas.selection = true;
        break;
      case DrawingMode.PAN:
        // Enable panning logic here
        break;
      default:
        // Handle other tools
        break;
    }
    
    setActiveTool(tool);
    toast.info(`Switched to ${tool} tool`);
  }, [canvasRef, setActiveTool]);

  return { switchTool };
};
