
/**
 * Canvas interaction hook
 * Provides utilities for handling canvas interactions like panning, zooming, and tool selection
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import logger from '@/utils/logger';

interface UseCanvasInteractionProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  initialTool?: DrawingMode;
  onToolChange?: (tool: DrawingMode) => void;
  enableTouch?: boolean;
}

export const useCanvasInteraction = ({
  fabricCanvasRef,
  initialTool = DrawingMode.SELECT,
  onToolChange,
  enableTouch = true
}: UseCanvasInteractionProps) => {
  const [currentTool, setCurrentTool] = useState<DrawingMode>(initialTool);
  const [isInteracting, setIsInteracting] = useState(false);
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const interactionStartRef = useRef<{ x: number, y: number } | null>(null);
  
  // Change the current tool
  const changeTool = useCallback((tool: DrawingMode) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    try {
      // Update drawing mode based on tool
      canvas.isDrawingMode = tool === DrawingMode.DRAW;
      
      // Enable selection for select tool
      canvas.selection = tool === DrawingMode.SELECT;
      
      // Update cursor based on tool
      switch (tool) {
        case DrawingMode.SELECT:
          canvas.defaultCursor = 'default';
          break;
        case DrawingMode.DRAW:
          canvas.defaultCursor = 'crosshair';
          break;
        case DrawingMode.HAND:
          canvas.defaultCursor = 'grab';
          break;
        default:
          canvas.defaultCursor = 'default';
      }
      
      // Update state
      setCurrentTool(tool);
      
      // Notify parent
      if (onToolChange) {
        onToolChange(tool);
      }
      
      logger.debug('Tool changed', { tool });
    } catch (error) {
      logger.error('Error changing tool', { error, tool });
    }
  }, [fabricCanvasRef, onToolChange]);
  
  // Pan the canvas (hand tool)
  const startPanning = useCallback((event: MouseEvent) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || currentTool !== DrawingMode.HAND) return;
    
    interactionStartRef.current = { x: event.clientX, y: event.clientY };
    setIsInteracting(true);
    
    // Change cursor to indicate active panning
    canvas.defaultCursor = 'grabbing';
    
    // Disable object selection while panning
    canvas.selection = false;
  }, [fabricCanvasRef, currentTool]);
  
  // Pan the canvas as the mouse moves
  const doPanning = useCallback((event: MouseEvent) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isInteracting || !interactionStartRef.current) return;
    
    const delta = {
      x: event.clientX - interactionStartRef.current.x,
      y: event.clientY - interactionStartRef.current.y
    };
    
    // Update pan position
    const vpt = canvas.viewportTransform;
    if (!vpt) return;
    
    vpt[4] += delta.x;
    vpt[5] += delta.y;
    
    // Update interaction start for continuous panning
    interactionStartRef.current = { x: event.clientX, y: event.clientY };
    
    canvas.requestRenderAll();
  }, [fabricCanvasRef, isInteracting]);
  
  // Stop panning
  const stopPanning = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || currentTool !== DrawingMode.HAND) return;
    
    interactionStartRef.current = null;
    setIsInteracting(false);
    
    // Reset cursor
    canvas.defaultCursor = 'grab';
    
    // Handle tool-specific cleanup
    if (currentTool === DrawingMode.SELECT) {
      canvas.selection = true;
    }
  }, [fabricCanvasRef, currentTool]);
  
  // Set up event listeners for canvas interaction
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const handleMouseDown = (e: MouseEvent) => {
      if (currentTool === DrawingMode.HAND) {
        startPanning(e);
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      // Track pointer position for UI and hooks
      setPointerPosition({
        x: e.clientX,
        y: e.clientY
      });
      
      // Handle panning
      if (currentTool === DrawingMode.HAND && isInteracting) {
        doPanning(e);
      }
    };
    
    const handleMouseUp = () => {
      if (currentTool === DrawingMode.HAND) {
        stopPanning();
      }
    };
    
    // Add event listeners
    canvas.wrapperEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      // Remove event listeners
      canvas.wrapperEl.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [fabricCanvasRef, currentTool, isInteracting, startPanning, doPanning, stopPanning]);
  
  // Set up touch event handlers
  useEffect(() => {
    if (!enableTouch) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Helper to get touch position
    const getTouchPos = (e: TouchEvent) => {
      const touch = e.touches[0];
      return { x: touch.clientX, y: touch.clientY };
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      if (currentTool === DrawingMode.HAND) {
        interactionStartRef.current = getTouchPos(e);
        setIsInteracting(true);
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isInteracting || !interactionStartRef.current) return;
      
      const currentPos = getTouchPos(e);
      
      if (currentTool === DrawingMode.HAND) {
        const delta = {
          x: currentPos.x - interactionStartRef.current.x,
          y: currentPos.y - interactionStartRef.current.y
        };
        
        // Update pan position
        const vpt = canvas.viewportTransform;
        if (!vpt) return;
        
        vpt[4] += delta.x;
        vpt[5] += delta.y;
        
        // Update interaction start for continuous panning
        interactionStartRef.current = currentPos;
        
        canvas.requestRenderAll();
      }
    };
    
    const handleTouchEnd = () => {
      interactionStartRef.current = null;
      setIsInteracting(false);
    };
    
    // Add touch event listeners
    canvas.wrapperEl.addEventListener('touchstart', handleTouchStart);
    canvas.wrapperEl.addEventListener('touchmove', handleTouchMove);
    canvas.wrapperEl.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      // Remove touch event listeners
      canvas.wrapperEl.removeEventListener('touchstart', handleTouchStart);
      canvas.wrapperEl.removeEventListener('touchmove', handleTouchMove);
      canvas.wrapperEl.removeEventListener('touchend', handleTouchEnd);
    };
  }, [fabricCanvasRef, currentTool, isInteracting, enableTouch]);
  
  return {
    currentTool,
    changeTool,
    isInteracting,
    pointerPosition
  };
};
