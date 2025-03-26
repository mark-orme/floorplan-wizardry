
/**
 * Gestures for fabric.js canvas
 * Utilities for handling touch and mouse gestures on canvas
 * @module fabric/gestures
 */
import { Canvas as FabricCanvas, Point as FabricPoint } from "fabric";
import logger from "@/utils/logger";

// Custom interface for our touch events
interface CustomTouchEvent {
  touches: { clientX: number; clientY: number; force?: number }[];
  preventDefault: () => void;
}

// Custom interface for fabric event with touches
interface CustomFabricTouchEvent {
  e: CustomTouchEvent;
}

/**
 * Initialize touch and mouse gestures for canvas
 * @param canvas - Fabric canvas to initialize gestures on
 */
export const initializeCanvasGestures = (canvas: FabricCanvas): void => {
  if (!canvas) {
    logger.error("Cannot initialize gestures on null canvas");
    return;
  }
  
  try {
    // Set up pinch zoom for touch devices
    setupPinchZoom(canvas);
    
    // Set up mouse wheel zoom
    setupMousewheelZoom(canvas);
    
    logger.info("Canvas gestures initialized successfully");
  } catch (error) {
    logger.error("Error initializing canvas gestures:", error);
  }
};

/**
 * Set up pinch zoom for touch devices
 * @param canvas - Fabric canvas to set up
 */
const setupPinchZoom = (canvas: FabricCanvas): void => {
  if (!canvas) return;
  
  let lastDistance = 0;
  let isDragging = false;
  let lastPoint: { x: number, y: number } | null = null;
  
  // Use native DOM event listeners instead of fabric events for touch
  canvas.upperCanvasEl.addEventListener('touchstart', (e: TouchEvent) => {
    if (!e.touches) return;
    
    if (e.touches.length === 2) {
      // Pinch start - calculate initial distance
      const point1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      const point2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };
      lastDistance = getDistance(point1, point2);
    } else if (e.touches.length === 1) {
      // Single touch - start dragging
      isDragging = true;
      lastPoint = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });
  
  canvas.upperCanvasEl.addEventListener('touchmove', (e: TouchEvent) => {
    if (!e.touches) return;
    
    if (e.touches.length === 2) {
      // Pinch move - handle zoom
      e.preventDefault();
      const point1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      const point2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };
      const distance = getDistance(point1, point2);
      
      if (lastDistance > 0) {
        const midpoint = {
          x: (point1.x + point2.x) / 2,
          y: (point1.y + point2.y) / 2
        };
        
        // Calculate zoom ratio
        const zoomRatio = distance / lastDistance;
        const currentZoom = canvas.getZoom();
        const zoom = currentZoom * zoomRatio;
        
        // Convert to fabric point for zooming
        const fabric_point = new FabricPoint(midpoint.x, midpoint.y);
        
        // Apply zoom with limits
        canvas.zoomToPoint(fabric_point, Math.min(Math.max(zoom, 0.1), 10));
        
        // Trigger custom event for zoom change tracking
        canvas.fire('custom:zoom-changed', { zoom });
      }
      
      lastDistance = distance;
    } else if (e.touches.length === 1 && isDragging && lastPoint) {
      // Single touch move - handle panning
      const currentPoint = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      const deltaX = currentPoint.x - lastPoint.x;
      const deltaY = currentPoint.y - lastPoint.y;
      
      const vpt = canvas.viewportTransform!;
      vpt[4] += deltaX;
      vpt[5] += deltaY;
      canvas.requestRenderAll();
      
      lastPoint = currentPoint;
    }
  });
  
  canvas.upperCanvasEl.addEventListener('touchend', () => {
    // Reset state
    lastDistance = 0;
    isDragging = false;
    lastPoint = null;
  });
};

/**
 * Set up mouse wheel zoom
 * @param canvas - Fabric canvas to set up
 */
const setupMousewheelZoom = (canvas: FabricCanvas): void => {
  if (!canvas) return;
  
  canvas.on('mouse:wheel', (opt) => {
    const e = opt.e as WheelEvent;
    e.preventDefault();
    e.stopPropagation();
    
    // Get mouse position
    const pointer = canvas.getPointer(e);
    const point = new FabricPoint(pointer.x, pointer.y);
    
    // Calculate zoom
    const delta = e.deltaY;
    const zoomFactor = delta > 0 ? 0.95 : 1.05;
    const zoom = canvas.getZoom() * zoomFactor;
    
    // Apply zoom with limits
    canvas.zoomToPoint(point, Math.min(Math.max(zoom, 0.1), 10));
    
    // Trigger custom event for zoom change tracking
    canvas.fire('custom:zoom-changed', { zoom });
  });
};

/**
 * Calculate distance between two points
 * @param point1 - First point
 * @param point2 - Second point
 * @returns Distance between points
 */
const getDistance = (point1: { x: number, y: number }, point2: { x: number, y: number }): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};
