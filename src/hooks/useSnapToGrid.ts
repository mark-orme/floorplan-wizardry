
/**
 * Hook for grid snapping functionality
 * Provides utilities for snapping points and lines to a grid
 * @module hooks/useSnapToGrid
 */
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Geometry';
import { Line } from '@/types/core/Geometry';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { DrawingTool } from '@/types/core/DrawingTool';
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Props for useSnapToGrid hook
 */
export interface UseSnapToGridProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>;
  /** Current active drawing tool */
  tool?: DrawingTool;
  /** Custom grid size (optional) */
  gridSize?: number;
  /** Initial snap enabled state (optional) */
  initialSnapEnabled?: boolean;
  /** Initial auto-straighten state (optional) */
  initialAutoStraighten?: boolean;
}

/**
 * Result type for the useSnapToGrid hook
 */
export interface UseSnapToGridResult {
  /** Whether snap-to-grid is enabled */
  snapEnabled: boolean;
  /** Whether auto-straightening is enabled */
  isAutoStraightened: boolean;
  /** Toggle the snap-to-grid feature */
  toggleSnap: () => void;
  /** Toggle the auto-straightening feature */
  toggleAutoStraighten: () => void;
  /** Snap a point to the nearest grid point */
  snapPointToGrid: (point: Point) => Point;
  /** Snap a line to the grid and apply auto-straightening if enabled */
  snapLineToGrid: (startPoint: Point, endPoint: Point) => Line;
  /** Check if a point is already on the grid */
  isSnappedToGrid: (point: Point) => boolean;
  /** Get the current grid size */
  gridSize: number;
  /** Show grid snapping guide (visual indicator) */
  showSnapGuide: (point: Point) => void;
  /** Hide grid snapping guide */
  hideSnapGuide: () => void;
}

/**
 * Hook for managing grid snapping functionality
 * 
 * @param {UseSnapToGridProps} props - Hook props
 * @returns {UseSnapToGridResult} Snap-to-grid utilities and state
 */
export function useSnapToGrid({
  fabricCanvasRef,
  tool,
  gridSize: customGridSize,
  initialSnapEnabled = true,
  initialAutoStraighten = false
}: UseSnapToGridProps = {}): UseSnapToGridResult {
  // State for snap toggle
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  const [isAutoStraightened, setIsAutoStraightened] = useState(initialAutoStraighten);
  
  // Constants for grid snapping
  const gridSize = useMemo(() => customGridSize || GRID_CONSTANTS.SMALL_GRID_SIZE, 
    [customGridSize]);
  const snapThreshold = useMemo(() => gridSize / 3, [gridSize]);
  
  // Reference to snap guide elements
  const snapGuideRef = useMemo(() => ({
    horizontal: null as HTMLDivElement | null,
    vertical: null as HTMLDivElement | null
  }), []);
  
  // Create snap guides on mount
  useEffect(() => {
    // Create guide elements if they don't exist
    if (!snapGuideRef.horizontal) {
      const horizontal = document.createElement('div');
      horizontal.className = 'snap-guide horizontal';
      horizontal.style.cssText = 'position: absolute; height: 1px; background-color: #ff0000; pointer-events: none; opacity: 0; transition: opacity 0.2s ease;';
      document.body.appendChild(horizontal);
      snapGuideRef.horizontal = horizontal;
    }
    
    if (!snapGuideRef.vertical) {
      const vertical = document.createElement('div');
      vertical.className = 'snap-guide vertical';
      vertical.style.cssText = 'position: absolute; width: 1px; background-color: #ff0000; pointer-events: none; opacity: 0; transition: opacity 0.2s ease;';
      document.body.appendChild(vertical);
      snapGuideRef.vertical = vertical;
    }
    
    // Cleanup on unmount
    return () => {
      if (snapGuideRef.horizontal) {
        document.body.removeChild(snapGuideRef.horizontal);
      }
      if (snapGuideRef.vertical) {
        document.body.removeChild(snapGuideRef.vertical);
      }
    };
  }, [snapGuideRef]);
  
  /**
   * Toggle the snap-to-grid feature
   */
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  /**
   * Toggle the auto-straightening feature
   */
  const toggleAutoStraighten = useCallback(() => {
    setIsAutoStraightened(prev => !prev);
  }, []);
  
  /**
   * Determine if a point is already snapped to the grid
   * 
   * @param {Point} point - The point to check
   * @returns {boolean} Whether the point is on a grid point
   */
  const isSnappedToGrid = useCallback((point: Point): boolean => {
    if (!snapEnabled) return false;
    
    const isXOnGrid = Math.abs(Math.round(point.x / gridSize) * gridSize - point.x) < snapThreshold;
    const isYOnGrid = Math.abs(Math.round(point.y / gridSize) * gridSize - point.y) < snapThreshold;
    
    return isXOnGrid && isYOnGrid;
  }, [snapEnabled, gridSize, snapThreshold]);
  
  /**
   * Snap a point to the nearest grid point if snap is enabled
   * 
   * @param {Point} point - The point to snap
   * @returns {Point} The snapped point or original point if snap is disabled
   */
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;
    
    // Only snap when using certain tools
    if (tool && [
      DrawingMode.SELECT, 
      DrawingMode.PAN, 
      DrawingMode.HAND, 
      DrawingMode.ZOOM
    ].includes(tool)) {
      return point;
    }
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [snapEnabled, gridSize, tool]);
  
  /**
   * Snap a line to the grid and apply auto-straightening if enabled
   * 
   * @param {Point} startPoint - The starting point of the line
   * @param {Point} endPoint - The ending point of the line
   * @returns {Line} The snapped line
   */
  const snapLineToGrid = useCallback((startPoint: Point, endPoint: Point): Line => {
    const start = snapPointToGrid(startPoint);
    let end = snapPointToGrid(endPoint);
    
    // Apply auto-straightening logic if enabled
    if (isAutoStraightened) {
      const dx = Math.abs(end.x - start.x);
      const dy = Math.abs(end.y - start.y);
      
      // Horizontal, vertical, or 45-degree diagonal lines
      if (dx > dy * 2) {
        // Horizontal line
        end = { ...end, y: start.y };
      } else if (dy > dx * 2) {
        // Vertical line
        end = { ...end, x: start.x };
      } else if (Math.abs(dx - dy) < gridSize / 2) {
        // 45-degree diagonal line
        const avg = (dx + dy) / 2;
        if (end.x > start.x) {
          end.x = start.x + avg;
        } else {
          end.x = start.x - avg;
        }
        
        if (end.y > start.y) {
          end.y = start.y + avg;
        } else {
          end.y = start.y - avg;
        }
      }
    }
    
    return {
      start,
      end
    };
  }, [snapPointToGrid, isAutoStraightened, gridSize]);
  
  /**
   * Show grid snapping guide at a point
   * 
   * @param {Point} point - Point to show guide at
   */
  const showSnapGuide = useCallback((point: Point) => {
    if (!snapEnabled || !fabricCanvasRef?.current) return;
    
    const canvas = fabricCanvasRef.current;
    const canvasEl = canvas.getElement();
    const rect = canvasEl.getBoundingClientRect();
    
    // Get snapped point
    const snappedPoint = snapPointToGrid(point);
    
    // Convert to screen coordinates
    const screenX = snappedPoint.x * canvas.getZoom() + rect.left;
    const screenY = snappedPoint.y * canvas.getZoom() + rect.top;
    
    // Show guides
    if (snapGuideRef.horizontal) {
      snapGuideRef.horizontal.style.left = `${rect.left}px`;
      snapGuideRef.horizontal.style.top = `${screenY}px`;
      snapGuideRef.horizontal.style.width = `${rect.width}px`;
      snapGuideRef.horizontal.style.opacity = '0.7';
    }
    
    if (snapGuideRef.vertical) {
      snapGuideRef.vertical.style.left = `${screenX}px`;
      snapGuideRef.vertical.style.top = `${rect.top}px`;
      snapGuideRef.vertical.style.height = `${rect.height}px`;
      snapGuideRef.vertical.style.opacity = '0.7';
    }
  }, [snapEnabled, fabricCanvasRef, snapPointToGrid, snapGuideRef]);
  
  /**
   * Hide grid snapping guide
   */
  const hideSnapGuide = useCallback(() => {
    if (snapGuideRef.horizontal) {
      snapGuideRef.horizontal.style.opacity = '0';
    }
    
    if (snapGuideRef.vertical) {
      snapGuideRef.vertical.style.opacity = '0';
    }
  }, [snapGuideRef]);
  
  // Automatically turn off snapping for certain tools
  useEffect(() => {
    if (tool === DrawingMode.DRAW) {
      // Free drawing doesn't work well with snapping
      if (snapEnabled) {
        setSnapEnabled(false);
      }
    } else if ([DrawingMode.LINE, DrawingMode.STRAIGHT_LINE, DrawingMode.WALL].includes(tool as DrawingMode)) {
      // These tools work best with auto-straightening
      if (!isAutoStraightened) {
        setIsAutoStraightened(true);
      }
    }
  }, [tool, snapEnabled, isAutoStraightened]);
  
  return {
    snapEnabled,
    isAutoStraightened,
    toggleSnap,
    toggleAutoStraighten,
    snapPointToGrid,
    snapLineToGrid,
    isSnappedToGrid,
    gridSize,
    showSnapGuide,
    hideSnapGuide
  };
}
