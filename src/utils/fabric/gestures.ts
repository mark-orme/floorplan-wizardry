
/**
 * Utilities for handling touch gestures on Fabric.js canvas
 * Provides multi-touch support for mobile devices
 * @module fabric/gestures
 */
import { Canvas, PencilBrush, Point, Object as FabricObject } from 'fabric';
import type { CustomTouchEvent, CustomFabricTouchEvent, FabricPointerEvent } from '@/types/fabric';
import { toFabricPoint } from '@/utils/fabricPointConverter';
import { isTouchEvent, isMouseEvent } from '@/types/fabric';

/**
 * Touch gesture constants for event handling
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
  DEFAULT_FORCE: 1
};

/**
 * Type guard to check if a value is a Touch
 * @param value - Value to check
 * @returns True if the value is a Touch
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
 * @param {Canvas} canvas - The Fabric.js canvas instance
 */
export const initializeCanvasGestures = (canvas: Canvas): void => {
  let ongoingTouches: CustomFabricTouchEvent[] = [];
  let isDrawing = false;
  let isPencil = false;

  // Detect if the device supports Apple Pencil
  const supportsApplePencil = 
    typeof navigator !== 'undefined' && 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  /**
   * Get touch position as Fabric Point
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
   * @param {Touch} touch - Touch event
   * @returns {boolean} True if touch is from Apple Pencil
   */
  const isPencilTouch = (touch: Touch): boolean => {
    // Check if touch has Apple Pencil-specific properties
    return supportsApplePencil && 
          (touch as any).touchType === 'stylus' || 
          (touch as any).radiusX < TOUCH_CONSTANTS.MIN_STYLUS_RADIUS || // Pencil has small radius
          'force' in touch; // Pencil supports pressure (force)
  };

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    const customEvent = e as CustomTouchEvent;
    const touches = Array.from(customEvent.touches);

    // If in drawing mode, start the drawing path
    if (canvas.isDrawingMode && touches.length === 1) {
      isDrawing = true;
      const touch = touches[0];
      isPencil = isPencilTouch(touch);
      const touchPosition = getTouchPosition(touch);
      
      // Set brush width based on pressure if available (for Apple Pencil)
      if (isPencil && 'force' in touch && canvas.freeDrawingBrush) {
        const force = (touch as any).force || TOUCH_CONSTANTS.DEFAULT_FORCE;
        const baseWidth = canvas.freeDrawingBrush.width || 2;
        canvas.freeDrawingBrush.width = baseWidth * force;
      }

      // Create fabric-compatible event object with proper Point objects
      const eventInfo: FabricPointerEvent = {
        e: e,
        pointer: touchPosition,
        absolutePointer: touchPosition.clone(),
        scenePoint: touchPosition,
        viewportPoint: touchPosition.clone(),
        target: null,
        isClick: true,
        currentSubTargets: []
      };
      
      // Use the canvas.fire with the EventInfo
      canvas.fire('mouse:down', eventInfo);

      console.log("Drawing started:", isPencil ? "Apple Pencil/Stylus" : "Touch");
    }

    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const touchPosition = getTouchPosition(touch);

      ongoingTouches.push({
        touches: [{ x: touchPosition.x, y: touchPosition.y }],
        e: touch
      });
    }

    // Log touch start for debugging
    console.log("Touch start event:", ongoingTouches.length, "touches", "isDrawingMode:", canvas.isDrawingMode);
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const customEvent = e as CustomTouchEvent;
    const touches = Array.from(customEvent.touches);

    // If in drawing mode and already started drawing, continue the path
    if (canvas.isDrawingMode && isDrawing && touches.length === 1) {
      const touch = touches[0];
      const touchPosition = getTouchPosition(touch);
      
      // Update brush width based on pressure if available (for Apple Pencil)
      if (isPencil && 'force' in touch && canvas.freeDrawingBrush) {
        const force = (touch as any).force || TOUCH_CONSTANTS.DEFAULT_FORCE;
        const baseWidth = canvas.freeDrawingBrush.width || 2;
        canvas.freeDrawingBrush.width = baseWidth * Math.max(TOUCH_CONSTANTS.MIN_PRESSURE_MULTIPLIER, force);
      }

      // Create fabric-compatible event object with proper Point objects
      const eventInfo: FabricPointerEvent = {
        e: e,
        pointer: touchPosition,
        absolutePointer: touchPosition.clone(),
        scenePoint: touchPosition, 
        viewportPoint: touchPosition.clone(),
        target: null,
        isClick: false,
        currentSubTargets: []
      };
      
      // Use the canvas.fire with the EventInfo
      canvas.fire('mouse:move', eventInfo);
    }

    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const touchPosition = getTouchPosition(touch);

      const ongoingTouchIndex = ongoingTouches.findIndex(t => {
        return isTouch(t.e) && t.e.identifier === touch.identifier;
      });

      if (ongoingTouchIndex !== -1) {
        ongoingTouches[ongoingTouchIndex] = {
          touches: [{ x: touchPosition.x, y: touchPosition.y }],
          e: touch
        };
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    const customEvent = e as CustomTouchEvent;
    const touches = Array.from(customEvent.changedTouches);

    // If in drawing mode and finishing drawing, complete the path
    if (canvas.isDrawingMode && isDrawing && touches.length > 0) {
      isDrawing = false;
      isPencil = false;
      const touch = touches[0];
      const touchPosition = getTouchPosition(touch);
      
      // Reset brush width to default if it was changed
      if (canvas.freeDrawingBrush) {
        const baseWidth = (canvas as any)._lineThickness || 2;
        canvas.freeDrawingBrush.width = baseWidth;
      }

      // Create fabric-compatible event object with proper Point objects
      const eventInfo: FabricPointerEvent = {
        e: e,
        pointer: touchPosition,
        absolutePointer: touchPosition.clone(),
        scenePoint: touchPosition,
        viewportPoint: touchPosition.clone(),
        target: null,
        isClick: true,
        currentSubTargets: []
      };
      
      // Use the canvas.fire with the EventInfo
      canvas.fire('mouse:up', eventInfo);

      console.log("Drawing ended");
    }

    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      ongoingTouches = ongoingTouches.filter(t => {
        return !isTouch(t.e) || t.e.identifier !== touch.identifier;
      });
    }

    // Log touch end for debugging
    console.log("Touch end event, remaining touches:", ongoingTouches.length);
  };

  const handleTouchCancel = (e: TouchEvent) => {
    e.preventDefault();
    const customEvent = e as CustomTouchEvent;
    const touches = Array.from(customEvent.changedTouches);

    // If in drawing mode, complete the drawing path
    if (canvas.isDrawingMode && isDrawing) {
      isDrawing = false;
      isPencil = false;
      
      // Reset brush width to default
      if (canvas.freeDrawingBrush) {
        const baseWidth = (canvas as any)._lineThickness || 2;
        canvas.freeDrawingBrush.width = baseWidth;
      }
      
      // Get last touch if available
      if (touches.length > 0) {
        const touch = touches[0];
        const touchPosition = getTouchPosition(touch);
        
        // Create fabric-compatible event object with proper Point objects
        const eventInfo: FabricPointerEvent = {
          e: e,
          pointer: touchPosition,
          absolutePointer: touchPosition.clone(),
          scenePoint: touchPosition,
          viewportPoint: touchPosition.clone(),
          target: null,
          isClick: false,
          currentSubTargets: []
        };
        
        // Use the canvas.fire with the EventInfo
        canvas.fire('mouse:up', eventInfo);
      }
    }

    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      ongoingTouches = ongoingTouches.filter(t => {
        return !isTouch(t.e) || t.e.identifier !== touch.identifier;
      });
    }
  };

  // Add event listeners with passive: false for all touch events
  const canvasElement = canvas.getElement();
  canvasElement.addEventListener('touchstart', handleTouchStart, { passive: false });
  canvasElement.addEventListener('touchmove', handleTouchMove, { passive: false });
  canvasElement.addEventListener('touchend', handleTouchEnd, { passive: false });
  canvasElement.addEventListener('touchcancel', handleTouchCancel, { passive: false });

  // Log initialization
  console.log("Touch gestures initialized for canvas", 
    supportsApplePencil ? "with Apple Pencil support" : "with standard touch support");
};
