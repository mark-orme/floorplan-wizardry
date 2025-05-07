
import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { useDrawingContext } from '@/contexts/DrawingContext';

interface UseColorOperationsProps {
  canvas: FabricCanvas | null;
}

export const useColorOperations = ({ canvas }: UseColorOperationsProps) => {
  const { lineColor, setLineColor } = useDrawingContext();
  const [recentColors, setRecentColors] = useState<string[]>([
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'
  ]);

  const updateColor = useCallback((color: string | null) => {
    // Use default color if null
    const safeColor = color || '#000000'; // Default to black if null
    
    // Update context
    setLineColor(safeColor);
    
    // Update canvas brush if available
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = safeColor;
    }
    
    // Add to recent colors if not already present
    setRecentColors(prev => {
      if (prev.includes(safeColor)) {
        return prev;
      }
      return [safeColor, ...prev.slice(0, 4)];
    });
  }, [canvas, setLineColor]);

  const updateSelectedObjectsColor = useCallback((color: string) => {
    if (!canvas) return;
    
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) return;
    
    activeObjects.forEach(obj => {
      const fabricObj = obj as FabricObject & { stroke?: string; fill?: string };
      if (fabricObj.stroke !== undefined) {
        fabricObj.set('stroke', color);
      } else if (fabricObj.fill !== undefined && fabricObj.fill !== 'transparent') {
        fabricObj.set('fill', color);
      }
    });
    
    canvas.requestRenderAll();
    
    // Add to history if needed
    if (canvas.fire) {
      canvas.fire('object:modified', { target: activeObjects[0] });
    }
  }, [canvas]);

  return {
    currentColor: lineColor,
    recentColors,
    updateColor,
    updateSelectedObjectsColor
  };
};

export default useColorOperations;
