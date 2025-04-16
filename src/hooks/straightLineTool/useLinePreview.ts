
import { useCallback, useRef } from 'react';
import { Point } from '@/types/core/Point';
import { Canvas as FabricCanvas, Line, Circle } from 'fabric';

/**
 * Hook for managing line preview and hover indicators
 */
export const useLinePreview = (
  fabricCanvasRef: { current: FabricCanvas | null },
  isDrawing: boolean,
  snapEnabled: boolean,
  anglesEnabled: boolean,
  lineColor: string,
  lineThickness: number
) => {
  // References for preview elements
  const previewLineRef = useRef<any>(null);
  const hoverIndicatorRef = useRef<any>(null);
  
  /**
   * Show hover indicator at cursor position
   */
  const showHoverIndicator = useCallback((point: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Clear previous indicator if it exists
    if (hoverIndicatorRef.current) {
      canvas.remove(hoverIndicatorRef.current);
    }
    
    // Create hover indicator
    const indicator = new Circle({
      left: point.x - 4,
      top: point.y - 4,
      radius: 4,
      fill: lineColor,
      stroke: '#ffffff',
      strokeWidth: 1,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      opacity: 0.7
    });
    
    // Add to canvas
    canvas.add(indicator);
    canvas.requestRenderAll();
    
    // Store reference
    hoverIndicatorRef.current = indicator;
  }, [fabricCanvasRef, lineColor]);
  
  /**
   * Hide hover indicator
   */
  const hideHoverIndicator = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !hoverIndicatorRef.current) return;
    
    // Remove indicator from canvas
    canvas.remove(hoverIndicatorRef.current);
    hoverIndicatorRef.current = null;
    canvas.requestRenderAll();
  }, [fabricCanvasRef]);
  
  /**
   * Update preview line between start and end points
   */
  const updateLinePreview = useCallback((startPoint: Point, endPoint: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    // Clear previous preview if it exists
    if (previewLineRef.current) {
      canvas.remove(previewLineRef.current);
    }
    
    // Apply grid snapping if enabled
    let snappedEndPoint = { ...endPoint };
    let isSnapped = false;
    
    if (snapEnabled) {
      // Simple grid snapping (every 20px)
      const gridSize = 20;
      snappedEndPoint = {
        x: Math.round(endPoint.x / gridSize) * gridSize,
        y: Math.round(endPoint.y / gridSize) * gridSize
      };
      
      // Check if snapping was applied
      isSnapped = snappedEndPoint.x !== endPoint.x || snappedEndPoint.y !== endPoint.y;
    }
    
    // Apply angle constraints if enabled
    if (anglesEnabled) {
      // Calculate angle from start to end
      const dx = snappedEndPoint.x - startPoint.x;
      const dy = snappedEndPoint.y - startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate current angle
      let angle = Math.atan2(dy, dx);
      
      // Snap to 45-degree increments
      const snapAngle = Math.PI / 4; // 45 degrees
      angle = Math.round(angle / snapAngle) * snapAngle;
      
      // Update end point based on snapped angle
      snappedEndPoint = {
        x: startPoint.x + distance * Math.cos(angle),
        y: startPoint.y + distance * Math.sin(angle)
      };
      
      // Mark as snapped
      isSnapped = true;
    }
    
    // Create preview line
    const line = new Line([
      startPoint.x, 
      startPoint.y, 
      snappedEndPoint.x, 
      snappedEndPoint.y
    ], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      strokeDashArray: [5, 5], // Make line dashed for preview
      selectable: false,
      evented: false,
      opacity: 0.7
    });
    
    // Add to canvas
    canvas.add(line);
    canvas.requestRenderAll();
    
    // Store reference
    previewLineRef.current = line;
    
    return { endPoint: snappedEndPoint, isSnapped };
  }, [fabricCanvasRef, snapEnabled, anglesEnabled, lineColor, lineThickness]);
  
  /**
   * Clear line preview
   */
  const clearLinePreview = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !previewLineRef.current) return;
    
    // Remove preview from canvas
    canvas.remove(previewLineRef.current);
    previewLineRef.current = null;
    canvas.requestRenderAll();
  }, [fabricCanvasRef]);
  
  return {
    showHoverIndicator,
    hideHoverIndicator,
    updateLinePreview,
    clearLinePreview
  };
};
