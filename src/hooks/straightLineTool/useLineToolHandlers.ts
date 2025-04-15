/**
 * Hook for managing line drawing handlers
 * @module hooks/straightLineTool/useLineToolHandlers
 */
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { InputMethod } from './useLineState';
import { useDrawingErrorReporting } from '@/hooks/useDrawingErrorReporting';
import * as Sentry from '@sentry/react';

interface UseLineToolHandlersProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  isActive: boolean;
  isDrawing: boolean;
  startPointRef: React.MutableRefObject<Point | null>;
  currentLineRef: React.MutableRefObject<Line | null>;
  distanceTooltipRef: React.MutableRefObject<HTMLDivElement | null>;
  setIsDrawing: (isDrawing: boolean) => void;
  setStartPoint: (point: Point | null) => void;
  setCurrentLine: (line: Line | null) => void;
  resetDrawingState: () => void;
  saveCurrentState: () => void;
  onChange?: (canvas: FabricCanvas) => void;
  lineColor: string;
  lineThickness: number;
  snapToAngle: boolean;
  snapAngleDeg: number;
  snapEnabled: boolean;
  snapLineToGrid: (start: Point, end: Point) => { start: Point, end: Point };
  inputMethod: InputMethod;
  logDrawingEvent: (message: string, eventType: string, data?: any) => void;
}

/**
 * Hook providing event handlers for straight line drawing tool
 * Features:
 * - Live distance tooltips
 * - Grid snapping
 * - Angle snapping
 * - Error reporting
 */
export const useLineToolHandlers = ({
  fabricCanvasRef,
  isActive,
  isDrawing,
  startPointRef,
  currentLineRef,
  distanceTooltipRef,
  setIsDrawing,
  setStartPoint,
  setCurrentLine,
  resetDrawingState,
  saveCurrentState,
  onChange,
  lineColor,
  lineThickness,
  snapToAngle,
  snapAngleDeg,
  snapEnabled,
  snapLineToGrid,
  inputMethod,
  logDrawingEvent
}: UseLineToolHandlersProps) => {
  // Get the error reporting functions
  const { reportDrawingError } = useDrawingErrorReporting();
  
  // Set Sentry context for the component
  Sentry.setTag("component", "useLineToolHandlers");
  Sentry.setContext("lineDrawingState", {
    isActive,
    isDrawing,
    hasStartPoint: !!startPointRef.current,
    hasCurrentLine: !!currentLineRef.current,
    hasTooltip: !!distanceTooltipRef.current,
    inputMethod,
    snapEnabled,
    snapToAngle,
    snapAngleDeg,
    lineThickness,
    lineColor
  });
  
  // Function to display distance tooltip with improved positioning and formatting
  const displayDistanceTooltip = useCallback((startPoint: Point, currentPoint: Point) => {
    if (!startPoint) return null;
    
    try {
      // Calculate distance between points
      const dx = currentPoint.x - startPoint.x;
      const dy = currentPoint.y - startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate angle for display
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const formattedAngle = Math.round(angle);
      
      // Convert to meters based on pixels per meter ratio
      const meters = (distance / GRID_CONSTANTS.PIXELS_PER_METER).toFixed(2);
      
      // Get midpoint of line for tooltip placement
      const midX = (startPoint.x + currentPoint.x) / 2;
      const midY = (startPoint.y + currentPoint.y) / 2;
      
      // Create tooltip if it doesn't exist
      if (!distanceTooltipRef.current) {
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'distance-tooltip';
        tooltipElement.style.position = 'absolute';
        tooltipElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tooltipElement.style.color = 'white';
        tooltipElement.style.padding = '4px 8px';
        tooltipElement.style.borderRadius = '4px';
        tooltipElement.style.fontSize = '12px';
        tooltipElement.style.pointerEvents = 'none';
        tooltipElement.style.transform = 'translate(-50%, -50%)';
        tooltipElement.style.zIndex = '1000';
        tooltipElement.style.fontFamily = 'system-ui, sans-serif';
        tooltipElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        tooltipElement.style.backdropFilter = 'blur(4px)';
        
        document.body.appendChild(tooltipElement);
        distanceTooltipRef.current = tooltipElement;
        
        // Add to Sentry breadcrumbs
        Sentry.addBreadcrumb({
          category: 'ui',
          message: 'Distance tooltip created',
          data: { distance: meters }
        });
      }
      
      // Update tooltip content and position with enhanced information
      if (distanceTooltipRef.current) {
        const tooltip = distanceTooltipRef.current;
        tooltip.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <div>${meters}m</div>
            <div style="font-size: 10px; opacity: 0.8;">${formattedAngle}°</div>
          </div>
        `;
        
        // Position tooltip near the canvas and adjust for scroll
        const canvas = fabricCanvasRef.current;
        if (canvas) {
          const canvasEl = canvas.getElement();
          const canvasRect = canvasEl.getBoundingClientRect();
          const canvasOffsetX = canvasRect.left;
          const canvasOffsetY = canvasRect.top;
          
          tooltip.style.left = `${canvasOffsetX + midX}px`;
          tooltip.style.top = `${canvasOffsetY + midY - 20}px`;
        }
      }
      
      logDrawingEvent('Distance tooltip updated', 'tooltip-update', {
        distance: meters,
        angle: formattedAngle,
        position: { x: midX, y: midY }
      });
      
      return { distance, meters, angle: formattedAngle };
    } catch (error) {
      reportDrawingError(error, 'tooltip-display', {
        startPoint,
        currentPoint
      });
      return null;
    }
  }, [fabricCanvasRef, distanceTooltipRef, logDrawingEvent, reportDrawingError]);

  // Event handler for pointer down
  const handlePointerDown = useCallback((point: Point) => {
    if (!fabricCanvasRef.current || !isActive) return;
    
    try {
      // Set Sentry context for the action
      Sentry.setTag("action", "lineStart");
      Sentry.setContext("lineStartContext", {
        point,
        inputMethod,
        snapEnabled,
        timestamp: new Date().toISOString()
      });
      
      // Apply grid snapping immediately to the starting point
      const snappedPoint = snapEnabled ? snapLineToGrid(point, point).start : point;
      
      // Store starting point
      setStartPoint(snappedPoint);
      
      // Create temporary line
      const canvas = fabricCanvasRef.current;
      const line = new Line(
        [snappedPoint.x, snappedPoint.y, snappedPoint.x, snappedPoint.y],
        {
          strokeWidth: lineThickness,
          stroke: lineColor,
          selectable: false,
          evented: false,
          strokeLineCap: 'round',
          strokeLineJoin: 'round'
        }
      );
      
      // Add to canvas
      canvas.add(line);
      setCurrentLine(line);
      
      // Display distance tooltip
      displayDistanceTooltip(snappedPoint, snappedPoint);
      
      // Set drawing state
      setIsDrawing(true);
      
      // Log event
      logDrawingEvent('Line drawing started', 'line-start', {
        interaction: { 
          type: inputMethod === 'keyboard' ? 'mouse' : inputMethod
        }
      });
    } catch (error) {
      reportDrawingError(error, 'line-pointer-down', {
        interaction: { type: inputMethod === 'keyboard' ? 'mouse' : inputMethod }
      });
    }
  }, [
    fabricCanvasRef, 
    isActive, 
    setStartPoint, 
    lineThickness, 
    lineColor, 
    setCurrentLine, 
    setIsDrawing, 
    logDrawingEvent, 
    reportDrawingError,
    inputMethod,
    snapEnabled,
    snapLineToGrid,
    displayDistanceTooltip
  ]);

  // Event handler for pointer move with improved tooltip updates
  const handlePointerMove = useCallback((point: Point) => {
    if (!fabricCanvasRef.current || !isDrawing || !currentLineRef.current || !startPointRef.current) return;
    
    try {
      // Get current pointer position and start point
      const startPoint = startPointRef.current;
      
      // Apply snapping to the end point
      let endPoint = { ...point };
      
      // Apply angle snapping if enabled
      if (snapToAngle) {
        const angle = Math.atan2(point.y - startPoint.y, point.x - startPoint.x) * (180 / Math.PI);
        const snappedAngle = Math.round(angle / snapAngleDeg) * snapAngleDeg;
        const distance = Math.sqrt(
          Math.pow(point.x - startPoint.x, 2) + 
          Math.pow(point.y - startPoint.y, 2)
        );
        
        // Calculate new endpoint based on snapped angle
        const radians = snappedAngle * (Math.PI / 180);
        endPoint = {
          x: startPoint.x + distance * Math.cos(radians),
          y: startPoint.y + distance * Math.sin(radians)
        };
      }
      
      // Apply grid snapping if enabled
      if (snapEnabled) {
        const snappedPoints = snapLineToGrid(startPoint, endPoint);
        // Only update end point, keep start point fixed
        endPoint = snappedPoints.end;
      }
      
      // Update line coordinates
      currentLineRef.current.set({
        x2: endPoint.x,
        y2: endPoint.y
      });
      
      // Update the distance tooltip on every frame
      displayDistanceTooltip(startPoint, endPoint);
      
      // Render changes
      fabricCanvasRef.current.renderAll();
    } catch (error) {
      reportDrawingError(error, 'line-pointer-move', {
        interaction: { type: inputMethod === 'keyboard' ? 'mouse' : inputMethod }
      });
    }
  }, [
    fabricCanvasRef, 
    isDrawing, 
    currentLineRef, 
    startPointRef, 
    snapToAngle, 
    snapAngleDeg, 
    snapEnabled, 
    snapLineToGrid,
    reportDrawingError,
    inputMethod,
    displayDistanceTooltip
  ]);

  // Event handler for pointer up with improved cleanup
  const handlePointerUp = useCallback((point: Point) => {
    if (!fabricCanvasRef.current || !isDrawing || !currentLineRef.current || !startPointRef.current) return;
    
    try {
      // Set Sentry context for the action
      Sentry.setTag("action", "lineComplete");
      Sentry.setContext("lineCompleteContext", {
        startPoint: startPointRef.current,
        endPoint: point,
        inputMethod,
        snapEnabled,
        timestamp: new Date().toISOString()
      });
      
      const canvas = fabricCanvasRef.current;
      const startPoint = startPointRef.current;
      
      // Apply final snapping to end point
      let endPoint = { ...point };
      
      // Apply angle snapping for final position if enabled
      if (snapToAngle) {
        const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) * (180 / Math.PI);
        const snappedAngle = Math.round(angle / snapAngleDeg) * snapAngleDeg;
        const distance = Math.sqrt(
          Math.pow(endPoint.x - startPoint.x, 2) + 
          Math.pow(endPoint.y - startPoint.y, 2)
        );
        
        // Calculate new endpoint based on snapped angle
        const radians = snappedAngle * (Math.PI / 180);
        endPoint = {
          x: startPoint.x + distance * Math.cos(radians),
          y: startPoint.y + distance * Math.sin(radians)
        };
      }
      
      // Apply grid snapping if enabled
      if (snapEnabled) {
        const snappedPoints = snapLineToGrid(startPoint, endPoint);
        // Only update end point, keep start point fixed
        endPoint = snappedPoints.end;
      }
      
      // Calculate final measurements for the line
      const dx = endPoint.x - startPoint.x;
      const dy = endPoint.y - startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const meters = (distance / GRID_CONSTANTS.PIXELS_PER_METER).toFixed(2);
      
      // Check if line is too short (prevent accidental clicks)
      if (distance < 2) {
        // Remove the line if it's too short
        canvas.remove(currentLineRef.current);
        
        // Remove distance tooltip
        if (distanceTooltipRef.current) {
          const parent = distanceTooltipRef.current.parentElement;
          if (parent) {
            parent.removeChild(distanceTooltipRef.current);
          }
          distanceTooltipRef.current = null;
        }
        
        // Reset state
        setIsDrawing(false);
        resetDrawingState();
        setCurrentLine(null);
        setStartPoint(null);
        
        logDrawingEvent('Line drawing cancelled (too short)', 'line-cancel', {
          distance: meters,
          interaction: { 
            type: inputMethod === 'keyboard' ? 'mouse' : inputMethod
          }
        });
        
        return;
      }
      
      // Final update to the line
      currentLineRef.current.set({
        x2: endPoint.x,
        y2: endPoint.y,
        selectable: true,
        evented: true,
        // Store measurements as custom properties
        measurement: `${meters}m`,
        angle: Math.round(angle),
        actualDistance: distance
      });
      
      // Remove distance tooltip
      if (distanceTooltipRef.current) {
        const parent = distanceTooltipRef.current.parentElement;
        if (parent) {
          parent.removeChild(distanceTooltipRef.current);
        }
        distanceTooltipRef.current = null;
      }
      
      // Save state for undo/redo
      if (saveCurrentState) {
        saveCurrentState();
      }
      
      // Clear the current line reference to avoid artifacts
      setCurrentLine(null);
      
      // Trigger canvas update
      canvas.renderAll();
      
      // Optionally trigger change event
      if (onChange) {
        onChange(canvas);
      }
      
      // Reset drawing state
      setIsDrawing(false);
      resetDrawingState();
      
      // Log event
      logDrawingEvent('Line drawing completed', 'line-complete', {
        distance: meters,
        angle: Math.round(angle),
        interaction: { 
          type: inputMethod === 'keyboard' ? 'mouse' : inputMethod
        }
      });
      
      setStartPoint(null);
      
    } catch (error) {
      // Log error to Sentry
      Sentry.captureException(error);
      
      reportDrawingError(error, 'line-pointer-up', {
        interaction: { type: inputMethod === 'keyboard' ? 'mouse' : inputMethod }
      });
      
      // Ensure clean state even if error occurs
      setIsDrawing(false);
      resetDrawingState();
      setCurrentLine(null);
      setStartPoint(null);
      
      // Remove tooltip if it exists
      if (distanceTooltipRef.current) {
        const parent = distanceTooltipRef.current.parentElement;
        if (parent) {
          parent.removeChild(distanceTooltipRef.current);
        }
        distanceTooltipRef.current = null;
      }
    }
  }, [
    fabricCanvasRef, 
    isDrawing, 
    currentLineRef, 
    startPointRef, 
    setIsDrawing, 
    saveCurrentState, 
    onChange, 
    resetDrawingState, 
    logDrawingEvent, 
    setStartPoint,
    reportDrawingError,
    inputMethod,
    snapEnabled,
    snapLineToGrid,
    snapToAngle,
    snapAngleDeg,
    distanceTooltipRef,
    setCurrentLine
  ]);
  
  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
};
