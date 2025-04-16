
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Line, Circle } from 'fabric';
import { Point } from '@/types/core/Point';
import { snapToGrid, snapToAngle } from '@/utils/geometry/pointOperations';

/**
 * Hook for managing line preview and snap feedback
 */
export const useLinePreview = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  isDrawing: boolean,
  snapEnabled: boolean,
  anglesEnabled: boolean,
  lineColor: string,
  lineThickness: number
) => {
  // References for visual feedback elements
  const previewLineRef = useRef<Line | null>(null);
  const snapIndicatorRef = useRef<Circle | null>(null);
  const hoverIndicatorRef = useRef<Circle | null>(null);
  
  // Clean up preview objects when unmounting
  useEffect(() => {
    return () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      
      // Remove preview line
      if (previewLineRef.current) {
        canvas.remove(previewLineRef.current);
        previewLineRef.current = null;
      }
      
      // Remove snap indicator
      if (snapIndicatorRef.current) {
        canvas.remove(snapIndicatorRef.current);
        snapIndicatorRef.current = null;
      }
      
      // Remove hover indicator
      if (hoverIndicatorRef.current) {
        canvas.remove(hoverIndicatorRef.current);
        hoverIndicatorRef.current = null;
      }
    };
  }, [fabricCanvasRef]);
  
  /**
   * Show hover indicator at cursor position
   */
  const showHoverIndicator = useCallback((point: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Don't show hover indicator when drawing
    if (isDrawing) return;
    
    // Create or update hover indicator
    if (!hoverIndicatorRef.current) {
      hoverIndicatorRef.current = new Circle({
        left: point.x,
        top: point.y,
        radius: 4,
        fill: 'rgba(255, 255, 255, 0.5)',
        stroke: lineColor,
        strokeWidth: 1,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
        objectType: 'hover-indicator'
      });
      canvas.add(hoverIndicatorRef.current);
    } else {
      hoverIndicatorRef.current.set({
        left: point.x,
        top: point.y
      });
    }
    
    canvas.requestRenderAll();
  }, [fabricCanvasRef, isDrawing, lineColor]);
  
  /**
   * Hide hover indicator
   */
  const hideHoverIndicator = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !hoverIndicatorRef.current) return;
    
    canvas.remove(hoverIndicatorRef.current);
    hoverIndicatorRef.current = null;
    canvas.requestRenderAll();
  }, [fabricCanvasRef]);
  
  /**
   * Update line preview
   */
  const updateLinePreview = useCallback((startPoint: Point, currentPoint: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    // Apply snapping if enabled
    let endPoint = { ...currentPoint };
    let isSnapped = false;
    
    if (snapEnabled) {
      endPoint = snapToGrid(endPoint);
      isSnapped = true;
    }
    
    if (anglesEnabled) {
      endPoint = snapToAngle(startPoint, endPoint);
      isSnapped = true;
    }
    
    // Create or update preview line
    if (!previewLineRef.current) {
      previewLineRef.current = new Line([
        startPoint.x, startPoint.y, endPoint.x, endPoint.y
      ], {
        stroke: lineColor,
        strokeWidth: lineThickness,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        objectType: 'preview-line'
      });
      canvas.add(previewLineRef.current);
    } else {
      previewLineRef.current.set({
        x1: startPoint.x,
        y1: startPoint.y,
        x2: endPoint.x,
        y2: endPoint.y
      });
    }
    
    // Show snap indicator if snapped
    if (isSnapped) {
      if (!snapIndicatorRef.current) {
        snapIndicatorRef.current = new Circle({
          left: endPoint.x,
          top: endPoint.y,
          radius: 6,
          fill: 'rgba(76, 217, 100, 0.3)',
          stroke: 'rgba(76, 217, 100, 0.8)',
          strokeWidth: 1,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
          objectType: 'snap-indicator'
        });
        canvas.add(snapIndicatorRef.current);
      } else {
        snapIndicatorRef.current.set({
          left: endPoint.x,
          top: endPoint.y,
          visible: true
        });
      }
    } else if (snapIndicatorRef.current) {
      snapIndicatorRef.current.set({ visible: false });
    }
    
    canvas.requestRenderAll();
    
    return {
      endPoint,
      isSnapped
    };
  }, [fabricCanvasRef, snapEnabled, anglesEnabled, lineColor, lineThickness]);
  
  /**
   * Clear line preview
   */
  const clearLinePreview = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove preview line
    if (previewLineRef.current) {
      canvas.remove(previewLineRef.current);
      previewLineRef.current = null;
    }
    
    // Remove snap indicator
    if (snapIndicatorRef.current) {
      canvas.remove(snapIndicatorRef.current);
      snapIndicatorRef.current = null;
    }
    
    canvas.requestRenderAll();
  }, [fabricCanvasRef]);
  
  return {
    showHoverIndicator,
    hideHoverIndicator,
    updateLinePreview,
    clearLinePreview
  };
};
