
/**
 * Hook for handling path-related canvas events
 * @module canvas-events/usePathEvents
 */
import { useCallback, useEffect } from 'react';
import { Path as FabricPath } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { EventHandlerResult } from './types';

/**
 * Props for path events hook
 */
export interface UsePathEventsProps {
  /** Reference to fabric canvas */
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
  /** Current drawing tool */
  tool: DrawingMode;
  /** Save current canvas state */
  saveCurrentState: () => void;
  /** Process a newly created path */
  processCreatedPath?: (path: FabricPath) => void;
  /** Handle mouse up event */
  handleMouseUp?: (e?: MouseEvent | TouchEvent) => void;
}

/**
 * Hook for handling path-related events on canvas
 * @param {UsePathEventsProps} props Path event props
 * @returns {EventHandlerResult} Path event handler result
 */
export const usePathEvents = ({
  fabricCanvasRef,
  tool,
  saveCurrentState,
  processCreatedPath,
  handleMouseUp
}: UsePathEventsProps): EventHandlerResult => {
  /**
   * Handler for path creation completed event
   * @param {object} e Event object containing the created path
   */
  const handlePathCreated = useCallback((e: any) => {
    if (!fabricCanvasRef.current) return;
    
    // Save current state before making changes
    saveCurrentState();
    
    const path = e.path as FabricPath;
    
    // Pass path to processing function if provided
    if (processCreatedPath) {
      processCreatedPath(path);
    }
    
    // Handle mouse up if provided (some tools need this)
    if (handleMouseUp) {
      handleMouseUp();
    }
  }, [fabricCanvasRef, saveCurrentState, processCreatedPath, handleMouseUp]);
  
  /**
   * Register path event handlers
   */
  const register = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    // Add path created event listener
    fabricCanvasRef.current.on('path:created', handlePathCreated);
  }, [fabricCanvasRef, handlePathCreated]);
  
  /**
   * Unregister path event handlers
   */
  const unregister = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    // Remove path created event listener
    fabricCanvasRef.current.off('path:created', handlePathCreated);
  }, [fabricCanvasRef, handlePathCreated]);
  
  /**
   * Clean up resources
   */
  const cleanup = useCallback(() => {
    unregister();
  }, [unregister]);
  
  // Register path event handlers when component mounts
  useEffect(() => {
    register();
    return cleanup;
  }, [register, cleanup]);
  
  return {
    register,
    unregister,
    cleanup
  };
};
