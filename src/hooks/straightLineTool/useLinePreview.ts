
import { useRef, useCallback } from 'react';
import { Canvas as FabricCanvas, Line, Circle } from 'fabric';
import { Point } from '@/types/core/Point';

/**
 * Hook for creating and managing line previews during drawing
 */
export const useLinePreview = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  isDrawing: boolean,
  snapEnabled: boolean,
  anglesEnabled: boolean,
  lineColor: string,
  lineThickness: number
) => {
  // References to preview objects
  const previewLineRef = useRef<Line | null>(null);
  const hoverIndicatorRef = useRef<Circle | null>(null);
  
  /**
   * Show hover indicator at point
   */
  const showHoverIndicator = useCallback((point: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove existing indicator if any
    if (hoverIndicatorRef.current) {
      canvas.remove(hoverIndicatorRef.current);
    }
    
    // Create new indicator
    const indicator = new Circle({
      left: point.x - 5,
      top: point.y - 5,
      radius: 5,
      fill: lineColor,
      stroke: '#ffffff',
      strokeWidth: 2,
      selectable: false,
      evented: false,
      originX: 'center',
      originY: 'center'
    });
    
    canvas.add(indicator);
    canvas.renderAll();
    
    hoverIndicatorRef.current = indicator;
  }, [fabricCanvasRef, lineColor]);
  
  /**
   * Hide hover indicator
   */
  const hideHoverIndicator = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !hoverIndicatorRef.current) return;
    
    canvas.remove(hoverIndicatorRef.current);
    canvas.renderAll();
    
    hoverIndicatorRef.current = null;
  }, [fabricCanvasRef]);
  
  /**
   * Update line preview
   */
  const updateLinePreview = useCallback((startPoint: Point, endPoint: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    // Apply constraints
    let finalEndPoint = { ...endPoint };
    
    // Remove existing preview if any
    if (previewLineRef.current) {
      canvas.remove(previewLineRef.current);
    }
    
    // Create new preview line
    const previewLine = new Line([
      startPoint.x, 
      startPoint.y, 
      finalEndPoint.x, 
      finalEndPoint.y
    ], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false
    });
    
    canvas.add(previewLine);
    canvas.renderAll();
    
    previewLineRef.current = previewLine;
    
    return {
      startPoint,
      endPoint: finalEndPoint
    };
  }, [fabricCanvasRef, lineColor, lineThickness]);
  
  /**
   * Clear line preview
   */
  const clearLinePreview = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !previewLineRef.current) return;
    
    canvas.remove(previewLineRef.current);
    canvas.renderAll();
    
    previewLineRef.current = null;
  }, [fabricCanvasRef]);
  
  return {
    showHoverIndicator,
    hideHoverIndicator,
    updateLinePreview,
    clearLinePreview
  };
};
