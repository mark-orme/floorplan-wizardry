
import { useEffect, useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingTool } from '@/types/canvasStateTypes';

interface UseCanvasInteractionsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingTool;
  lineThickness: number;
  lineColor: string;
}

/**
 * Hook for managing canvas interactions
 * Handles drawing, selection, and other canvas interactivity
 * 
 * @param props Canvas interaction props
 * @returns Canvas interaction state and handlers
 */
export const useCanvasInteractions = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  tool: DrawingTool,
  lineThickness: number,
  lineColor: string
) => {
  const [currentZoom, setCurrentZoom] = useState<number>(1);
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  const [drawingState, setDrawingState] = useState(null);
  
  // Toggle snap to grid
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  // Handle tool changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Configure canvas based on selected tool
    if (tool === 'draw') {
      canvas.isDrawingMode = true;
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = lineThickness;
        canvas.freeDrawingBrush.color = lineColor;
      }
    } else {
      canvas.isDrawingMode = false;
    }
    
    canvas.requestRenderAll();
  }, [fabricCanvasRef, tool, lineThickness, lineColor]);
  
  // Update zoom when it changes
  const handleZoomChange = useCallback((zoom: number) => {
    setCurrentZoom(zoom);
  }, []);
  
  // Set up zoom change handler
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const updateZoom = () => {
      setCurrentZoom(canvas.getZoom());
    };
    
    canvas.on('zoom:changed', updateZoom);
    
    return () => {
      canvas.off('zoom:changed', updateZoom);
    };
  }, [fabricCanvasRef]);
  
  return {
    drawingState,
    currentZoom,
    toggleSnap,
    snapEnabled,
    handleZoomChange
  };
};
