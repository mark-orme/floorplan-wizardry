
/**
 * Utilities for handling touch gestures on Fabric.js canvas
 * Provides multi-touch support for mobile devices
 * @module fabric/gestures
 */
import { Canvas } from 'fabric';
import type { CustomTouchEvent, CustomFabricTouchEvent } from '@/types/fabric';

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

  const getTouchPosition = (touch: Touch): { x: number; y: number } => {
    const rect = canvas.getElement().getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  };

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    const customEvent = e as CustomTouchEvent;
    const touches = Array.from(customEvent.touches);

    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const touchPosition = getTouchPosition(touch);

      ongoingTouches.push({
        touches: [touchPosition],
        e: touch
      });
    }

    // Log touch start for debugging
    console.log("Touch start event:", ongoingTouches.length, "touches");
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const customEvent = e as CustomTouchEvent;
    const touches = Array.from(customEvent.touches);

    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const touchPosition = getTouchPosition(touch);

      const ongoingTouchIndex = ongoingTouches.findIndex(t => {
        return isTouch(t.e) && t.e.identifier === touch.identifier;
      });

      if (ongoingTouchIndex !== -1) {
        ongoingTouches[ongoingTouchIndex] = {
          touches: [touchPosition],
          e: touch
        };
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    const customEvent = e as CustomTouchEvent;
    const touches = Array.from(customEvent.changedTouches);

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

    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      ongoingTouches = ongoingTouches.filter(t => {
        return !isTouch(t.e) || t.e.identifier !== touch.identifier;
      });
    }
  };

  // Add event listeners
  const canvasElement = canvas.getElement();
  canvasElement.addEventListener('touchstart', handleTouchStart, { passive: false });
  canvasElement.addEventListener('touchmove', handleTouchMove, { passive: false });
  canvasElement.addEventListener('touchend', handleTouchEnd, { passive: false });
  canvasElement.addEventListener('touchcancel', handleTouchCancel, { passive: false });

  // Log initialization
  console.log("Touch gestures initialized for canvas");
};
