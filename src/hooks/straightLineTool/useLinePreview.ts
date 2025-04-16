
import { useRef, useCallback } from 'react';
import { Canvas as FabricCanvas, Line, Circle } from 'fabric';
import { Point } from '@/types/core/Point';
import { getCanvas, safeRender, defaultFabricOptions } from '@/utils/canvas';

/**
 * Result of line preview update
 */
export interface LinePreviewResult {
  startPoint: Point;
  endPoint: Point;
  isSnapped: boolean;
}

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
    const canvas = getCanvas(fabricCanvasRef);
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
      ...defaultFabricOptions,
      originX: 'center',
      originY: 'center'
    });
    
    canvas.add(indicator);
    safeRender(canvas);
    
    hoverIndicatorRef.current = indicator;
  }, [fabricCanvasRef, lineColor]);
  
  /**
   * Hide hover indicator
   */
  const hideHoverIndicator = useCallback(() => {
    const canvas = getCanvas(fabricCanvasRef);
    if (!canvas || !hoverIndicatorRef.current) return;
    
    canvas.remove(hoverIndicatorRef.current);
    safeRender(canvas);
    
    hoverIndicatorRef.current = null;
  }, [fabricCanvasRef]);
  
  /**
   * Update line preview
   * @returns LinePreviewResult with start, end points and snap status
   */
  const updateLinePreview = useCallback((startPoint: Point, endPoint: Point): LinePreviewResult => {
    const canvas = getCanvas(fabricCanvasRef);
    if (!canvas) {
      return { startPoint, endPoint, isSnapped: false };
    }
    
    // Apply constraints
    let finalEndPoint = { ...endPoint };
    let isSnapped = false;
    
    // Apply snapping logic if enabled
    if (snapEnabled) {
      // Simple grid snapping (10px grid)
      const gridSize = 10;
      const snappedX = Math.round(finalEndPoint.x / gridSize) * gridSize;
      const snappedY = Math.round(finalEndPoint.y / gridSize) * gridSize;
      
      finalEndPoint = { x: snappedX, y: snappedY };
      isSnapped = snappedX !== endPoint.x || snappedY !== endPoint.y;
    }
    
    // Apply angle constraints if enabled
    if (anglesEnabled && startPoint) {
      // Implement angle constraints logic here
      // For example, constrain to 45-degree angles
      if (anglesEnabled) {
        const dx = endPoint.x - startPoint.x;
        const dy = endPoint.y - startPoint.y;
        const angle = Math.atan2(dy, dx);
        
        // Snap to 45-degree increments
        const snappedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        finalEndPoint = {
          x: startPoint.x + Math.cos(snappedAngle) * distance,
          y: startPoint.y + Math.sin(snappedAngle) * distance
        };
        
        isSnapped = true;
      }
    }
    
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
      ...defaultFabricOptions
    });
    
    canvas.add(previewLine);
    safeRender(canvas);
    
    previewLineRef.current = previewLine;
    
    return {
      startPoint,
      endPoint: finalEndPoint,
      isSnapped
    };
  }, [fabricCanvasRef, lineColor, lineThickness, snapEnabled, anglesEnabled]);
  
  /**
   * Clear line preview
   */
  const clearLinePreview = useCallback(() => {
    const canvas = getCanvas(fabricCanvasRef);
    if (!canvas || !previewLineRef.current) return;
    
    canvas.remove(previewLineRef.current);
    safeRender(canvas);
    
    previewLineRef.current = null;
  }, [fabricCanvasRef]);
  
  return {
    showHoverIndicator,
    hideHoverIndicator,
    updateLinePreview,
    clearLinePreview
  };
};
