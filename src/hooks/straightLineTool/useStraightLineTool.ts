
import { useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point, pointsEqual } from '@/types/core/Point';
import { useLineToolState } from './useLineToolState';

interface UseStraightLineToolProps {
  canvas: FabricCanvas | null;
  lineColor: string;
  lineThickness: number;
  enabled: boolean;
  showMeasurements?: boolean;
  gridSnap?: boolean;
  gridSize?: number;
  onLineComplete?: (start: Point, end: Point) => void;
}

export const useStraightLineTool = ({
  canvas,
  lineColor,
  lineThickness,
  enabled,
  showMeasurements = true,
  gridSnap = false,
  gridSize = 20,
  onLineComplete
}: UseStraightLineToolProps) => {
  const [activeLine, setActiveLine] = useState<Line | null>(null);
  const [measurementLabel, setMeasurementLabel] = useState<any | null>(null);
  
  const { lineState, startLine, updateLine, completeLine, cancelLine, clearLines } = useLineToolState({
    snapToGrid: gridSnap,
    gridSize
  });
  
  // Handle mouse down - start line drawing
  const handleMouseDown = useCallback((e: any) => {
    if (!canvas || !enabled) return;
    
    const pointer = canvas.getPointer(e.e);
    startLine({ x: pointer.x, y: pointer.y });
    
    // Create initial line
    const line = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      strokeLineCap: 'round',
      strokeLineJoin: 'round',
      selectable: false,
      evented: false,
    });
    
    canvas.add(line);
    setActiveLine(line);
    
    // Create measurement label if needed
    if (showMeasurements) {
      const text = canvas.getElement().ownerDocument.createElement('div');
      text.style.position = 'absolute';
      text.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
      text.style.color = 'white';
      text.style.padding = '4px 8px';
      text.style.borderRadius = '4px';
      text.style.fontSize = '12px';
      text.style.pointerEvents = 'none';
      text.style.zIndex = '1000';
      text.textContent = '0 px';
      
      canvas.getElement().parentNode?.appendChild(text);
      setMeasurementLabel(text);
    }
  }, [canvas, enabled, lineColor, lineThickness, showMeasurements, startLine]);
  
  // Handle mouse move - update line
  const handleMouseMove = useCallback((e: any) => {
    if (!canvas || !enabled || !lineState.isActive || !activeLine) return;
    
    const pointer = canvas.getPointer(e.e);
    updateLine({ x: pointer.x, y: pointer.y });
    
    // Update line position
    if (lineState.points.length >= 1) {
      const startPoint = lineState.points[0];
      activeLine.set({
        x1: startPoint.x,
        y1: startPoint.y,
        x2: pointer.x,
        y2: pointer.y
      });
      canvas.renderAll();
      
      // Update measurement label
      if (measurementLabel) {
        const length = Math.sqrt(
          Math.pow(pointer.x - startPoint.x, 2) +
          Math.pow(pointer.y - startPoint.y, 2)
        );
        
        measurementLabel.textContent = `${Math.round(length)} px`;
        measurementLabel.style.left = `${(startPoint.x + pointer.x) / 2}px`;
        measurementLabel.style.top = `${(startPoint.y + pointer.y) / 2 - 20}px`;
      }
    }
  }, [canvas, enabled, activeLine, lineState, updateLine, measurementLabel]);
  
  // Handle mouse up - complete line
  const handleMouseUp = useCallback(() => {
    if (!canvas || !enabled || !lineState.isActive) return;
    
    completeLine();
    
    // Call the completion callback
    if (onLineComplete && lineState.points.length >= 2) {
      onLineComplete(lineState.points[0], lineState.points[1]);
    }
    
    // Reset active line
    setActiveLine(null);
    
    // Remove measurement label
    if (measurementLabel) {
      measurementLabel.remove();
      setMeasurementLabel(null);
    }
  }, [canvas, enabled, lineState, completeLine, onLineComplete, measurementLabel]);
  
  // Set up event handlers when tool is enabled
  useEffect(() => {
    if (!canvas || !enabled) return;
    
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    
    // Set cursor and mode
    canvas.defaultCursor = 'crosshair';
    canvas.selection = false;
    canvas.isDrawingMode = false;
    
    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
      
      // Reset cursor
      canvas.defaultCursor = 'default';
      canvas.selection = true;
      
      // Clean up any active elements
      if (activeLine && canvas.contains(activeLine)) {
        canvas.remove(activeLine);
      }
      
      if (measurementLabel) {
        measurementLabel.remove();
      }
    };
  }, [canvas, enabled, handleMouseDown, handleMouseMove, handleMouseUp, activeLine, measurementLabel]);
  
  return {
    lineState,
    clearLines,
    cancelLine
  };
};

export default useStraightLineTool;
