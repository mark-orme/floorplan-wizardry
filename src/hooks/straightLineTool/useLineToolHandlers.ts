
import { useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas, Line, Circle, Shadow } from 'fabric';
import { Point } from '@/types/core/Point';
import { useLineState } from './useLineState';
import { useLineInputMethod, InputMethod } from './useLineInputMethod';
import { useEnhancedGridSnapping } from './useEnhancedGridSnapping';
import { useLinePreview } from './useLinePreview';

interface UseLineToolHandlersProps {
  canvas: FabricCanvas | null;
  enabled: boolean;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
  snapColor?: string;
  snapTolerance?: number;
}

export const useLineToolHandlers = ({
  canvas,
  enabled,
  lineColor,
  lineThickness,
  saveCurrentState,
  snapColor = '#3b82f6', // Default blue color for snap indications
  snapTolerance = 10
}: UseLineToolHandlersProps) => {
  const [isActive, setIsActive] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [previewLine, setPreviewLine] = useState<Line | null>(null);
  const [snapIndicator, setSnapIndicator] = useState<any | null>(null);
  const { inputMethod, isPencilMode, detectInputMethod } = useLineInputMethod();
  const { snapEnabled, toggleSnap, snapToGrid } = useEnhancedGridSnapping();
  const { getLinePreview } = useLinePreview(20, snapTolerance);
  const [anglesEnabled, setAnglesEnabled] = useState(true);
  const measurementDataRef = useRef({ distance: null, angle: null, snapped: false });
  const [measurementData, setMeasurementData] = useState({ 
    distance: null, 
    angle: null, 
    snapped: false, 
    unit: 'px',
    snapType: undefined as 'grid' | 'angle' | 'both' | undefined
  });
  
  // Track modifier keys state
  const [shiftKeyPressed, setShiftKeyPressed] = useState(false);
  
  const resetState = () => {
    setStartPoint(null);
    if (previewLine && canvas) {
      canvas.remove(previewLine);
    }
    setPreviewLine(null);
    removeSnapIndicator();
  };

  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);

  const toggleGridSnapping = useCallback(() => {
    toggleSnap();
  }, [toggleSnap]);
  
  // Helper to create a glowing snap indicator at the endpoint
  const createSnapIndicator = useCallback((point: Point, type: 'grid' | 'angle' | 'both') => {
    if (!canvas) return null;
    
    // Remove existing indicator first
    removeSnapIndicator();
    
    // Different colors for different snap types
    let indicatorColor = snapColor;
    if (type === 'angle') indicatorColor = '#f97316'; // Orange for angle snaps
    if (type === 'both') indicatorColor = '#8b5cf6'; // Purple for both
    
    // Create a circle with glowing effect
    const circle = new Circle({
      left: point.x - 5,
      top: point.y - 5,
      radius: 5,
      fill: indicatorColor,
      stroke: '#ffffff',
      strokeWidth: 2,
      selectable: false,
      evented: false,
      objectCaching: false,
      shadow: new Shadow({
        color: indicatorColor,
        blur: 15,
        offsetX: 0,
        offsetY: 0
      })
    });
    
    canvas.add(circle);
    canvas.bringToFront(circle);
    setSnapIndicator(circle);
    
    return circle;
  }, [canvas, snapColor]);
  
  // Helper to remove the snap indicator
  const removeSnapIndicator = useCallback(() => {
    if (snapIndicator && canvas) {
      canvas.remove(snapIndicator);
      setSnapIndicator(null);
    }
  }, [canvas, snapIndicator]);
  
  // Setup keyboard event listeners
  useCallback(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftKeyPressed(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftKeyPressed(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!canvas || !enabled) return;

    detectInputMethod(e);

    const pointer = canvas.getPointer(e);
    const startPoint = { x: pointer.x, y: pointer.y };
    const snappedStart = snapToGrid(startPoint);

    setStartPoint(snappedStart);

    const line = new Line([snappedStart.x, snappedStart.y, snappedStart.x, snappedStart.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      strokeDashArray: [5, 5], // Start with dashed line for preview
      selectable: false,
      evented: false,
      objectCaching: false
    });

    canvas.add(line);
    setPreviewLine(line);
    setIsActive(true);
  }, [canvas, enabled, lineColor, lineThickness, detectInputMethod, snapToGrid]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!canvas || !isActive || !startPoint || !previewLine) return;
    
    const pointer = canvas.getPointer(e);
    const currentPoint = { x: pointer.x, y: pointer.y };
    
    // Get line preview with snapping
    const linePreview = getLinePreview(
      startPoint, 
      currentPoint, 
      snapEnabled, 
      anglesEnabled, 
      shiftKeyPressed
    );
    
    // Update preview line
    previewLine.set({
      x2: linePreview.endPoint.x,
      y2: linePreview.endPoint.y
    });
    
    // Apply different style if snapped
    if (linePreview.isSnapped) {
      previewLine.set({
        stroke: linePreview.snapType === 'angle' ? '#f97316' : 
               linePreview.snapType === 'both' ? '#8b5cf6' : 
               snapColor,
        strokeDashArray: undefined
      });
      
      // Show snap indicator
      if (linePreview.snapType) {
        createSnapIndicator(linePreview.endPoint, linePreview.snapType);
      }
    } else {
      previewLine.set({
        stroke: lineColor,
        strokeDashArray: [5, 5]
      });
      
      // Remove snap indicator if not snapped
      removeSnapIndicator();
    }
    
    canvas.renderAll();
    
    // Calculate distance and angle
    const dx = linePreview.endPoint.x - startPoint.x;
    const dy = linePreview.endPoint.y - startPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // Update measurement data
    measurementDataRef.current = {
      distance: Math.round(distance),
      angle: Math.round(angle),
      snapped: linePreview.isSnapped
    };
    
    setMeasurementData({
      distance: Math.round(distance),
      angle: Math.round(angle),
      snapped: linePreview.isSnapped,
      unit: 'px',
      snapType: linePreview.snapType
    });
  }, [canvas, isActive, startPoint, previewLine, snapEnabled, 
      lineColor, snapColor, getLinePreview, anglesEnabled, 
      shiftKeyPressed, createSnapIndicator, removeSnapIndicator]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!canvas || !isActive || !startPoint || !previewLine) return;

    const pointer = canvas.getPointer(e);
    const endPoint = { x: pointer.x, y: pointer.y };
    
    // Get the final snapped position
    const linePreview = getLinePreview(
      startPoint, 
      endPoint, 
      snapEnabled, 
      anglesEnabled, 
      shiftKeyPressed
    );

    // Update the line to final position
    previewLine.set({
      x2: linePreview.endPoint.x,
      y2: linePreview.endPoint.y,
      strokeDashArray: undefined,
      selectable: true,
      evented: true,
      objectCaching: true,
      stroke: lineColor // Final line is always in the standard line color
    });

    canvas.renderAll();
    saveCurrentState();
    
    // Clean up
    resetState();
    setIsActive(false);
    removeSnapIndicator();
  }, [canvas, isActive, startPoint, previewLine, snapEnabled, 
      getLinePreview, anglesEnabled, shiftKeyPressed, saveCurrentState, 
      lineColor, removeSnapIndicator]);

  return {
    isActive,
    inputMethod,
    isPencilMode,
    snapEnabled,
    anglesEnabled,
    shiftKeyPressed,
    measurementData,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    toggleGridSnapping,
    toggleAngles
  };
};
