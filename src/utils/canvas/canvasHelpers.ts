
import { Canvas as FabricCanvas } from "fabric";

/**
 * Safely get canvas from ref
 * @param ref Canvas reference object
 * @returns The canvas instance or null if not available
 */
export const getCanvas = (ref: { current: FabricCanvas | null }): FabricCanvas | null => {
  const canvas = ref.current;
  if (!canvas) return null;
  return canvas;
};

/**
 * Safely render canvas
 * @param canvas Canvas instance
 */
export const safeRender = (canvas?: FabricCanvas | null): void => {
  if (canvas) canvas.requestRenderAll();
};

/**
 * Default fabric object options
 * Common settings for non-interactive fabric objects
 */
export const defaultFabricOptions = {
  selectable: false,
  evented: false,
  objectCaching: true,
};

/**
 * Default fabric interactive object options
 * Common settings for interactive fabric objects
 */
export const defaultInteractiveOptions = {
  selectable: true,
  evented: true,
  objectCaching: true,
};

/**
 * Default grid options
 * Common settings for grid lines
 */
export const gridLineOptions = {
  ...defaultFabricOptions,
  stroke: '#e0e0e0',
  strokeWidth: 1,
  objectType: 'grid',
  isGrid: true,
};

/**
 * Safely dispose canvas
 * @param canvas Canvas instance
 */
export const safeDispose = (canvas?: FabricCanvas | null): void => {
  if (canvas) {
    try {
      canvas.dispose();
    } catch (err) {
      console.error('Error disposing canvas:', err);
    }
  }
};

/**
 * Check if canvas is valid and usable
 * @param canvas Canvas instance to check
 * @returns True if canvas is valid and usable
 */
export const isCanvasValid = (canvas: FabricCanvas | null): boolean => {
  return Boolean(
    canvas && 
    !canvas.disposed && 
    canvas.width !== undefined && 
    canvas.height !== undefined
  );
};

/**
 * Detect Apple Pencil or stylus from a pointer event
 * @param event Pointer event to analyze
 * @returns True if the event was created by a stylus or Apple Pencil
 */
export const isStylus = (event: PointerEvent | Touch): boolean => {
  // For PointerEvent
  if ('pointerType' in event) {
    return event.pointerType === 'pen';
  }
  
  // For TouchEvent - use Apple-specific properties
  const touchEvent = event as any;
  if (touchEvent.touchType === 'stylus') {
    return true;
  }
  
  // Check for force (pressure) - usually only available with stylus
  if (touchEvent.force !== undefined && touchEvent.force > 0) {
    return true;
  }
  
  // Check for small radius - stylus has smaller touch radius than finger
  if (touchEvent.radiusX !== undefined && touchEvent.radiusY !== undefined) {
    return touchEvent.radiusX < 10 && touchEvent.radiusY < 10;
  }
  
  return false;
};

/**
 * Optimize canvas for stylus input
 * Sets up necessary configurations and event handling
 * @param canvas Canvas instance to optimize
 */
export const optimizeForStylus = (canvas: FabricCanvas): void => {
  // Get the HTML canvas element
  const canvasElement = canvas.getElement();
  
  // Apply touch action none to prevent browser gestures
  canvasElement.style.touchAction = 'none';
  
  // Apply CSS classes for iPad optimization
  canvasElement.classList.add('touch-optimized-canvas');
  
  // Disable default selection behavior during drawing
  canvas.selection = false;
  
  // Store original line thickness for pressure sensitivity
  (canvas as any)._originalLineThickness = canvas.freeDrawingBrush.width || 2;
  
  console.log('Canvas optimized for stylus input');
};

/**
 * Apply pressure sensitivity to line thickness
 * @param canvas Canvas instance
 * @param event Pointer event with pressure data
 */
export const applyPressureSensitivity = (canvas: FabricCanvas, event: PointerEvent | any): void => {
  if (!canvas.freeDrawingBrush) return;
  
  const originalThickness = (canvas as any)._originalLineThickness || 2;
  let pressure = 1;
  
  // Get pressure from event
  if ('pressure' in event && event.pressure !== undefined) {
    pressure = event.pressure;
  } else if ('force' in event && event.force !== undefined) {
    pressure = event.force;
  }
  
  // Ensure minimum thickness for visibility
  pressure = Math.max(pressure, 0.5);
  
  // Apply pressure to line thickness
  canvas.freeDrawingBrush.width = originalThickness * pressure;
};

/**
 * Configure canvas for optimal drawing experience
 * Sets up all necessary optimizations for drawing tools
 * @param canvas Canvas instance to configure
 */
export const setupOptimalDrawingExperience = (canvas: FabricCanvas): void => {
  optimizeForStylus(canvas);
  
  // Add iOS-specific styles to document
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    document.body.classList.add('ios-device');
  }
  
  // Disable context menu on canvas to improve experience
  canvas.getElement().addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });
};
