
import { useState, useCallback, useRef, useEffect } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { InputMethod, useLineInputMethod } from './useLineInputMethod';
import { MeasurementData, UseStraightLineToolProps, UseStraightLineToolResult } from './useStraightLineTool.d';
import { toast } from 'sonner';

export const useStraightLineTool = ({
  isEnabled = false,
  enabled = false,
  canvas,
  lineColor,
  lineThickness,
  saveCurrentState,
  shiftKeyPressed = false,
  isActive = false
}: UseStraightLineToolProps): UseStraightLineToolResult => {
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [anglesEnabled, setAnglesEnabled] = useState(true);
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    distance: null,
    angle: null,
    snapped: false,
    unit: 'px'
  });

  const actualEnabled = isEnabled || enabled;
  const inputMethod = useLineInputMethod();

  const startDrawing = useCallback((point: Point) => {
    if (!canvas || !actualEnabled) return;
    
    const line = new Line([point.x, point.y, point.x, point.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: false,
      evented: false
    });
    
    canvas.add(line);
    setCurrentLine(line);
    setIsDrawing(true);
    canvas.renderAll();
  }, [canvas, actualEnabled, lineColor, lineThickness]);

  const continueDrawing = useCallback((point: Point) => {
    if (!canvas || !currentLine || !isDrawing) return;
    
    currentLine.set({
      x2: point.x,
      y2: point.y
    });
    
    // Update measurement data
    const startX = currentLine.x1 || 0;
    const startY = currentLine.y1 || 0;
    const distance = Math.sqrt(Math.pow(point.x - startX, 2) + Math.pow(point.y - startY, 2));
    const angle = Math.atan2(point.y - startY, point.x - startX) * (180 / Math.PI);
    
    setMeasurementData({
      distance,
      angle,
      snapped: snapEnabled,
      unit: 'px'
    });
    
    canvas.renderAll();
  }, [canvas, currentLine, isDrawing, snapEnabled]);

  const endDrawing = useCallback(() => {
    setIsDrawing(false);
    if (currentLine) {
      currentLine.selectable = true;
      currentLine.evented = true;
    }
    setCurrentLine(null);
  }, [currentLine]);

  const completeDrawing = useCallback((point: Point) => {
    if (!canvas || !currentLine) return;
    
    continueDrawing(point);
    endDrawing();
    
    // Call saveCurrentState if it exists
    if (saveCurrentState && typeof saveCurrentState === 'function') {
      saveCurrentState();
    }
    
    toast.success('Line completed');
  }, [canvas, currentLine, continueDrawing, endDrawing, saveCurrentState]);

  const cancelDrawing = useCallback(() => {
    if (!canvas || !currentLine) return;
    
    canvas.remove(currentLine);
    setCurrentLine(null);
    setIsDrawing(false);
    canvas.renderAll();
  }, [canvas, currentLine]);

  const toggleGridSnapping = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);

  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);

  const handlePointerDown = useCallback((event: any) => {
    if (!actualEnabled || !canvas) return;
    const pointer = canvas.getPointer(event.e);
    startDrawing(pointer);
  }, [actualEnabled, canvas, startDrawing]);

  const handlePointerMove = useCallback((event: any) => {
    if (!isDrawing || !canvas) return;
    const pointer = canvas.getPointer(event.e);
    continueDrawing(pointer);
  }, [isDrawing, canvas, continueDrawing]);

  const handlePointerUp = useCallback((event: any) => {
    if (!isDrawing || !canvas) return;
    const pointer = canvas.getPointer(event.e);
    completeDrawing(pointer);
  }, [isDrawing, canvas, completeDrawing]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && isDrawing) {
      cancelDrawing();
    }
  }, [isDrawing, cancelDrawing]);

  const handleKeyUp = useCallback(() => {
    // Handle key up events
  }, []);

  const renderTooltip = useCallback(() => {
    if (!isDrawing || !measurementData.distance) return null;
    
    return null; // Tooltip rendering would be implemented here
  }, [isDrawing, measurementData]);

  // Set up event listeners
  useEffect(() => {
    if (!canvas || !actualEnabled) return;

    canvas.on('mouse:down', handlePointerDown);
    canvas.on('mouse:move', handlePointerMove);
    canvas.on('mouse:up', handlePointerUp);

    return () => {
      canvas.off('mouse:down', handlePointerDown);
      canvas.off('mouse:move', handlePointerMove);
      canvas.off('mouse:up', handlePointerUp);
    };
  }, [canvas, actualEnabled, handlePointerDown, handlePointerMove, handlePointerUp]);

  return {
    isActive: actualEnabled,
    isEnabled: actualEnabled,
    currentLine,
    isToolInitialized: true,
    isDrawing,
    inputMethod,
    isPencilMode: inputMethod === InputMethod.PENCIL,
    snapEnabled,
    anglesEnabled,
    measurementData,
    toggleGridSnapping,
    toggleAngles,
    toggleSnap: toggleGridSnapping,
    startDrawing,
    continueDrawing,
    endDrawing,
    completeDrawing,
    cancelDrawing,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleKeyDown,
    handleKeyUp,
    renderTooltip,
    setInputMethod: () => {},
    shiftKeyPressed,
    setCurrentLine,
    saveCurrentState: saveCurrentState || (() => {})
  };
};
