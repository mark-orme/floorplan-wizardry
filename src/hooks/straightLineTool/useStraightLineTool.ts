
import { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import logger from '@/utils/logger';
import { Point } from '@/types/core/Point';
import { useLineState, InputMethod } from './useLineState';
import { MeasurementData } from '@/types/measurement/MeasurementData';

interface StraightLineToolProps {
  canvas: FabricCanvas | null;
  enabled: boolean;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

export const useStraightLineTool = ({
  canvas,
  enabled,
  lineColor,
  lineThickness,
  saveCurrentState
}: StraightLineToolProps) => {
  // Initialize the line state
  const lineState = useLineState({ 
    fabricCanvasRef: { current: canvas }, 
    lineColor, 
    lineThickness,
    saveCurrentState 
  });
  
  // Line measurement data
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    distance: null,
    angle: null,
    unit: 'px'
  });
  
  // Detect Apple Pencil and other input methods
  const detectInputMethod = useCallback((e: PointerEvent) => {
    const isPen = e.pointerType === 'pen';
    lineState.setIsPencilMode(isPen);
    lineState.setInputMethod(isPen ? InputMethod.PENCIL : (e.pointerType === 'touch' ? InputMethod.TOUCH : InputMethod.MOUSE));
    
    // Log input method for debugging
    if (isPen) {
      logger.info('Apple Pencil or stylus detected', {
        pointerType: e.pointerType,
        pressure: e.pressure,
        tiltX: e.tiltX,
        tiltY: e.tiltY
      });
    }
  }, [lineState]);
  
  // Handle pointer down event
  const handlePointerDown = useCallback((event: any) => {
    if (!canvas || !enabled) return;
    
    const pointer = canvas.getPointer(event.e);
    const point = { x: pointer.x, y: pointer.y };
    
    lineState.startDrawing(point);
    
    // Update measurement data
    setMeasurementData({
      distance: 0,
      angle: 0,
      snapped: false,
      unit: 'px'
    });
  }, [canvas, enabled, lineState]);
  
  // Handle pointer move event
  const handlePointerMove = useCallback((event: any) => {
    if (!canvas || !enabled || !lineState.isDrawing) return;
    
    const pointer = canvas.getPointer(event.e);
    const point = { x: pointer.x, y: pointer.y };
    
    lineState.continueDrawing(point);
    
    // Calculate measurements for the display
    if (lineState.startPoint) {
      const dx = point.x - lineState.startPoint.x;
      const dy = point.y - lineState.startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      
      setMeasurementData({
        distance,
        angle,
        snapped: false, // We'll add snapping logic later
        unit: 'px'
      });
    }
  }, [canvas, enabled, lineState]);
  
  // Handle pointer up event
  const handlePointerUp = useCallback((event: any) => {
    if (!canvas || !enabled || !lineState.isDrawing) return;
    
    const pointer = canvas.getPointer(event.e);
    const point = { x: pointer.x, y: pointer.y };
    
    lineState.completeDrawing(point);
  }, [canvas, enabled, lineState]);
  
  // Attach event listeners when the tool is activated
  useEffect(() => {
    if (!canvas || !enabled) return;
    
    logger.info('Activating straight line tool');
    
    // Set up canvas for drawing
    canvas.isDrawingMode = false;
    canvas.selection = false;
    canvas.defaultCursor = 'crosshair';
    
    // Attach event listeners
    canvas.on('mouse:down', handlePointerDown);
    canvas.on('mouse:move', handlePointerMove);
    canvas.on('mouse:up', handlePointerUp);
    
    // Attach pointer events for input detection
    const canvasElement = canvas.getElement();
    canvasElement.addEventListener('pointerdown', detectInputMethod);
    
    // Attach keyboard events for esc to cancel
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        lineState.cancelDrawing();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Disable object selection on all canvas objects
    canvas.getObjects().forEach(obj => {
      obj.selectable = false;
    });
    
    return () => {
      // Clean up when tool is deactivated
      logger.info('Deactivating straight line tool');
      
      canvas.off('mouse:down', handlePointerDown);
      canvas.off('mouse:move', handlePointerMove);
      canvas.off('mouse:up', handlePointerUp);
      
      canvasElement.removeEventListener('pointerdown', detectInputMethod);
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore object selectability
      canvas.getObjects().forEach(obj => {
        obj.selectable = true;
      });
      
      canvas.defaultCursor = 'default';
      canvas.renderAll();
    };
  }, [
    canvas, 
    enabled, 
    handlePointerDown, 
    handlePointerMove, 
    handlePointerUp,
    detectInputMethod,
    lineState
  ]);
  
  // Toggle snap to grid
  const toggleGridSnapping = useCallback(() => {
    lineState.toggleSnap();
  }, [lineState]);
  
  // Toggle angle constraints
  const toggleAngles = useCallback(() => {
    lineState.toggleAngles();
  }, [lineState]);
  
  return {
    isEnabled: enabled,
    isActive: lineState.isDrawing || enabled, 
    isDrawing: lineState.isDrawing,
    currentLine: lineState.currentLine,
    inputMethod: lineState.inputMethod,
    isPencilMode: lineState.isPencilMode,
    snapEnabled: lineState.snapEnabled,
    anglesEnabled: lineState.anglesEnabled,
    measurementData,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    toggleGridSnapping,
    toggleAngles,
    cancelDrawing: lineState.cancelDrawing
  };
};

// Re-export InputMethod for use in other components
export { InputMethod } from './useLineState';
export { useLineState } from './useLineState';
