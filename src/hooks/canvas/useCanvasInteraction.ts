/**
 * Canvas Interaction Hook
 * Manages user interactions with the canvas (pan, zoom, select)
 */
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { requestOptimizedRender } from '@/utils/canvas/renderOptimizer';
import logger from '@/utils/logger';

interface UseCanvasInteractionProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  onZoomChange?: (zoom: number) => void;
  onPanChange?: (x: number, y: number) => void;
  maxZoom?: number;
  minZoom?: number;
}

export const useCanvasInteraction = ({
  fabricCanvasRef,
  tool,
  onZoomChange,
  onPanChange,
  maxZoom = 10,
  minZoom = 0.1
}: UseCanvasInteractionProps) => {
  const isDraggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const currentZoomRef = useRef(1);
  
  // Update canvas based on tool
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Configure canvas based on tool
    if (tool === DrawingMode.HAND) {
      canvas.selection = false;
      canvas.defaultCursor = 'grab';
      canvas.hoverCursor = 'grab';
      
      // Disable selection for all objects
      canvas.forEachObject(obj => {
        obj.selectable = false;
        (obj as any).evented = false;
      });
    } else if (tool === DrawingMode.SELECT) {
      canvas.selection = true;
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'move';
      
      // Enable selection for all non-grid objects
      canvas.forEachObject(obj => {
        if (!(obj as any).isGrid) {
          obj.selectable = true;
          (obj as any).evented = true;
        }
      });
    } else {
      // Other tools
      canvas.selection = false;
      canvas.defaultCursor = 'crosshair';
      
      // Disable selection for all objects
      canvas.forEachObject(obj => {
        obj.selectable = false;
        (obj as any).evented = false;
      });
    }
    
    canvas.requestRenderAll();
  }, [fabricCanvasRef, tool]);
  
  // Handle mouse wheel for zooming
  const handleMouseWheel = useCallback((e: WheelEvent) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const delta = e.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    
    // Clamp zoom level
    zoom = Math.min(Math.max(minZoom, zoom), maxZoom);
    
    // Get mouse position in canvas coordinates
    const pointer = canvas.getPointer(e);
    
    // Zoom to point
    canvas.zoomToPoint({ x: pointer.x, y: pointer.y }, zoom);
    
    // Update zoom reference
    currentZoomRef.current = zoom;
    
    // Notify listeners
    if (onZoomChange) {
      onZoomChange(zoom);
    }
    
    // Optimize rendering
    requestOptimizedRender(canvas, 'zoom');
    
    e.preventDefault();
    e.stopPropagation();
  }, [fabricCanvasRef, maxZoom, minZoom, onZoomChange]);
  
  // Handle mouse down for panning
  const handleMouseDown = useCallback((e: MouseEvent) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Only enable panning in HAND mode
    if (tool !== DrawingMode.HAND) return;
    
    // Store initial position
    isDraggingRef.current = true;
    lastPosRef.current = {
      x: e.clientX,
      y: e.clientY
    };
    
    canvas.defaultCursor = 'grabbing';
    canvas.hoverCursor = 'grabbing';
  }, [fabricCanvasRef, tool]);
  
  // Handle mouse move for panning
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isDraggingRef.current) return;
    
    // Calculate delta
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    
    // Update last position
    lastPosRef.current = {
      x: e.clientX,
      y: e.clientY
    };
    
    // Pan viewport
    const vpt = canvas.viewportTransform;
    if (!vpt) return;
    
    vpt[4] += dx;
    vpt[5] += dy;
    
    // Notify listeners
    if (onPanChange) {
      onPanChange(vpt[4], vpt[5]);
    }
    
    // Optimize rendering
    requestOptimizedRender(canvas, 'pan');
  }, [fabricCanvasRef, onPanChange]);
  
  // Handle mouse up for panning
  const handleMouseUp = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Reset dragging state
    isDraggingRef.current = false;
    
    // Reset cursor if in HAND mode
    if (tool === DrawingMode.HAND) {
      canvas.defaultCursor = 'grab';
      canvas.hoverCursor = 'grab';
    }
  }, [fabricCanvasRef, tool]);
  
  // Attach event listeners
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Function to get canvas element
    const getCanvasElement = (): HTMLElement | null => {
      return canvas.wrapperEl;
    };
    
    // Get canvas element
    const canvasElement = getCanvasElement();
    if (!canvasElement) {
      logger.warn('Canvas wrapper element not found');
      return;
    }
    
    // Add event listeners
    canvasElement.addEventListener('wheel', handleMouseWheel, { passive: false });
    canvasElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Clean up event listeners
    return () => {
      canvasElement.removeEventListener('wheel', handleMouseWheel);
      canvasElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [fabricCanvasRef, handleMouseWheel, handleMouseDown, handleMouseMove, handleMouseUp]);
  
  // Reset zoom and pan
  const resetView = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Reset zoom and pan
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    
    // Update zoom reference
    currentZoomRef.current = 1;
    
    // Notify listeners
    if (onZoomChange) {
      onZoomChange(1);
    }
    
    if (onPanChange) {
      onPanChange(0, 0);
    }
    
    // Render canvas
    canvas.requestRenderAll();
  }, [fabricCanvasRef, onZoomChange, onPanChange]);
  
  // Zoom to fit content
  const zoomToFit = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Get all non-grid objects
    const objects = canvas.getObjects().filter(obj => !(obj as any).isGrid);
    if (objects.length === 0) return;
    
    // Calculate bounding box
    const bounds = objects.reduce((acc, obj) => {
      const objBounds = obj.getBoundingRect();
      return {
        left: Math.min(acc.left, objBounds.left),
        top: Math.min(acc.top, objBounds.top),
        right: Math.max(acc.right, objBounds.left + objBounds.width),
        bottom: Math.max(acc.bottom, objBounds.top + objBounds.height)
      };
    }, { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });
    
    // Calculate required zoom
    const boundsWidth = bounds.right - bounds.left;
    const boundsHeight = bounds.bottom - bounds.top;
    
    const canvasWidth = canvas.width || 1;
    const canvasHeight = canvas.height || 1;
    
    // Add padding
    const padding = 50;
    const zoomX = (canvasWidth - padding * 2) / boundsWidth;
    const zoomY = (canvasHeight - padding * 2) / boundsHeight;
    
    // Use minimum zoom to ensure all content is visible
    const zoom = Math.min(zoomX, zoomY);
    
    // Clamp zoom level
    const clampedZoom = Math.min(Math.max(minZoom, zoom), maxZoom);
    
    // Set zoom and center content
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]); // Reset first
    
    // Calculate center of bounds
    const centerX = (bounds.left + bounds.right) / 2;
    const centerY = (bounds.top + bounds.bottom) / 2;
    
    // Calculate center of canvas
    const canvasCenterX = canvasWidth / 2;
    const canvasCenterY = canvasHeight / 2;
    
    // Set zoom and pan
    canvas.setZoom(clampedZoom);
    canvas.absolutePan({
      x: centerX * clampedZoom - canvasCenterX,
      y: centerY * clampedZoom - canvasCenterY
    });
    
    // Update zoom reference
    currentZoomRef.current = clampedZoom;
    
    // Notify listeners
    if (onZoomChange) {
      onZoomChange(clampedZoom);
    }
    
    // Render canvas
    canvas.requestRenderAll();
  }, [fabricCanvasRef, minZoom, maxZoom, onZoomChange]);
  
  return {
    resetView,
    zoomToFit,
    currentZoom: currentZoomRef.current
  };
};
