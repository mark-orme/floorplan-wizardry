
/**
 * Enhanced pointer event support
 * Implements Pointer Events Level 3 with pressure sensitivity and stylus support
 * @module utils/canvas/pointerEvents
 */
import { Canvas as FabricCanvas } from 'fabric';
import logger from '../logger';

// Define interface for pressure-sensitive pointer events
export interface EnhancedPointerEvent extends Omit<PointerEvent, 'pressure' | 'tiltX' | 'tiltY' | 'tangentialPressure' | 'twist'> {
  // Define these properties as optional to handle browser compatibility
  pressure?: number;
  tiltX?: number;
  tiltY?: number;
  tangentialPressure?: number;
  twist?: number;
}

// Define interfaces for pen/stylus properties
export interface StylusState {
  pressure: number;
  tiltX: number;
  tiltY: number;
  isStylus: boolean;
  pointerType: string;
}

// Default stylus state
const DEFAULT_STYLUS_STATE: StylusState = {
  pressure: 0.5,
  tiltX: 0,
  tiltY: 0,
  isStylus: false,
  pointerType: 'mouse'
};

/**
 * Attach enhanced pointer events to a canvas element
 * 
 * @param canvas Fabric canvas instance
 * @param options Configuration options
 * @returns Function to remove attached event listeners
 */
export function attachEnhancedPointerEvents(
  canvas: FabricCanvas,
  options: {
    onPressureChange?: (pressure: number) => void;
    onTiltChange?: (tiltX: number, tiltY: number) => void;
    onStylusDetected?: (isStylus: boolean) => void;
    enablePressure?: boolean;
    enableTilt?: boolean;
    debugEvents?: boolean;
  } = {}
): () => void {
  // Default options
  const config = {
    enablePressure: true,
    enableTilt: true,
    debugEvents: false,
    ...options
  };
  
  // Set up state tracking
  const currentState = { ...DEFAULT_STYLUS_STATE };
  const pressureThrottleTime = 16; // Limit to ~60fps
  let lastPressureUpdate = 0;
  
  // Get canvas DOM element
  const canvasEl = canvas.getElement();
  
  // Check for pointer events support
  const hasPointerEvents = 'PointerEvent' in window;
  if (!hasPointerEvents) {
    logger.warn('Pointer Events API not supported. Pressure sensitivity disabled.');
    return () => {}; // Return no-op cleanup function
  }
  
  // Function to handle pressure changes
  const handlePressureChange = (e: EnhancedPointerEvent) => {
    if (!config.enablePressure) return;
    
    // Skip if throttling
    const now = performance.now();
    if (now - lastPressureUpdate < pressureThrottleTime) return;
    lastPressureUpdate = now;
    
    // Get pressure value with fallback
    const pressure = 
      e.pressure !== undefined ? e.pressure : 
      (e as any).webkitForce !== undefined ? (e as any).webkitForce / 3 : 
      currentState.isStylus ? 0.5 : 0;
    
    // Only update if changed significantly
    if (Math.abs(pressure - currentState.pressure) > 0.01) {
      currentState.pressure = pressure;
      
      if (config.debugEvents) {
        logger.debug(`Pressure: ${pressure.toFixed(2)}`);
      }
      
      if (options.onPressureChange) {
        options.onPressureChange(pressure);
      }
      
      // Update brush size based on pressure if in drawing mode
      if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
        const baseBrushWidth = (canvas.freeDrawingBrush as any).baseWidth || canvas.freeDrawingBrush.width || 2;
        const minWidth = baseBrushWidth * 0.5;
        const maxWidth = baseBrushWidth * 2.0;
        
        // Scale width based on pressure, with minimum size at 0 pressure
        const newWidth = minWidth + (maxWidth - minWidth) * pressure;
        canvas.freeDrawingBrush.width = newWidth;
      }
    }
  };
  
  // Function to handle tilt changes
  const handleTiltChange = (e: EnhancedPointerEvent) => {
    if (!config.enableTilt) return;
    
    // Check if tilt is available
    if (e.tiltX === undefined || e.tiltY === undefined) return;
    
    // Only update if changed significantly
    if (Math.abs(e.tiltX - currentState.tiltX) > 1 || 
        Math.abs(e.tiltY - currentState.tiltY) > 1) {
      
      currentState.tiltX = e.tiltX;
      currentState.tiltY = e.tiltY;
      
      if (config.debugEvents) {
        logger.debug(`Tilt X: ${e.tiltX.toFixed(1)}, Tilt Y: ${e.tiltY.toFixed(1)}`);
      }
      
      if (options.onTiltChange) {
        options.onTiltChange(e.tiltX, e.tiltY);
      }
    }
  };
  
  // Function to handle stylus detection
  const handleStylusDetection = (e: EnhancedPointerEvent) => {
    const isStylus = e.pointerType === 'pen';
    
    if (isStylus !== currentState.isStylus) {
      currentState.isStylus = isStylus;
      currentState.pointerType = e.pointerType;
      
      if (config.debugEvents) {
        logger.debug(`Stylus ${isStylus ? 'detected' : 'removed'}, pointer type: ${e.pointerType}`);
      }
      
      if (options.onStylusDetected) {
        options.onStylusDetected(isStylus);
      }
      
      // Store original brush width when stylus is detected
      if (isStylus && canvas.isDrawingMode && canvas.freeDrawingBrush) {
        (canvas.freeDrawingBrush as any).baseWidth = canvas.freeDrawingBrush.width;
      }
    }
  };
  
  // Define event handlers
  const pointerDownHandler = (e: PointerEvent) => {
    const enhancedEvent = e as unknown as EnhancedPointerEvent;
    handleStylusDetection(enhancedEvent);
    handlePressureChange(enhancedEvent);
    handleTiltChange(enhancedEvent);
  };
  
  const pointerMoveHandler = (e: PointerEvent) => {
    const enhancedEvent = e as EnhancedPointerEvent;
    handlePressureChange(enhancedEvent);
    handleTiltChange(enhancedEvent);
  };
  
  const pointerUpHandler = (e: PointerEvent) => {
    // Reset pressure when pointer is released
    if (currentState.pressure > 0) {
      currentState.pressure = 0;
      
      if (options.onPressureChange) {
        options.onPressureChange(0);
      }
    }
  };
  
  // Attach event listeners
  canvasEl.addEventListener('pointerdown', pointerDownHandler);
  canvasEl.addEventListener('pointermove', pointerMoveHandler);
  canvasEl.addEventListener('pointerup', pointerUpHandler);
  canvasEl.addEventListener('pointercancel', pointerUpHandler);
  canvasEl.addEventListener('pointerleave', pointerUpHandler);
  
  // Log initialization
  logger.info('Enhanced pointer events initialized', {
    supportsPressure: 'pressure' in new PointerEvent('pointerdown'),
    supportsTilt: 'tiltX' in new PointerEvent('pointerdown'),
    canvasEl: canvasEl.id || 'unknown'
  });
  
  // Return cleanup function
  return () => {
    canvasEl.removeEventListener('pointerdown', pointerDownHandler);
    canvasEl.removeEventListener('pointermove', pointerMoveHandler);
    canvasEl.removeEventListener('pointerup', pointerUpHandler);
    canvasEl.removeEventListener('pointercancel', pointerUpHandler);
    canvasEl.removeEventListener('pointerleave', pointerUpHandler);
    logger.debug('Enhanced pointer events removed');
  };
}

/**
 * Detect if device supports pressure sensitivity
 * 
 * @returns Boolean indicating pressure sensitivity support
 */
export function supportsPressureSensitivity(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check pointer events support first
  if (!('PointerEvent' in window)) return false;
  
  try {
    const testEvent = new PointerEvent('pointerdown');
    return 'pressure' in testEvent;
  } catch (e) {
    return false;
  }
}

/**
 * Detect if device supports stylus tilt
 * 
 * @returns Boolean indicating tilt support
 */
export function supportsTilt(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check pointer events support first
  if (!('PointerEvent' in window)) return false;
  
  try {
    const testEvent = new PointerEvent('pointerdown');
    return 'tiltX' in testEvent && 'tiltY' in testEvent;
  } catch (e) {
    return false;
  }
}

/**
 * Create a vibration feedback for drawing operations
 * 
 * @param pattern Vibration pattern as single duration or pattern array
 * @returns Boolean indicating if vibration was successful
 */
export function vibrateFeedback(pattern: number | number[] = 10): boolean {
  // Check if vibration API is supported
  if (typeof navigator === 'undefined' || !navigator.vibrate) {
    return false;
  }
  
  try {
    return navigator.vibrate(pattern);
  } catch (e) {
    logger.debug('Vibration error', { error: e });
    return false;
  }
}
