
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { calculateDistance, calculateAngle } from '@/utils/geometry/lineOperations';
import { useLinePreview } from './useLinePreview';
import { InputMethod } from './useLineInputMethod';

interface LineState {
  fabricCanvasRef: { current: any };
  isDrawing: boolean;
  snapEnabled: boolean;
  anglesEnabled: boolean;
  startPoint: Point | null;
  lineColor: string;
  lineThickness: number;
  startDrawing: (point: Point) => void;
  continueDrawing: (point: Point) => void;
  completeDrawing: (point: Point) => void;
  cancelDrawing: () => void;
  setInputMethod: (method: InputMethod) => void;
}

interface UseLineToolHandlersProps {
  lineState: LineState;
  updateMeasurementData: (data: any) => void;
}

/**
 * Hook for handling line tool mouse and touch events
 */
export const useLineToolHandlers = ({ lineState, updateMeasurementData }: UseLineToolHandlersProps) => {
  const {
    fabricCanvasRef,
    isDrawing,
    snapEnabled,
    anglesEnabled,
    startPoint,
    lineColor,
    lineThickness,
    startDrawing,
    continueDrawing,
    completeDrawing,
    cancelDrawing,
    setInputMethod
  } = lineState;
  
  // Initialize line preview functionality
  const {
    showHoverIndicator,
    hideHoverIndicator,
    updateLinePreview,
    clearLinePreview
  } = useLinePreview(
    fabricCanvasRef,
    isDrawing,
    snapEnabled,
    anglesEnabled,
    lineColor,
    lineThickness
  );
  
  /**
   * Handle mouse down event
   */
  const handleMouseDown = useCallback((e: any) => {
    // Detect input method
    const isPencil = e.e.pointerType === 'pen';
    if (isPencil) {
      setInputMethod(InputMethod.PENCIL);
    } else {
      setInputMethod(InputMethod.MOUSE);
    }
    
    // Get canvas and pointer coordinates
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const pointer = canvas.getPointer(e.e);
    const point = { x: pointer.x, y: pointer.y };
    
    // Start drawing
    startDrawing(point);
    
    // Clear hover indicator since we're now drawing
    hideHoverIndicator();
    
    // Update measurement data
    updateMeasurementData({
      distance: 0,
      angle: 0,
      snapped: false,
      unit: 'px'
    });
    
    // Prevent default behavior
    e.e.preventDefault();
  }, [
    fabricCanvasRef,
    startDrawing,
    hideHoverIndicator,
    updateMeasurementData,
    setInputMethod
  ]);
  
  /**
   * Handle mouse move event
   */
  const handleMouseMove = useCallback((e: any) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const pointer = canvas.getPointer(e.e);
    const point = { x: pointer.x, y: pointer.y };
    
    if (isDrawing && startPoint) {
      // Update line preview and get snapped point
      const linePreviewResult = updateLinePreview(startPoint, point);
      const endPoint = linePreviewResult?.endPoint || point;
      const isSnapped = linePreviewResult?.isSnapped || false;
      
      // Continue drawing with the potentially snapped point
      continueDrawing(endPoint);
      
      // Calculate measurements
      const distance = calculateDistance(startPoint, endPoint);
      const angle = calculateAngle(startPoint, endPoint);
      
      // Update measurement data
      updateMeasurementData({
        distance,
        angle,
        snapped: isSnapped,
        unit: 'px'
      });
    } else {
      // Show hover indicator at cursor position when not drawing
      showHoverIndicator(point);
    }
    
    // Prevent default behavior
    e.e.preventDefault();
  }, [
    fabricCanvasRef,
    isDrawing,
    startPoint,
    continueDrawing,
    updateLinePreview,
    showHoverIndicator,
    updateMeasurementData
  ]);
  
  /**
   * Handle mouse up event
   */
  const handleMouseUp = useCallback((e: any) => {
    if (!isDrawing) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const pointer = canvas.getPointer(e.e);
    const point = { x: pointer.x, y: pointer.y };
    
    // Complete drawing
    completeDrawing(point);
    
    // Clear line preview
    clearLinePreview();
    
    // Reset measurement data after a short delay
    setTimeout(() => {
      updateMeasurementData({
        distance: null,
        angle: null,
        snapped: false,
        unit: 'px'
      });
    }, 2000);
    
    // Prevent default behavior
    e.e.preventDefault();
  }, [
    isDrawing,
    fabricCanvasRef,
    completeDrawing,
    clearLinePreview,
    updateMeasurementData
  ]);
  
  /**
   * Handle keyboard events
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Cancel drawing when Escape key is pressed
    if (e.key === 'Escape' && isDrawing) {
      cancelDrawing();
      clearLinePreview();
      
      // Reset measurement data
      updateMeasurementData({
        distance: null,
        angle: null,
        snapped: false,
        unit: 'px'
      });
    }
  }, [isDrawing, cancelDrawing, clearLinePreview, updateMeasurementData]);
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown
  };
};
