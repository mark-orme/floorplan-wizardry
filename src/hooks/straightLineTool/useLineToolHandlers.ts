
/**
 * Hook for line tool pointer handlers with improved accuracy
 * @module hooks/straightLineTool/useLineToolHandlers
 */
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { InputMethod } from './useLineState';
import { toast } from 'sonner';

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
  // Handle pointer down - starting a line
  const handlePointerDown = useCallback((point: Point) => {
    if (!fabricCanvasRef.current || !isActive) return;
    
    try {
      // Log the initial click point for debugging
      logDrawingEvent('Initial pointer down', 'line-start-raw', {
        rawPoint: { ...point },
        inputMethod
      });
      
      let startPoint = { ...point };
      
      // Snap to grid if enabled
      if (snapEnabled) {
        startPoint = snapLineToGrid(startPoint, startPoint).start;
        
        // Log the snapped point
        logDrawingEvent('Snapped starting point', 'line-start-snapped', {
          original: { ...point },
          snapped: { ...startPoint },
          inputMethod
        });
      }
      
      // Store the starting point
      setStartPoint(startPoint);
      startPointRef.current = startPoint;
      
      // Create new line
      const canvas = fabricCanvasRef.current;
      const line = new Line([startPoint.x, startPoint.y, startPoint.x, startPoint.y], {
        stroke: lineColor,
        strokeWidth: lineThickness,
        selectable: false,
        evented: false,
        objectType: 'straightLine-temp'
      });
      
      // Add to canvas
      canvas.add(line);
      setCurrentLine(line);
      currentLineRef.current = line;
      
      // Start drawing
      setIsDrawing(true);
      
      // Create measurement tooltip
      const distanceTooltip = document.createElement('div');
      distanceTooltip.className = 'distance-tooltip';
      distanceTooltip.style.position = 'absolute';
      distanceTooltip.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
      distanceTooltip.style.padding = '5px';
      distanceTooltip.style.borderRadius = '4px';
      distanceTooltip.style.fontSize = '12px';
      distanceTooltip.style.pointerEvents = 'none';
      distanceTooltip.style.zIndex = '1000';
      distanceTooltip.style.border = '1px solid rgba(0, 0, 0, 0.2)';
      distanceTooltip.style.color = '#333';
      distanceTooltip.textContent = '0 m';
      
      // Position tooltip near the starting point
      distanceTooltip.style.left = `${startPoint.x + 10}px`;
      distanceTooltip.style.top = `${startPoint.y - 25}px`;
      
      // Add to DOM
      const canvasContainer = canvas.getElement().parentElement;
      if (canvasContainer) {
        canvasContainer.appendChild(distanceTooltip);
        distanceTooltipRef.current = distanceTooltip;
      }
      
      logDrawingEvent('Line drawing started', 'line-start', {
        point: startPoint, 
        inputMethod
      });
    } catch (error) {
      console.error('Error in handlePointerDown:', error);
      toast.error('Error starting line drawing');
      
      // Log the error for debugging
      logDrawingEvent('Error in pointer down', 'line-start-error', {
        point,
        error: error instanceof Error ? error.message : String(error),
        inputMethod
      });
    }
  }, [
    fabricCanvasRef, 
    isActive, 
    setIsDrawing, 
    setStartPoint, 
    setCurrentLine, 
    lineColor, 
    lineThickness, 
    snapEnabled, 
    snapLineToGrid,
    inputMethod,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    logDrawingEvent
  ]);
  
  // Handle pointer move - updating line during drawing
  const handlePointerMove = useCallback((point: Point) => {
    if (!fabricCanvasRef.current || !isDrawing || !currentLineRef.current || !startPointRef.current) return;
    
    try {
      const canvas = fabricCanvasRef.current;
      const startPoint = startPointRef.current;
      const line = currentLineRef.current;
      
      // Log the raw move position for debugging
      logDrawingEvent('Pointer move raw', 'line-move-raw', {
        rawPoint: { ...point },
        inputMethod
      });
      
      // Apply snapping and constraints
      let endPoint = { ...point };
      
      // Apply angle snapping if enabled
      if (snapToAngle) {
        const dx = point.x - startPoint.x;
        const dy = point.y - startPoint.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const snappedAngle = Math.round(angle / snapAngleDeg) * snapAngleDeg;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Convert back to cartesian coordinates
        const radians = snappedAngle * (Math.PI / 180);
        endPoint = {
          x: startPoint.x + distance * Math.cos(radians),
          y: startPoint.y + distance * Math.sin(radians)
        };
        
        // Log the angle-snapped point
        logDrawingEvent('Angle snapped point', 'line-move-angle-snap', {
          original: { ...point },
          snapped: { ...endPoint },
          angle: snappedAngle,
          inputMethod
        });
      }
      
      // Apply grid snapping if enabled
      if (snapEnabled) {
        const snappedPoints = snapLineToGrid(startPoint, endPoint);
        endPoint = snappedPoints.end;
        
        // Log the grid-snapped point
        logDrawingEvent('Grid snapped point', 'line-move-grid-snap', {
          original: { ...point },
          snapped: { ...endPoint },
          inputMethod
        });
      }
      
      // Update line
      line.set({
        x2: endPoint.x,
        y2: endPoint.y
      });
      
      canvas.renderAll();
      
      // Update distance tooltip
      if (distanceTooltipRef.current) {
        const dx = endPoint.x - startPoint.x;
        const dy = endPoint.y - startPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Convert to meters using the grid constant
        const distanceInMeters = (distance / GRID_CONSTANTS.PIXELS_PER_METER).toFixed(2);
        
        // Update tooltip text
        distanceTooltipRef.current.textContent = `${distanceInMeters} m`;
        
        // Position tooltip near the midpoint of the line
        const midX = (startPoint.x + endPoint.x) / 2;
        const midY = (startPoint.y + endPoint.y) / 2;
        
        // Offset tooltip above the line for better visibility
        distanceTooltipRef.current.style.left = `${midX}px`;
        distanceTooltipRef.current.style.top = `${midY - 25}px`;
      }
    } catch (error) {
      console.error('Error in handlePointerMove:', error);
      
      // Log the error for debugging
      logDrawingEvent('Error in pointer move', 'line-move-error', {
        point,
        error: error instanceof Error ? error.message : String(error),
        inputMethod
      });
    }
  }, [
    fabricCanvasRef, 
    isDrawing, 
    currentLineRef, 
    startPointRef, 
    distanceTooltipRef,
    snapToAngle, 
    snapAngleDeg, 
    snapEnabled, 
    snapLineToGrid,
    inputMethod,
    logDrawingEvent
  ]);
  
  // Handle pointer up - completing a line
  const handlePointerUp = useCallback((point: Point) => {
    if (!fabricCanvasRef.current || !isDrawing || !currentLineRef.current || !startPointRef.current) return;
    
    try {
      const canvas = fabricCanvasRef.current;
      const startPoint = startPointRef.current;
      const line = currentLineRef.current;
      
      // Log the raw up position for debugging  
      logDrawingEvent('Pointer up raw', 'line-end-raw', {
        rawPoint: { ...point },
        inputMethod
      });
      
      // Apply snapping and constraints
      let endPoint = { ...point };
      
      // Apply angle snapping if enabled
      if (snapToAngle) {
        const dx = point.x - startPoint.x;
        const dy = point.y - startPoint.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const snappedAngle = Math.round(angle / snapAngleDeg) * snapAngleDeg;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Convert back to cartesian coordinates
        const radians = snappedAngle * (Math.PI / 180);
        endPoint = {
          x: startPoint.x + distance * Math.cos(radians),
          y: startPoint.y + distance * Math.sin(radians)
        };
      }
      
      // Apply grid snapping if enabled
      if (snapEnabled) {
        const snappedPoints = snapLineToGrid(startPoint, endPoint);
        endPoint = snappedPoints.end;
        
        // Log the snapped endpoint
        logDrawingEvent('Snapped ending point', 'line-end-snapped', {
          original: { ...point },
          snapped: { ...endPoint },
          inputMethod
        });
      }
      
      // Calculate final distance
      const dx = endPoint.x - startPoint.x;
      const dy = endPoint.y - startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Convert to meters
      const distanceInMeters = (distance / GRID_CONSTANTS.PIXELS_PER_METER).toFixed(2);
      
      // Check if line has meaningful length
      if (distance > 5) {
        // Update line to final position
        line.set({
          x2: endPoint.x,
          y2: endPoint.y,
          selectable: true,
          evented: true,
          objectType: 'straightLine',
          metadata: {
            distanceInMeters,
            startPoint: { ...startPoint },
            endPoint: { ...endPoint }
          }
        });
        
        // Create a permanent text label for the measurement
        const midX = (startPoint.x + endPoint.x) / 2;
        const midY = (startPoint.y + endPoint.y) / 2;
        
        const label = new fabric.Text(`${distanceInMeters} m`, {
          left: midX,
          top: midY - 15,
          fontSize: 14,
          fill: lineColor,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          padding: 5,
          objectType: 'measurementLabel',
          selectable: false,
          originX: 'center',
          originY: 'center',
          lineId: line.id // Associate with the line
        });
        
        // Add label to canvas
        canvas.add(label);
        
        // Log success
        logDrawingEvent('Line completed successfully', 'line-complete', {
          startPoint,
          endPoint,
          distance: distanceInMeters,
          inputMethod
        });
        
        // Success feedback
        toast.success(`Line drawn: ${distanceInMeters} m`);
      } else {
        // Line too short, remove it
        canvas.remove(line);
        
        // Log cancellation due to short length
        logDrawingEvent('Line too short, removed', 'line-too-short', {
          distance,
          distanceInMeters,
          inputMethod
        });
        
        toast.info('Line too short (minimum 5px)');
      }
      
      // Always clean up the tooltip
      if (distanceTooltipRef.current) {
        const parent = distanceTooltipRef.current.parentElement;
        if (parent) {
          parent.removeChild(distanceTooltipRef.current);
        }
        distanceTooltipRef.current = null;
      }
      
      // Reset state
      setIsDrawing(false);
      setStartPoint(null);
      setCurrentLine(null);
      
      // Add to history
      saveCurrentState();
      
      // Trigger onChange callback
      if (onChange) {
        onChange(canvas);
      }
      
      // Final render
      canvas.renderAll();
      
      // Reset drawing state
      resetDrawingState();
    } catch (error) {
      console.error('Error in handlePointerUp:', error);
      toast.error('Error completing line drawing');
      
      // Log the error for debugging
      logDrawingEvent('Error in pointer up', 'line-end-error', {
        point,
        error: error instanceof Error ? error.message : String(error),
        inputMethod
      });
      
      // Clean up
      if (distanceTooltipRef.current) {
        const parent = distanceTooltipRef.current.parentElement;
        if (parent) {
          parent.removeChild(distanceTooltipRef.current);
        }
        distanceTooltipRef.current = null;
      }
      
      setIsDrawing(false);
      resetDrawingState();
    }
  }, [
    fabricCanvasRef, 
    isDrawing, 
    currentLineRef, 
    startPointRef, 
    distanceTooltipRef, 
    setIsDrawing, 
    setStartPoint, 
    setCurrentLine, 
    resetDrawingState, 
    saveCurrentState, 
    onChange, 
    snapToAngle, 
    snapAngleDeg, 
    snapEnabled, 
    snapLineToGrid, 
    lineColor,
    inputMethod,
    logDrawingEvent
  ]);
  
  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
};
