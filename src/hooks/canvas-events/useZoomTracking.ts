
/**
 * Zoom tracking hook
 * Manages zoom level changes and tracking
 * @module canvas-events/useZoomTracking
 */
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, TEvent } from 'fabric';
import { Point } from '@/types/drawingTypes';
import { DrawingTool } from '@/hooks/useCanvasState';
import { ZOOM_CONSTANTS } from '@/constants/zoomConstants';

/**
 * Constants for zoom tracking
 */
const ZOOM_TRACKING_CONSTANTS = {
  /** Minimum time between zoom updates in ms */
  ZOOM_THROTTLE: 16,
  
  /** Multiplier for zoom factor */
  ZOOM_MULTIPLIER: 1.1,
  
  /** Minimum zoom value */
  MIN_ZOOM: ZOOM_CONSTANTS.MIN_ZOOM,
  
  /** Maximum zoom value */
  MAX_ZOOM: ZOOM_CONSTANTS.MAX_ZOOM
};

/**
 * Props for the zoom tracking hook
 */
export interface UseZoomTrackingProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Function to update zoom level */
  updateZoomLevel: () => void;
  /** Current drawing tool */
  tool: DrawingTool;
}

/**
 * Result of the zoom tracking hook
 */
export interface UseZoomTrackingResult {
  /** Function to clean up event handlers */
  cleanup: () => void;
}

/**
 * Hook for tracking zoom levels and applying constraints
 * @param props - Hook properties
 * @returns Result with cleanup function
 */
export const useZoomTracking = ({ 
  fabricCanvasRef,
  updateZoomLevel,
  tool
}: UseZoomTrackingProps): UseZoomTrackingResult => {
  // Last tracked time for throttling
  const lastZoomUpdateTimeRef = useRef<number>(0);
  
  /**
   * Handle zoom event
   */
  const handleZoom = useCallback((event: TEvent) => {
    // Throttle updates to avoid performance issues
    const now = Date.now();
    if (now - lastZoomUpdateTimeRef.current < ZOOM_TRACKING_CONSTANTS.ZOOM_THROTTLE) {
      return;
    }
    
    // Track zoom time
    lastZoomUpdateTimeRef.current = now;
    
    // Update zoom level in state
    updateZoomLevel();
    
    // Get canvas
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Apply zoom constraints
    const zoom = canvas.getZoom();
    
    // Enforce min/max zoom
    if (zoom < ZOOM_TRACKING_CONSTANTS.MIN_ZOOM) {
      canvas.zoomToPoint({ x: 0, y: 0 } as Point, ZOOM_TRACKING_CONSTANTS.MIN_ZOOM);
      updateZoomLevel();
    } else if (zoom > ZOOM_TRACKING_CONSTANTS.MAX_ZOOM) {
      canvas.zoomToPoint({ x: 0, y: 0 } as Point, ZOOM_TRACKING_CONSTANTS.MAX_ZOOM);
      updateZoomLevel();
    }
  }, [fabricCanvasRef, updateZoomLevel]);
  
  // Register event handlers
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Add event handlers
    canvas.on('zoom', handleZoom);
    
    // Set initial zoom if needed
    updateZoomLevel();
    
    return () => {
      // Clean up event handlers
      if (canvas) {
        canvas.off('zoom', handleZoom);
      }
    };
  }, [fabricCanvasRef, handleZoom, updateZoomLevel, tool]);
  
  /**
   * Clean up function
   */
  const cleanup = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      canvas.off('zoom', handleZoom);
    }
  }, [fabricCanvasRef, handleZoom]);
  
  return { cleanup };
};
