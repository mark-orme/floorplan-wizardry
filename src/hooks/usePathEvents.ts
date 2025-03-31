
/**
 * Hook for handling path drawing events on canvas
 * Provides handlers for mouse/touch events during drawing
 * @module hooks/usePathEvents
 */
import { useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingTool } from '@/types/core/DrawingTool';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Geometry';

/**
 * Props for usePathEvents hook
 */
export interface UsePathEventsProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Start drawing at a point */
  startDrawing?: (point: Point) => void;
  /** Continue drawing to a point */
  continueDrawing?: (point: Point) => void;
  /** End drawing at a point */
  endDrawing?: (point: Point) => void;
  /** Cancel drawing operation */
  cancelDrawing?: () => void;
  /** Save the current canvas state to history */
  saveCurrentState?: () => void;
  /** Line thickness for drawing */
  lineThickness?: number;
  /** Line color for drawing */
  lineColor?: string;
}

/**
 * Return type for usePathEvents hook
 */
export interface UsePathEventsResult {
  /** Handle mouse down event */
  handleMouseDown: (e: MouseEvent | TouchEvent) => void;
  /** Handle mouse move event */
  handleMouseMove: (e: MouseEvent | TouchEvent) => void;
  /** Handle mouse up event */
  handleMouseUp: (e: MouseEvent | TouchEvent) => void;
  /** Clean up any active timeouts */
  cleanupTimeouts: () => void;
}

/**
 * Hook for handling path events during drawing
 * 
 * @param {UsePathEventsProps} props - Hook properties
 * @returns {UsePathEventsResult} Event handlers for path drawing
 */
export function usePathEvents({
  fabricCanvasRef,
  tool,
  startDrawing,
  continueDrawing,
  endDrawing,
  cancelDrawing,
  saveCurrentState,
  lineThickness = 2,
  lineColor = '#000000'
}: UsePathEventsProps): UsePathEventsResult {
  // Reference to store active timeouts for cleanup
  const timeoutRef = useRef<number[]>([]);
  
  /**
   * Convert event coordinates to canvas point
   * 
   * @param {MouseEvent | TouchEvent} e - Mouse or touch event
   * @returns {Point | null} Canvas point or null if canvas not available
   */
  const getCanvasPoint = useCallback((e: MouseEvent | TouchEvent): Point | null => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    let clientX: number;
    let clientY: number;
    
    // Handle both mouse and touch events
    if ('touches' in e) {
      // Touch event
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Convert client coordinates to canvas coordinates
    const rect = canvas.getElement().getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Account for canvas zoom and pan
    const point = canvas.getPointer(e);
    return { x: point.x, y: point.y };
  }, [fabricCanvasRef]);
  
  /**
   * Handle mouse down event
   * 
   * @param {MouseEvent | TouchEvent} e - Mouse or touch event
   */
  const handleMouseDown = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Return early if tool is select or not a drawing tool
    if (tool === DrawingMode.SELECT || 
        tool === DrawingMode.PAN || 
        tool === DrawingMode.HAND) {
      return;
    }
    
    // Get point from event
    const point = getCanvasPoint(e);
    if (!point) return;
    
    // Save current state before starting new drawing
    if (saveCurrentState) {
      saveCurrentState();
    }
    
    // Start drawing at the point
    if (startDrawing) {
      startDrawing(point);
    }
    
    // Prevent default to avoid text selection
    e.preventDefault();
  }, [fabricCanvasRef, tool, getCanvasPoint, saveCurrentState, startDrawing]);
  
  /**
   * Handle mouse move event
   * 
   * @param {MouseEvent | TouchEvent} e - Mouse or touch event
   */
  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    // Get point from event
    const point = getCanvasPoint(e);
    if (!point) return;
    
    // Continue drawing to the point
    if (continueDrawing) {
      continueDrawing(point);
    }
    
    // Prevent default to avoid text selection during drawing
    e.preventDefault();
  }, [getCanvasPoint, continueDrawing]);
  
  /**
   * Handle mouse up event
   * 
   * @param {MouseEvent | TouchEvent} e - Mouse or touch event
   */
  const handleMouseUp = useCallback((e: MouseEvent | TouchEvent) => {
    // Get point from event
    const point = getCanvasPoint(e);
    if (!point) return;
    
    // End drawing at the point
    if (endDrawing) {
      endDrawing(point);
    }
    
    // Prevent default
    e.preventDefault();
  }, [getCanvasPoint, endDrawing]);
  
  /**
   * Clean up any active timeouts
   */
  const cleanupTimeouts = useCallback(() => {
    // Clear all timeouts
    timeoutRef.current.forEach(timeoutId => window.clearTimeout(timeoutId));
    timeoutRef.current = [];
    
    // Cancel drawing if active
    if (cancelDrawing) {
      cancelDrawing();
    }
  }, [cancelDrawing]);
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cleanupTimeouts
  };
}
