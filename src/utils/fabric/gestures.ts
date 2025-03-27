
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
    
    // Additional setup for iOS
    setupIOSSpecificHandlers(canvas);
    
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
  let isGesturing = false;
  
  // Detect iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  // Prevent all default touch behaviors to avoid iOS Safari issues
  if (isIOS) {
    canvas.upperCanvasEl.style.touchAction = 'none';
    canvas.wrapperEl?.style.touchAction = 'none';
  }
  
  // Use native DOM event listeners for touch events
  canvas.upperCanvasEl.addEventListener('touchstart', (e: TouchEvent) => {
    // Always prevent default on iOS to avoid issues with Safari
    if (isIOS) {
      e.preventDefault();
    }
    
    if (!e.touches) return;
    
    if (e.touches.length === 2) {
      // Pinch start - calculate initial distance
      isGesturing = true;
      const point1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      const point2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };
      lastDistance = getDistance(point1, point2);
    } else if (e.touches.length === 1) {
      // Single touch - start dragging
      isDragging = true;
      lastPoint = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: false }); // passive: false is crucial for iOS
  
  canvas.upperCanvasEl.addEventListener('touchmove', (e: TouchEvent) => {
    // Always prevent default on iOS to avoid issues with Safari
    if (isIOS) {
      e.preventDefault();
    }
    
    if (!e.touches) return;
    
    if (e.touches.length === 2 && isGesturing) {
      // Pinch move - handle zoom
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
  }, { passive: false }); // passive: false is crucial for iOS
  
  canvas.upperCanvasEl.addEventListener('touchend', (e: TouchEvent) => {
    // Reset state
    lastDistance = 0;
    isDragging = false;
    isGesturing = false;
    lastPoint = null;
    
    // Prevent ghost clicks on iOS
    if (isIOS && e.cancelable) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Add special handler for touchcancel (important for iOS)
  canvas.upperCanvasEl.addEventListener('touchcancel', () => {
    // Reset state
    lastDistance = 0;
    isDragging = false;
    isGesturing = false;
    lastPoint = null;
  }, { passive: true });
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
 * Setup iOS-specific event handlers and fixes
 * @param canvas - Fabric canvas to set up
 */
const setupIOSSpecificHandlers = (canvas: FabricCanvas): void => {
  if (!canvas) return;
  
  // Detect iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  if (!isIOS) return;
  
  // Fix for iOS not recognizing touch events correctly by disabling viewport scaling
  const meta = document.querySelector('meta[name="viewport"]');
  if (meta) {
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  } else {
    const newMeta = document.createElement('meta');
    newMeta.name = 'viewport';
    newMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.getElementsByTagName('head')[0].appendChild(newMeta);
  }
  
  // Prevent all default gestures on iOS
  document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
  }, { passive: false });
  
  document.addEventListener('gesturechange', function(e) {
    e.preventDefault();
  }, { passive: false });
  
  document.addEventListener('gestureend', function(e) {
    e.preventDefault();
  }, { passive: false });
  
  // Prevent double-tap to zoom
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function(e) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
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
