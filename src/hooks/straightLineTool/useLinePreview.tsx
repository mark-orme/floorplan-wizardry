
import { useCallback, useRef, useState } from 'react';
import { Point } from '@/types/core/Point';
import { Canvas as FabricCanvas, Line, Circle, Text, Group } from 'fabric';
import { PIXELS_PER_METER } from '@/constants/numerics';
import { toast } from 'sonner';

interface DistanceTooltipState {
  visible: boolean;
  text: string;
  position: Point;
}

/**
 * Hook for managing line preview and hover indicators with snap feedback
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
  const previewLineRef = useRef<Line | null>(null);
  const hoverIndicatorRef = useRef<Circle | null>(null);
  const distanceTooltipRef = useRef<Group | null>(null);

  // State for tooltip information
  const [distanceTooltip, setDistanceTooltip] = useState<DistanceTooltipState>({
    visible: false,
    text: '',
    position: { x: 0, y: 0 }
  });

  /**
   * Calculate distance between two points in pixels and meters
   */
  const calculateDistance = useCallback((p1: Point, p2: Point) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);
    const meterDistance = pixelDistance / PIXELS_PER_METER;
    
    // Calculate angle in degrees
    let angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
    // Normalize angle to 0-360
    if (angleDeg < 0) angleDeg += 360;
    
    return {
      pixels: pixelDistance,
      meters: meterDistance,
      angle: angleDeg
    };
  }, []);

  /**
   * Update or create the distance tooltip
   */
  const updateDistanceTooltip = useCallback((startPoint: Point, endPoint: Point, isSnapped: boolean) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Calculate the midpoint for positioning
    const midPoint = {
      x: (startPoint.x + endPoint.x) / 2,
      y: (startPoint.y + endPoint.y) / 2 - 15 // Offset above the line
    };

    // Calculate distance and angle
    const { meters, angle } = calculateDistance(startPoint, endPoint);
    
    // Format the display text
    let tooltipText = `${meters.toFixed(2)}m`;
    if (anglesEnabled) {
      tooltipText += ` | ${Math.round(angle)}°`;
    }
    if (isSnapped) {
      tooltipText += ' (snapped)';
    }

    // Remove existing tooltip
    if (distanceTooltipRef.current) {
      canvas.remove(distanceTooltipRef.current);
    }

    // Create text object
    const tooltipText1 = new Text(tooltipText, {
      left: 0,
      top: 0,
      fontSize: 12,
      fill: '#333333',
      backgroundColor: '#ffffff',
      padding: 5,
      fontFamily: 'Arial',
      originX: 'center',
      originY: 'center',
    });

    // Create background for better visibility
    const tooltipBackground = new Text(tooltipText, {
      left: 0,
      top: 0,
      fontSize: 12,
      fill: 'transparent',
      backgroundColor: '#ffffff',
      padding: 5,
      fontFamily: 'Arial',
      originX: 'center',
      originY: 'center',
    });

    // Group the tooltip elements
    const tooltipGroup = new Group([tooltipBackground, tooltipText1], {
      left: midPoint.x,
      top: midPoint.y,
      selectable: false,
      evented: false,
      opacity: 0.9,
    });

    // Add to canvas
    canvas.add(tooltipGroup);
    canvas.bringToFront(tooltipGroup);
    
    // Store reference
    distanceTooltipRef.current = tooltipGroup;
    
    // Update state
    setDistanceTooltip({
      visible: true,
      text: tooltipText,
      position: midPoint
    });

    return tooltipGroup;
  }, [calculateDistance, fabricCanvasRef, anglesEnabled]);

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
    canvas.bringToFront(indicator);
    canvas.requestRenderAll();
    
    // Store reference
    hoverIndicatorRef.current = indicator;
    return indicator;
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
   * Update preview line between start and end points with snapping
   */
  const updateLinePreview = useCallback((startPoint: Point, endPoint: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    // Clear previous preview if it exists
    if (previewLineRef.current) {
      canvas.remove(previewLineRef.current);
    }
    
    // Remove existing tooltip
    if (distanceTooltipRef.current) {
      canvas.remove(distanceTooltipRef.current);
      distanceTooltipRef.current = null;
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
    
    // Update the distance tooltip
    updateDistanceTooltip(startPoint, snappedEndPoint, isSnapped);
    
    return { 
      line, 
      endPoint: snappedEndPoint, 
      isSnapped,
      distance: calculateDistance(startPoint, snappedEndPoint)
    };
  }, [fabricCanvasRef, snapEnabled, anglesEnabled, lineColor, lineThickness, updateDistanceTooltip, calculateDistance]);
  
  /**
   * Clear line preview and tooltip
   */
  const clearLinePreview = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove preview from canvas
    if (previewLineRef.current) {
      canvas.remove(previewLineRef.current);
      previewLineRef.current = null;
    }
    
    // Remove tooltip from canvas
    if (distanceTooltipRef.current) {
      canvas.remove(distanceTooltipRef.current);
      distanceTooltipRef.current = null;
    }
    
    canvas.requestRenderAll();
    
    // Reset tooltip state
    setDistanceTooltip({
      visible: false,
      text: '',
      position: { x: 0, y: 0 }
    });
  }, [fabricCanvasRef]);
  
  return {
    showHoverIndicator,
    hideHoverIndicator,
    updateLinePreview,
    clearLinePreview,
    distanceTooltip
  };
};
