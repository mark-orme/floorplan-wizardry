/**
 * Gesture utilities for fabric.js
 * Provides helpers for handling touch and mouse gestures
 * @module utils/fabric/gestures
 */
import { Canvas, PencilBrush, Point, Object as FabricObject } from 'fabric';
import { CustomTouchEvent, FabricPointerEvent, isTouchEvent, isMouseEvent } from '@/types/fabric';
import { toFabricPoint } from '@/utils/fabricPointConverter';
import { FabricEventNames } from '@/types/fabric-events';

/**
 * Touch gesture constants for event handling
 * @constant {Object}
 */
const TOUCH_CONSTANTS = {
  /**
   * Minimum radius for non-stylus touch
   * Used for detecting Apple Pencil vs finger touch
   * @constant {number}
   */
  MIN_STYLUS_RADIUS: 10,
  
  /**
   * Minimal pressure multiplier to ensure visibility
   * @constant {number}
   */
  MIN_PRESSURE_MULTIPLIER: 0.5,
  
  /**
   * Default pressure value when not available
   * @constant {number}
   */
  DEFAULT_FORCE: 1,
  
  /**
   * Default brush width when not specified
   * @constant {number}
   */
  DEFAULT_BRUSH_WIDTH: 2,
  
  /**
   * Event logging interval in ms
   * Used to throttle gesture debug logging
   * @constant {number}
   */
  EVENT_LOG_INTERVAL: 1000,
  
  /**
   * Touch start debug message
   * @constant {string}
   */
  TOUCH_START_MSG: "Touch start event",
  
  /**
   * Touch end debug message
   * @constant {string}
   */
  TOUCH_END_MSG: "Touch end event, remaining touches",
  
  /**
   * Drawing started debug message
   * @constant {string}
   */
  DRAWING_STARTED_MSG: "Drawing started",
  
  /**
   * Drawing ended debug message
   * @constant {string}
   */
  DRAWING_ENDED_MSG: "Drawing ended",
  
  /**
   * Apple Pencil support message
   * @constant {string}
   */
  APPLE_PENCIL_MSG: "with Apple Pencil support",
  
  /**
   * Standard touch support message
   * @constant {string}
   */
  STANDARD_TOUCH_MSG: "with standard touch support",
  
  /**
   * Touch gestures initialized message
   * @constant {string}
   */
  GESTURES_INIT_MSG: "Touch gestures initialized for canvas"
};

// Define custom interface for compatible pointer events
interface CompatiblePointerEvent {
  e: Event;
  pointer: Point;
  absolutePointer: Point;
  scenePoint: Point;
  viewportPoint: Point;
  isClick?: boolean;
  currentSubTargets?: FabricObject[];
}

// Define a proper TouchRecord to store touch data
interface TouchRecord {
  // Original touch event
  originalEvent: TouchEvent;
  // Touch identifier for tracking
  identifier: number;
  // Position information
  position: Point;
}

/**
 * Type guard to check if a value is a Touch
 * Validates that the object has the correct Touch interface properties
 * 
 * @param {unknown} value - Value to check
 * @returns {boolean} True if the value is a Touch
 */
function isTouch(value: unknown): value is Touch {
  return typeof value === 'object' && 
         value !== null && 
         'identifier' in value && 
         'clientX' in value && 
         'clientY' in value;
}

/**
 * Initialize touch gestures for the canvas
 * Sets up event handlers for touch events including Apple Pencil support
 * 
 * @param {Canvas} canvas - The Fabric.js canvas instance
 */
export const initializeCanvasGestures = (canvas: Canvas): void => {
  // Use a properly typed array for storing ongoing touches
  let ongoingTouches: TouchRecord[] = [];
  let isDrawing = false;
  let isPencil = false;

  // Detect if the device supports Apple Pencil
  const supportsApplePencil = 
    typeof navigator !== 'undefined' && 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  /**
   * Get touch position as Fabric Point
   * Converts browser touch coordinates to canvas coordinates
   * 
   * @param {Touch} touch - Touch event
   * @returns {Point} Fabric Point object
   */
  const getTouchPosition = (touch: Touch): Point => {
    const rect = canvas.getElement().getBoundingClientRect();
    return new Point(
      touch.clientX - rect.left,
      touch.clientY - rect.top
    );
  };

  /**
   * Function to detect Apple Pencil based on touch event properties
   * Uses Apple-specific touch properties to identify stylus input
   * 
   * @param {Touch} touch - Touch event
   * @returns {boolean} True if touch is from Apple Pencil
   */
  const isPencilTouch = (touch: Touch): boolean => {
    // Check if touch has Apple Pencil-specific properties
    return supportsApplePencil && 
          ((touch as any).touchType === 'stylus' || 
          (touch as any).radiusX < TOUCH_CONSTANTS.MIN_STYLUS_RADIUS || // Pencil has small radius
          'force' in touch); // Pencil supports pressure (force)
  };

  /**
   * Handle touch start events
   * Initiates drawing if in drawing mode
   * 
   * @param {TouchEvent} e - Touch event
   */
  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    const touches = Array.from(e.touches);

    // If in drawing mode, start the drawing path
    if (canvas.isDrawingMode && touches.length === 1) {
      isDrawing = true;
      const touch = touches[0];
      isPencil = isPencilTouch(touch);
      const touchPosition = getTouchPosition(touch);
      
      // Set brush width based on pressure if available (for Apple Pencil)
      if (isPencil && 'force' in touch && canvas.freeDrawingBrush) {
        const force = (touch as any).force || TOUCH_CONSTANTS.DEFAULT_FORCE;
        const baseWidth = canvas.freeDrawingBrush.width || TOUCH_CONSTANTS.DEFAULT_BRUSH_WIDTH;
        canvas.freeDrawingBrush.width = baseWidth * force;
      }

      // Create fabric-compatible event object
      const eventInfo: FabricPointerEvent = {
        e: e,
        pointer: touchPosition,
        absolutePointer: touchPosition.clone(),
        scenePoint: touchPosition,
        viewportPoint: touchPosition.clone(),
        isClick: true,
        currentSubTargets: []
      };
      
      // Use the canvas.fire with the EventInfo
      canvas.fire(FabricEventNames.MOUSE_DOWN, eventInfo as any);

      console.log(`${TOUCH_CONSTANTS.DRAWING_STARTED_MSG}:`, isPencil ? "Apple Pencil/Stylus" : "Touch");
    }

    // Store a record of each active touch
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const touchPosition = getTouchPosition(touch);

      ongoingTouches.push({
        originalEvent: e,
        identifier: touch.identifier,
        position: touchPosition
      });
    }

    // Log touch start for debugging
    console.log(`${TOUCH_CONSTANTS.TOUCH_START_MSG}:`, ongoingTouches.length, "touches", "isDrawingMode:", canvas.isDrawingMode);
  };

  /**
   * Handle touch move events
   * Continues drawing if in drawing mode
   * 
   * @param {TouchEvent} e - Touch event
   */
  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const touches = Array.from(e.touches);

    // If in drawing mode and already started drawing, continue the path
    if (canvas.isDrawingMode && isDrawing && touches.length === 1) {
      const touch = touches[0];
      const touchPosition = getTouchPosition(touch);
      
      // Update brush width based on pressure if available (for Apple Pencil)
      if (isPencil && 'force' in touch && canvas.freeDrawingBrush) {
        const force = (touch as any).force || TOUCH_CONSTANTS.DEFAULT_FORCE;
        const baseWidth = canvas.freeDrawingBrush.width || TOUCH_CONSTANTS.DEFAULT_BRUSH_WIDTH;
        canvas.freeDrawingBrush.width = baseWidth * Math.max(TOUCH_CONSTANTS.MIN_PRESSURE_MULTIPLIER, force);
      }

      // Create fabric-compatible event object
      const eventInfo: FabricPointerEvent = {
        e: e,
        pointer: touchPosition,
        absolutePointer: touchPosition.clone(),
        scenePoint: touchPosition, 
        viewportPoint: touchPosition.clone(),
        isClick: false,
        currentSubTargets: []
      };
      
      // Use the canvas.fire with the EventInfo
      canvas.fire(FabricEventNames.MOUSE_MOVE, eventInfo as any);
    }

    // Update the position of ongoing touches
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const touchPosition = getTouchPosition(touch);

      const ongoingTouchIndex = ongoingTouches.findIndex(t => t.identifier === touch.identifier);

      if (ongoingTouchIndex !== -1) {
        ongoingTouches[ongoingTouchIndex] = {
          originalEvent: e,
          identifier: touch.identifier,
          position: touchPosition
        };
      }
    }
  };

  /**
   * Handle touch end events
   * Completes drawing if in drawing mode
   * 
   * @param {TouchEvent} e - Touch event
   */
  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    const changedTouches = Array.from(e.changedTouches);

    // If in drawing mode and finishing drawing, complete the path
    if (canvas.isDrawingMode && isDrawing && changedTouches.length > 0) {
      isDrawing = false;
      isPencil = false;
      const touch = changedTouches[0];
      const touchPosition = getTouchPosition(touch);
      
      // Reset brush width to default if it was changed
      if (canvas.freeDrawingBrush) {
        const baseWidth = (canvas as any)._lineThickness || TOUCH_CONSTANTS.DEFAULT_BRUSH_WIDTH;
        canvas.freeDrawingBrush.width = baseWidth;
      }

      // Create fabric-compatible event object
      const eventInfo: FabricPointerEvent = {
        e: e,
        pointer: touchPosition,
        absolutePointer: touchPosition.clone(),
        scenePoint: touchPosition,
        viewportPoint: touchPosition.clone(),
        isClick: true,
        currentSubTargets: []
      };
      
      // Use the canvas.fire with the EventInfo
      canvas.fire(FabricEventNames.MOUSE_UP, eventInfo as any);

      console.log(TOUCH_CONSTANTS.DRAWING_ENDED_MSG);
    }

    // Remove ended touches from the ongoing touches array
    for (let i = 0; i < changedTouches.length; i++) {
      const touch = changedTouches[i];
      ongoingTouches = ongoingTouches.filter(t => t.identifier !== touch.identifier);
    }

    // Log touch end for debugging
    console.log(`${TOUCH_CONSTANTS.TOUCH_END_MSG}:`, ongoingTouches.length);
  };

  /**
   * Handle touch cancel events
   * Ensures drawing is properly completed if interrupted
   * 
   * @param {TouchEvent} e - Touch event
   */
  const handleTouchCancel = (e: TouchEvent) => {
    e.preventDefault();
    const changedTouches = Array.from(e.changedTouches);

    // If in drawing mode, complete the drawing path
    if (canvas.isDrawingMode && isDrawing) {
      isDrawing = false;
      isPencil = false;
      
      // Reset brush width to default
      if (canvas.freeDrawingBrush) {
        const baseWidth = (canvas as any)._lineThickness || TOUCH_CONSTANTS.DEFAULT_BRUSH_WIDTH;
        canvas.freeDrawingBrush.width = baseWidth;
      }
      
      // Get last touch if available
      if (changedTouches.length > 0) {
        const touch = changedTouches[0];
        const touchPosition = getTouchPosition(touch);
        
        // Create fabric-compatible event object
        const eventInfo: FabricPointerEvent = {
          e: e,
          pointer: touchPosition,
          absolutePointer: touchPosition.clone(),
          scenePoint: touchPosition,
          viewportPoint: touchPosition.clone(),
          isClick: false,
          currentSubTargets: []
        };
        
        // Use the canvas.fire with the EventInfo
        canvas.fire(FabricEventNames.MOUSE_UP, eventInfo as any);
      }
    }

    // Remove canceled touches from the ongoing touches array
    for (let i = 0; i < changedTouches.length; i++) {
      const touch = changedTouches[i];
      ongoingTouches = ongoingTouches.filter(t => t.identifier !== touch.identifier);
    }
  };

  // Add event listeners with proper passive settings based on function needs
  const canvasElement = canvas.getElement();
  
  // For events that call preventDefault(), we need { passive: false }
  canvasElement.addEventListener('touchstart', handleTouchStart, { passive: false });
  canvasElement.addEventListener('touchmove', handleTouchMove, { passive: false });
  canvasElement.addEventListener('touchend', handleTouchEnd, { passive: false });
  canvasElement.addEventListener('touchcancel', handleTouchCancel, { passive: false });

  // Log initialization
  console.log(`${TOUCH_CONSTANTS.GESTURES_INIT_MSG}`, 
    supportsApplePencil ? TOUCH_CONSTANTS.APPLE_PENCIL_MSG : TOUCH_CONSTANTS.STANDARD_TOUCH_MSG);
};
