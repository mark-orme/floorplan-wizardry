
import { useRef, useCallback } from 'react';
import { Canvas as FabricCanvas, Line, Circle, Text } from 'fabric';
import { Point } from '@/types/core/Point';
import { snapToGrid, snapToAngle } from '@/utils/geometry/pointOperations';

/**
 * Hook for managing line preview during drawing
 */
export const useLinePreview = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  isDrawing: boolean,
  snapEnabled: boolean,
  anglesEnabled: boolean,
  lineColor: string = '#000000',
  lineThickness: number = 2
) => {
  // References for preview objects
  const previewLineRef = useRef<Line | null>(null);
  const startPointIndicatorRef = useRef<Circle | null>(null);
  const distanceTooltipRef = useRef<Text | null>(null);
  
  /**
   * Show hover indicator at a point
   */
  const showHoverIndicator = useCallback((point: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove any existing indicator
    hideHoverIndicator();
    
    // Create a new indicator
    const indicator = new Circle({
      left: point.x - 4,
      top: point.y - 4,
      radius: 4,
      fill: lineColor,
      stroke: '#ffffff',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      objectCaching: false
    });
    
    // Add to canvas
    canvas.add(indicator);
    startPointIndicatorRef.current = indicator;
    canvas.renderAll();
  }, [fabricCanvasRef, lineColor]);
  
  /**
   * Hide hover indicator
   */
  const hideHoverIndicator = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove indicator if exists
    if (startPointIndicatorRef.current) {
      canvas.remove(startPointIndicatorRef.current);
      startPointIndicatorRef.current = null;
      canvas.renderAll();
    }
  }, [fabricCanvasRef]);
  
  /**
   * Update line preview with new end point
   */
  const updateLinePreview = useCallback((startPoint: Point, endPoint: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return { endPoint, isSnapped: false };
    
    // Apply snapping if enabled
    let processedEndPoint = endPoint;
    let isSnapped = false;
    
    if (snapEnabled) {
      processedEndPoint = snapToGrid(endPoint);
      isSnapped = processedEndPoint.x !== endPoint.x || processedEndPoint.y !== endPoint.y;
    }
    
    // Apply angle constraints if enabled
    if (anglesEnabled) {
      processedEndPoint = snapToAngle(startPoint, processedEndPoint, 45);
      isSnapped = true;
    }
    
    // Create or update the preview line
    if (!previewLineRef.current) {
      // Create new line
      const line = new Line([startPoint.x, startPoint.y, processedEndPoint.x, processedEndPoint.y], {
        stroke: lineColor,
        strokeWidth: lineThickness,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        objectCaching: false
      });
      
      canvas.add(line);
      previewLineRef.current = line;
    } else {
      // Update existing line
      previewLineRef.current.set({
        x1: startPoint.x,
        y1: startPoint.y,
        x2: processedEndPoint.x,
        y2: processedEndPoint.y
      });
    }
    
    // Update distance tooltip
    updateDistanceTooltip(startPoint, processedEndPoint);
    
    canvas.renderAll();
    
    return {
      endPoint: processedEndPoint,
      isSnapped
    };
  }, [fabricCanvasRef, snapEnabled, anglesEnabled, lineColor, lineThickness]);
  
  /**
   * Update distance tooltip
   */
  const updateDistanceTooltip = useCallback((startPoint: Point, endPoint: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Calculate distance and angle
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const distanceInMeters = (distance / 100).toFixed(1); // 100px = 1m
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const formattedAngle = angle.toFixed(1);
    
    // Tooltip text
    const tooltipText = `${distanceInMeters}m\n${formattedAngle}°`;
    
    // Position for tooltip (midpoint of line)
    const midX = (startPoint.x + endPoint.x) / 2;
    const midY = (startPoint.y + endPoint.y) / 2 - 10; // Position slightly above the line
    
    if (!distanceTooltipRef.current) {
      // Create new tooltip
      const tooltip = new Text(tooltipText, {
        left: midX,
        top: midY,
        fontSize: 12,
        fill: '#000000',
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: 2,
        selectable: false,
        evented: false,
        originX: 'center',
        originY: 'bottom'
      });
      
      canvas.add(tooltip);
      distanceTooltipRef.current = tooltip;
    } else {
      // Update existing tooltip
      distanceTooltipRef.current.set({
        text: tooltipText,
        left: midX,
        top: midY
      });
    }
    
    return distanceTooltipRef.current;
  }, [fabricCanvasRef]);
  
  /**
   * Clear the line preview
   */
  const clearLinePreview = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove preview line
    if (previewLineRef.current) {
      canvas.remove(previewLineRef.current);
      previewLineRef.current = null;
    }
    
    // Remove tooltip
    if (distanceTooltipRef.current) {
      canvas.remove(distanceTooltipRef.current);
      distanceTooltipRef.current = null;
    }
    
    canvas.renderAll();
  }, [fabricCanvasRef]);
  
  return {
    showHoverIndicator,
    hideHoverIndicator,
    updateLinePreview,
    clearLinePreview,
    distanceTooltip: distanceTooltipRef.current
  };
};
